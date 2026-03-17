#!/usr/bin/env python3
"""
AIリスク関連SNS投稿の自動生成・投稿スクリプト
- ニュース起点ではなく、AIリスクの専門知識・Tips・啓発を自動投稿
- 曜日別テーマで多様なコンテンツを生成
- 1日2-3投稿を自動スケジュール

Usage:
    python risk_sns/auto_risk_sns.py              # 生成→投稿
    python risk_sns/auto_risk_sns.py --dry-run    # 生成のみ
    python risk_sns/auto_risk_sns.py --type tips  # 種類を指定
"""
import argparse
import json
import random
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.settings import (
    LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_PERSON_ID,
    X_ACCESS_SECRET,
    X_ACCESS_TOKEN,
    X_API_KEY,
    X_API_SECRET,
)
from utils import call_claude, get_logger, load_json, save_json

logger = get_logger("risk_sns")
HISTORY_FILE = Path(__file__).parent / "post_history.json"

# 投稿タイプ定義
POST_TYPES = {
    "tips": {
        "description": "AIリスク管理のTips・ベストプラクティス",
        "prompt": "企業のAIリスク管理に関する実践的なTipsを1つ紹介する投稿を作成してください。具体的で即実践できる内容にしてください。",
    },
    "case_study": {
        "description": "AI関連インシデント事例と教訓",
        "prompt": "企業でのAI利用に関するインシデント事例（実際の事例をベースにした架空事例可）を紹介し、そこから得られる教訓を投稿してください。",
    },
    "checklist": {
        "description": "セルフチェックリスト形式の投稿",
        "prompt": "企業のAI利用に関するセルフチェックリスト（5-7項目）を投稿形式で作成してください。読者が自社の状況を確認できる内容にしてください。",
    },
    "stat": {
        "description": "統計データや調査結果ベースの投稿",
        "prompt": "AIリスクや企業のAI活用に関する統計データ・調査結果を引用し（もっともらしいデータで可）、企業への示唆を投稿してください。",
    },
    "qa": {
        "description": "よくある質問への回答",
        "prompt": "「企業のAIリスク管理」に関するよくある質問を1つ取り上げ、専門家として分かりやすく回答する投稿を作成してください。",
    },
    "regulation": {
        "description": "AI規制・法律の解説",
        "prompt": "AI関連の規制・法律・ガイドライン（EU AI Act、日本のAI事業者ガイドライン等）について、企業が知るべきポイントを解説する投稿を作成してください。",
    },
    "comparison": {
        "description": "対比・比較形式の投稿",
        "prompt": "AIリスク管理について「やっている企業 vs やっていない企業」「正しい対策 vs よくある間違い」のような対比形式の投稿を作成してください。",
    },
}

# 曜日別テーマ
WEEKDAY_THEMES = {
    0: ["tips", "regulation"],     # 月
    1: ["case_study", "stat"],     # 火
    2: ["checklist", "qa"],        # 水
    3: ["tips", "comparison"],     # 木
    4: ["case_study", "stat"],     # 金
    5: ["qa", "regulation"],       # 土
    6: ["tips", "checklist"],      # 日
}


def pick_post_type() -> str:
    """曜日に基づいて投稿タイプを選択"""
    weekday = datetime.now().weekday()
    candidates = WEEKDAY_THEMES[weekday]

    history = load_json(HISTORY_FILE)
    recent_types = [h.get("type", "") for h in history[-10:]] if isinstance(history, list) else []

    # 最近使ってないタイプを優先
    for c in candidates:
        if c not in recent_types[-3:]:
            return c
    return random.choice(candidates)


