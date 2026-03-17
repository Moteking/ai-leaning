#!/usr/bin/env python3
"""
企業リストアップ + 営業メール自動送信スクリプト
- Claude APIで業界・規模別に営業対象企業をリストアップ
- 企業ごとにパーソナライズされた営業メールを生成
- SMTPで自動送信（1日上限20件、5分間隔）

Usage:
    python sales_email/auto_sales.py                    # リストアップ→メール生成→送信
    python sales_email/auto_sales.py --list-only        # リストアップのみ
    python sales_email/auto_sales.py --dry-run          # 生成のみ（送信しない）
    python sales_email/auto_sales.py --send-from-queue  # キューからのみ送信
"""
import argparse
import json
import smtplib
import sys
import time
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.settings import (
    FROM_EMAIL,
    FROM_NAME,
    SALES_DAILY_LIMIT,
    SALES_INTERVAL_SEC,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USER,
)
from utils import call_claude, get_logger, load_json, save_json

logger = get_logger("sales_email")
COMPANIES_FILE = Path(__file__).parent / "companies.json"
SENT_FILE = Path(__file__).parent / "sent_history.json"
QUEUE_DIR = Path(__file__).parent / "queue"


# ===== 企業リストアップ =====

INDUSTRY_TARGETS = [
    {"industry": "製造業", "size": "従業員500名以上", "region": "福岡・九州"},
    {"industry": "金融・保険", "size": "従業員200名以上", "region": "福岡・九州"},
    {"industry": "IT・SaaS", "size": "従業員100名以上", "region": "全国"},
    {"industry": "医療・ヘルスケア", "size": "従業員300名以上", "region": "福岡・九州"},
    {"industry": "小売・流通", "size": "従業員500名以上", "region": "九州"},
    {"industry": "建設・不動産", "size": "従業員200名以上", "region": "福岡"},
    {"industry": "教育", "size": "大学・専門学校", "region": "九州"},
    {"industry": "自治体・公共", "size": "市区町村以上", "region": "福岡・九州"},
]


def generate_company_list(target: dict) -> list[dict]:
    """Claude APIでターゲット企業をリストアップ"""
    prompt = f"""\
以下の条件に合う日本の企業を10社リストアップしてください。
AI活用を推進しているが、AIリスク管理体制が整っていない可能性が高い企業が望ましいです。

- 業界: {target['industry']}
- 規模: {target['size']}
- 地域: {target['region']}

## 出力形式（JSONのみ出力）
[
  {{
    "company_name": "企業名",
    "industry": "業界",
    "estimated_size": "推定従業員数",
    "region": "所在地",
    "ai_relevance": "その企業がAIリスク管理を必要とする理由（1文）",
    "contact_dept": "アプローチすべき部署（経営企画部/情報システム部/人事部など）",
    "pain_point": "想定される課題"
  }}
]

実在する企業名を挙げてください。マークダウンのコードブロックで囲わないでください。
"""
    system = "あなたは法人営業の専門家です。AIリスクコンサルティングサービスの営業対象となる企業をリストアップします。"
    result = call_claude(prompt, system=system, max_tokens=2048)
    result = result.strip()
    if result.startswith("```"):
        result = result.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(result)


def update_company_list():
    """企業リストを更新"""
    companies = load_json(COMPANIES_FILE)
    if not isinstance(companies, list):
        companies = []

    existing_names = {c["company_name"] for c in companies}

    for target in INDUSTRY_TARGETS:
        try:
            logger.info(f"企業リストアップ中: {target['industry']} / {target['region']}")
            new_companies = generate_company_list(target)
            for c in new_companies:
                if c["company_name"] not in existing_names:
                    c["added_date"] = datetime.now().isoformat()
                    c["status"] = "new"
                    companies.append(c)
                    existing_names.add(c["company_name"])
        except Exception as e:
            logger.error(f"リストアップエラー: {target['industry']} - {e}")

    save_json(COMPANIES_FILE, companies)
    logger.info(f"企業リスト更新完了: 計{len(companies)}社")
    return companies


# ===== メール生成 =====

def generate_email(company: dict) -> dict:
    """企業に合わせたパーソナライズメールを生成"""
    prompt = f"""\
以下の企業に送る営業メールを作成してください。

企業名: {company['company_name']}
業界: {company['industry']}
規模: {company['estimated_size']}
想定部署: {company['contact_dept']}
想定課題: {company['pain_point']}
AIリスク管理の必要性: {company['ai_relevance']}

## メール要件
- 件名は開封率が高くなるよう工夫
- 宛先は「{company['contact_dept']} ご担当者様」
- 冒頭で相手企業の状況に触れ、パーソナライズ
- AIリスク管理の重要性を簡潔に伝える
- 無料相談 or 無料ホワイトペーパーをCTAに
- 全体で300-400文字程度（読みやすく簡潔に）
- 押し売り感を出さない。情報提供のスタンス

## 送信者情報
- 会社名: AIリスクコンサルティング
- 所在地: 福岡市
- サービス: AIリスク管理支援（E-ラーニング/ルール策定/ガバナンス構築）

## 出力形式（JSONのみ出力）
{{
  "subject": "メール件名",
  "body_text": "メール本文（プレーンテキスト）",
  "body_html": "メール本文（HTML版）"
}}

マークダウンのコードブロックで囲わないでください。
"""
    system = "あなたは法人営業メールのエキスパートです。高い開封率・返信率を実現するパーソナライズメールを作成します。"
    result = call_claude(prompt, system=system, max_tokens=2048)
    result = result.strip()
    if result.startswith("```"):
        result = result.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(result)


