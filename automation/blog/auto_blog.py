#!/usr/bin/env python3
"""
ブログ記事の自動生成・投稿スクリプト
- Claude APIでSEO最適化された記事を自動生成
- WordPress REST APIで自動投稿（下書き or 公開）
- 1日1記事を自動生成・投稿

Usage:
    python blog/auto_blog.py              # 記事生成→下書き保存
    python blog/auto_blog.py --publish    # 記事生成→即公開
    python blog/auto_blog.py --dry-run    # 記事生成のみ（投稿しない）
"""
import argparse
import json
import random
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests
from config.settings import (
    BLOG_CATEGORIES,
    BLOG_TARGET_KEYWORDS,
    WP_APP_PASSWORD,
    WP_URL,
    WP_USER,
)
from utils import call_claude, get_logger, load_json, save_json

logger = get_logger("auto_blog")
HISTORY_FILE = Path(__file__).parent / "blog_history.json"


SYSTEM_PROMPT = """\
あなたは「AIリスクコンサルティング」の専門ブログライターです。
福岡拠点のAIリスクコンサルティング会社のブログ記事を執筆します。

## 執筆ルール
- 日本語で執筆
- SEOを意識し、指定キーワードを自然に含める
- 企業の意思決定者（経営者・部長クラス）がターゲット
- 専門的だが読みやすく、具体的な事例やデータを含める
- 記事の最後にCTA（無料相談・ホワイトペーパーDLへの誘導）を含める
- 文字数: 2000〜3000文字
- HTML形式で出力（WordPressに投稿するため）
- h2, h3タグで構造化し、読みやすくする

## 出力形式
以下のJSON形式で出力してください:
{
  "title": "記事タイトル（SEO最適化・30文字前後）",
  "excerpt": "記事の要約（120文字以内・メタディスクリプション用）",
  "content": "<h2>...</h2><p>...</p>...",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "sns_post_x": "X(Twitter)投稿文（140文字以内・記事紹介）",
  "sns_post_linkedin": "LinkedIn投稿文（300文字程度・記事紹介）"
}
"""


def pick_topic() -> tuple[str, str]:
    """未使用のカテゴリとキーワードを選択"""
    history = load_json(HISTORY_FILE)
    used_keywords = [h.get("keyword", "") for h in history] if isinstance(history, list) else []

    available = [kw for kw in BLOG_TARGET_KEYWORDS if kw not in used_keywords[-30:]]
    if not available:
        available = BLOG_TARGET_KEYWORDS

    keyword = random.choice(available)
    category = random.choice(BLOG_CATEGORIES)
    return category, keyword


def generate_article(category: str, keyword: str) -> dict:
    """Claude APIで記事を生成"""
    today = datetime.now().strftime("%Y年%m月")
    prompt = f"""\
以下の条件でブログ記事を生成してください。

- カテゴリ: {category}
- メインキーワード: {keyword}
- 時期: {today}
- 最新のAI動向やリスク事例を踏まえて執筆

JSONのみを出力してください。マークダウンのコードブロックで囲わないでください。
"""
    logger.info(f"記事生成中: カテゴリ={category}, キーワード={keyword}")
    result = call_claude(prompt, system=SYSTEM_PROMPT)

    # JSON部分を抽出
    result = result.strip()
    if result.startswith("```"):
        result = result.split("\n", 1)[1].rsplit("```", 1)[0]

    return json.loads(result)


def post_to_wordpress(article: dict, status: str = "draft") -> dict | None:
    """WordPress REST APIで投稿"""
    if not all([WP_URL, WP_USER, WP_APP_PASSWORD]):
        logger.warning("WordPress設定が未完了。ローカル保存のみ。")
        return None

    endpoint = f"{WP_URL}/wp-json/wp/v2/posts"
    data = {
        "title": article["title"],
        "content": article["content"],
        "excerpt": article["excerpt"],
        "status": status,  # "draft" or "publish"
        "tags": [],
    }
    resp = requests.post(
        endpoint,
        json=data,
        auth=(WP_USER, WP_APP_PASSWORD),
        timeout=30,
    )
    if resp.status_code in (200, 201):
        post_data = resp.json()
        logger.info(f"WordPress投稿成功: ID={post_data['id']}, URL={post_data['link']}")
        return post_data
    else:
        logger.error(f"WordPress投稿失敗: {resp.status_code} {resp.text[:200]}")
        return None


def save_article_local(article: dict, category: str, keyword: str) -> Path:
    """ローカルにも記事を保存"""
    output_dir = Path(__file__).parent / "generated"
    output_dir.mkdir(exist_ok=True)

    filename = f"{datetime.now():%Y%m%d_%H%M}_{keyword.replace(' ', '_')}.json"
    filepath = output_dir / filename
    save_json(filepath, article)
    logger.info(f"ローカル保存: {filepath}")
    return filepath


def update_history(category: str, keyword: str, article: dict, wp_id: int | None):
    """生成履歴を更新"""
    history = load_json(HISTORY_FILE)
    if not isinstance(history, list):
        history = []
    history.append({
        "date": datetime.now().isoformat(),
        "category": category,
        "keyword": keyword,
        "title": article["title"],
        "wp_id": wp_id,
    })
    save_json(HISTORY_FILE, history)


def main():
    parser = argparse.ArgumentParser(description="ブログ記事自動生成・投稿")
    parser.add_argument("--publish", action="store_true", help="即公開する")
    parser.add_argument("--dry-run", action="store_true", help="生成のみ（投稿しない）")
    args = parser.parse_args()

    category, keyword = pick_topic()
    logger.info(f"=== ブログ自動生成開始 === カテゴリ:{category} KW:{keyword}")

    article = generate_article(category, keyword)
    logger.info(f"記事生成完了: {article['title']}")

    save_article_local(article, category, keyword)

    wp_id = None
    if not args.dry_run:
        status = "publish" if args.publish else "draft"
        result = post_to_wordpress(article, status=status)
        if result:
            wp_id = result["id"]

    update_history(category, keyword, article, wp_id)

    # SNS投稿用テキストも保存
    sns_dir = Path(__file__).parent / "sns_queue"
    sns_dir.mkdir(exist_ok=True)
    save_json(sns_dir / f"{datetime.now():%Y%m%d_%H%M}_sns.json", {
        "x": article.get("sns_post_x", ""),
        "linkedin": article.get("sns_post_linkedin", ""),
        "blog_title": article["title"],
    })

    logger.info("=== ブログ自動生成完了 ===")
    print(f"✅ 記事生成完了: {article['title']}")


if __name__ == "__main__":
    main()