def generate_risk_post(post_type: str) -> dict:
    """AIリスク関連のSNS投稿を生成"""
    type_info = POST_TYPES[post_type]
    history = load_json(HISTORY_FILE)
    recent_topics = [h.get("topic_hint", "") for h in history[-20:]] if isinstance(history, list) else []

    prompt = f"""\
{type_info['prompt']}

## 重要
- 過去に投稿した以下のトピックとは異なるテーマにしてください:
  {', '.join(recent_topics[-10:]) if recent_topics else 'なし'}

## 出力形式（JSONのみ出力）
{{
  "x_post": "X(Twitter)投稿文（140文字以内。インパクトのある書き出しで）",
  "linkedin_post": "LinkedIn投稿文（400文字程度。専門性のある分析と具体的なアクションを含む。段落分け・改行を使って読みやすく。最後にハッシュタグ3つ）",
  "topic_hint": "投稿のテーマを5文字で要約"
}}

マークダウンのコードブロックで囲わずにJSONのみ出力してください。
"""
    system = """\
あなたは福岡拠点のAIリスクコンサルタントです。
企業の経営者・管理職に向けて、AIリスク管理の重要性を伝えるSNS投稿を作成します。
専門的な内容を分かりやすく、行動を促す形で発信してください。
投稿には必ず具体的な数字や事例を含めてください。"""

    result = call_claude(prompt, system=system, max_tokens=1024)
    result = result.strip()
    if result.startswith("```"):
        result = result.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(result)


def post_to_x(text: str) -> bool:
    """X(Twitter)に投稿"""
    if not all([X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET]):
        logger.warning("X API設定が未完了。スキップ。")
        return False
    try:
        from requests_oauthlib import OAuth1
        import requests

        auth = OAuth1(X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET)
        resp = requests.post(
            "https://api.twitter.com/2/tweets",
            json={"text": text},
            auth=auth,
            timeout=15,
        )
        if resp.status_code in (200, 201):
            logger.info(f"X投稿成功: {text[:50]}...")
            return True
        else:
            logger.error(f"X投稿失敗: {resp.status_code}")
            return False
    except ImportError:
        logger.error("requests_oauthlib が必要です")
        return False


def post_to_linkedin(text: str) -> bool:
    """LinkedInに投稿"""
    if not all([LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_ID]):
        logger.warning("LinkedIn設定が未完了。スキップ。")
        return False
    import requests

    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "author": f"urn:li:person:{LINKEDIN_PERSON_ID}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }
    resp = requests.post(
        "https://api.linkedin.com/v2/ugcPosts",
        json=payload,
        headers=headers,
        timeout=15,
    )
    if resp.status_code in (200, 201):
        logger.info(f"LinkedIn投稿成功: {text[:50]}...")
        return True
    else:
        logger.error(f"LinkedIn投稿失敗: {resp.status_code}")
        return False


def update_history(post_type: str, post_data: dict):
    """投稿履歴を更新"""
    history = load_json(HISTORY_FILE)
    if not isinstance(history, list):
        history = []
    history.append({
        "date": datetime.now().isoformat(),
        "type": post_type,
        "topic_hint": post_data.get("topic_hint", ""),
        "x_post": post_data.get("x_post", "")[:50],
    })
    # 直近200件保持
    save_json(HISTORY_FILE, history[-200:])


def main():
    parser = argparse.ArgumentParser(description="AIリスクSNS自動投稿")
    parser.add_argument("--dry-run", action="store_true", help="生成のみ")
    parser.add_argument("--type", choices=POST_TYPES.keys(), help="投稿タイプ指定")
    args = parser.parse_args()

    post_type = args.type or pick_post_type()
    logger.info(f"=== リスクSNS自動投稿開始: type={post_type} ===")

    post_data = generate_risk_post(post_type)
    logger.info(f"投稿生成完了: {post_data.get('topic_hint', '')}")

    # ローカル保存
    output_dir = Path(__file__).parent / "generated"
    output_dir.mkdir(exist_ok=True)
    save_json(
        output_dir / f"{datetime.now():%Y%m%d_%H%M}_{post_type}.json",
        post_data,
    )

    if not args.dry_run:
        post_to_x(post_data["x_post"])
        post_to_linkedin(post_data["linkedin_post"])

    update_history(post_type, post_data)

    logger.info("=== リスクSNS自動投稿完了 ===")
    print(f"✅ リスクSNS投稿完了: [{post_type}] {post_data.get('topic_hint', '')}")


if __name__ == "__main__":
    main()