# ===== メール送信 =====

def send_email(to_email: str, subject: str, body_text: str, body_html: str) -> bool:
    """SMTPでメール送信"""
    if not all([SMTP_USER, SMTP_PASSWORD, FROM_EMAIL]):
        logger.warning("SMTP設定が未完了。スキップ。")
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body_text, "plain", "utf-8"))
    msg.attach(MIMEText(body_html, "html", "utf-8"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info(f"メール送信成功: {to_email}")
        return True
    except Exception as e:
        logger.error(f"メール送信失敗: {to_email} - {e}")
        return False


def get_today_sent_count() -> int:
    """今日の送信数を取得"""
    sent = load_json(SENT_FILE)
    if not isinstance(sent, list):
        return 0
    today = datetime.now().strftime("%Y-%m-%d")
    return sum(1 for s in sent if s.get("date", "").startswith(today))


def record_sent(company_name: str, email: str, subject: str):
    """送信履歴を記録"""
    sent = load_json(SENT_FILE)
    if not isinstance(sent, list):
        sent = []
    sent.append({
        "date": datetime.now().isoformat(),
        "company": company_name,
        "email": email,
        "subject": subject,
    })
    save_json(SENT_FILE, sent)


def queue_email(company: dict, email_data: dict):
    """メールをキューに保存（手動確認 or 後で送信）"""
    QUEUE_DIR.mkdir(exist_ok=True)
    filename = f"{datetime.now():%Y%m%d_%H%M}_{company['company_name']}.json"
    save_json(QUEUE_DIR / filename, {
        "company": company,
        "email": email_data,
        "status": "queued",
        "created": datetime.now().isoformat(),
    })


def main():
    parser = argparse.ArgumentParser(description="企業リストアップ+営業メール自動送信")
    parser.add_argument("--list-only", action="store_true", help="リストアップのみ")
    parser.add_argument("--dry-run", action="store_true", help="メール生成のみ（送信しない）")
    parser.add_argument("--send-from-queue", action="store_true", help="キューから送信")
    parser.add_argument("--to-email", help="送信先メール（テスト用に1件指定）")
    args = parser.parse_args()

    logger.info("=== 営業メール自動化開始 ===")

    # 1. 企業リストアップ
    companies = load_json(COMPANIES_FILE)
    if not isinstance(companies, list) or not companies:
        logger.info("企業リストが空。新規リストアップ実行。")
        companies = update_company_list()

    if args.list_only:
        print(f"✅ 企業リスト: {len(companies)}社")
        for c in companies:
            print(f"  - {c['company_name']} ({c['industry']}) [{c.get('status', '')}]")
        return

    # 2. 未送信企業を取得
    sent = load_json(SENT_FILE)
    sent_companies = {s["company"] for s in sent} if isinstance(sent, list) else set()
    unsent = [c for c in companies if c["company_name"] not in sent_companies]

    if not unsent:
        logger.info("全企業にメール済み。リストを更新します。")
        companies = update_company_list()
        unsent = [c for c in companies if c["company_name"] not in sent_companies]

    # 3. 日次制限チェック
    today_count = get_today_sent_count()
    remaining = SALES_DAILY_LIMIT - today_count
    if remaining <= 0:
        logger.info(f"本日の送信上限({SALES_DAILY_LIMIT}件)に達しています。")
        return

    logger.info(f"未送信企業: {len(unsent)}社 / 本日残り: {remaining}件")

    # 4. メール生成→送信 or キュー
    processed = 0
    for company in unsent[:remaining]:
        try:
            logger.info(f"メール生成中: {company['company_name']}")
            email_data = generate_email(company)

            # キューに保存
            queue_email(company, email_data)

            if args.dry_run:
                logger.info(f"[DRY-RUN] 件名: {email_data['subject']}")
                print(f"📧 [DRY-RUN] {company['company_name']}: {email_data['subject']}")
            elif args.to_email:
                # テスト送信
                success = send_email(
                    args.to_email,
                    email_data["subject"],
                    email_data["body_text"],
                    email_data["body_html"],
                )
                if success:
                    record_sent(company["company_name"], args.to_email, email_data["subject"])
            else:
                # 実際のメールアドレスが必要
                # ここではキューに入れるだけ（メールアドレスは手動 or 別ツールで取得）
                logger.info(f"キューに追加: {company['company_name']} - {email_data['subject']}")
                print(f"📧 キュー追加: {company['company_name']}")

            processed += 1

            # レート制限
            if processed < remaining and not args.dry_run:
                time.sleep(SALES_INTERVAL_SEC)

        except Exception as e:
            logger.error(f"処理エラー: {company['company_name']} - {e}")

    logger.info(f"=== 完了: {processed}件処理 ===")
    print(f"✅ 営業メール: {processed}件処理完了")


if __name__ == "__main__":
    main()
