#!/usr/bin/env python3
"""
全自動化タスクの統合ランナー
cronから呼び出す or 直接実行

Usage:
    python run_all.py --task blog         # ブログ生成
    python run_all.py --task news_sns     # ニュース→SNS
    python run_all.py --task risk_sns     # リスクSNS投稿
    python run_all.py --task sales        # 営業メール
    python run_all.py --task all          # 全タスク順次実行
    python run_all.py --status            # 稼働状況確認
"""
import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

TASKS = {
    "blog": {
        "script": "blog/auto_blog.py",
        "args": ["--publish"],
        "description": "ブログ記事の自動生成・投稿",
    },
    "news_sns": {
        "script": "news_sns/auto_news_sns.py",
        "args": ["--count", "3"],
        "description": "AIニュース→SNS自動投稿",
    },
    "risk_sns": {
        "script": "risk_sns/auto_risk_sns.py",
        "args": [],
        "description": "AIリスクSNS自動投稿",
    },
    "sales": {
        "script": "sales_email/auto_sales.py",
        "args": ["--dry-run"],  # 安全のためデフォルトdry-run。本番は--send-from-queueに変更
        "description": "企業リストアップ・営業メール",
    },
}


def run_task(name: str, extra_args: list | None = None):
    """タスクを実行"""
    task = TASKS[name]
    script = BASE_DIR / task["script"]
    args = [sys.executable, str(script)] + task["args"]
    if extra_args:
        args += extra_args

    print(f"\n{'='*60}")
    print(f"🚀 {task['description']} 開始 [{datetime.now():%H:%M:%S}]")
    print(f"{'='*60}")

    result = subprocess.run(args, cwd=str(BASE_DIR), capture_output=False)
    if result.returncode != 0:
        print(f"⚠️ {name} がエラーコード {result.returncode} で終了")
    return result.returncode


def show_status():
    """各タスクの稼働状況を表示"""
    from utils import load_json

    print("\n📊 自動化システム稼働状況")
    print("=" * 60)

    # ブログ
    blog_history = BASE_DIR / "blog" / "blog_history.json"
    bh = load_json(blog_history)
    if isinstance(bh, list) and bh:
        last = bh[-1]
        print(f"\n📝 ブログ: 累計{len(bh)}記事")
        print(f"   最終: {last.get('date', '')[:10]} - {last.get('title', '')[:40]}")
    else:
        print("\n📝 ブログ: 未稼働")

    # ニュースSNS
    posted = BASE_DIR / "news_sns" / "posted_news.json"
    pn = load_json(posted)
    if isinstance(pn, dict):
        print(f"\n📰 ニュースSNS: {len(pn.get('ids', []))}件投稿済み")
    else:
        print("\n📰 ニュースSNS: 未稼働")

    # リスクSNS
    risk_history = BASE_DIR / "risk_sns" / "post_history.json"
    rh = load_json(risk_history)
    if isinstance(rh, list) and rh:
        last = rh[-1]
        print(f"\n🛡️ リスクSNS: 累計{len(rh)}投稿")
        print(f"   最終: {last.get('date', '')[:10]} - {last.get('topic_hint', '')}")
    else:
        print("\n🛡️ リスクSNS: 未稼働")

    # 営業メール
    sent = BASE_DIR / "sales_email" / "sent_history.json"
    sh = load_json(sent)
    companies = BASE_DIR / "sales_email" / "companies.json"
    cl = load_json(companies)
    print(f"\n📧 営業メール:")
    print(f"   企業リスト: {len(cl) if isinstance(cl, list) else 0}社")
    print(f"   送信済み: {len(sh) if isinstance(sh, list) else 0}件")

    # キュー
    queue_dir = BASE_DIR / "sales_email" / "queue"
    if queue_dir.exists():
        queue_count = len(list(queue_dir.glob("*.json")))
        print(f"   キュー: {queue_count}件待ち")


def main():
    parser = argparse.ArgumentParser(description="自動化統合ランナー")
    parser.add_argument("--task", choices=list(TASKS.keys()) + ["all"], help="実行タスク")
    parser.add_argument("--status", action="store_true", help="稼働状況表示")
    parser.add_argument("--dry-run", action="store_true", help="dry-runモード")
    args = parser.parse_args()

    if args.status:
        show_status()
        return

    if not args.task:
        parser.print_help()
        return

    extra = ["--dry-run"] if args.dry_run else []

    if args.task == "all":
        for name in TASKS:
            run_task(name, extra)
    else:
        run_task(args.task, extra)


if __name__ == "__main__":
    main()
