#!/usr/bin/env python3
"""
AIニュース自動収集 → SNS投稿自動生成・投稿スクリプト
- RSSフィードからAI関連ニュースを自動収集
- Claude APIでニュース解説のSNS投稿を生成
- X(Twitter) / LinkedIn に自動投稿

Usage:
    python news_sns/auto_news_sns.py              # ニュース収集→投稿生成→投稿
    python news_sns/auto_news_sns.py --dry-run    # 生成のみ
    python news_sns/auto_news_sns.py --count 3    # 3件処理
"""
import argparse
import hashlib
import json
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests
from config.settings import (
    LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_PERSON_ID,
    NEWS_RSS_FEEDS,
    X_ACCESS_SECRET,
    X_ACCESS_TOKEN,
    X_API_KEY,
    X_API_SECRET,
)
from utils import call_claude, get_logger, load_json, save_json

logger = get_logger("news_sns")
POSTED_FILE = Path(__file__).parent / "posted_news.json"


def fetch_rss_news() -> list[dict]:
    """RSSフィードからニュースを取得"""
    articles = []
    for feed_url in NEWS_RSS_FEEDS:
        try:
            resp = requests.get(feed_url, timeout=15)
            root = ET.fromstring(resp.content)
            for item in root.iter("item"):
                title = item.findtext("title", "")
                link = item.findtext("link", "")
                pub_date = item.findtext("pubDate", "")
                description = item.findtext("description", "")
                if title and link:
                    articles.append({
                        "title": title,
                        "link": link,
                        "pub_date": pub_date,
                        "description": description[:500],
                        "id": hashlib.md5(link.encode()).hexdigest(),
                    })
        except Exception as e:
            logger.warning(f"RSS取得失敗: {feed_url} - {e}")
    return articles


def filter_new_articles(articles: list[dict]) -> list[dict]:
    """投稿済みを除外"""
    posted = load_json(POSTED_FILE)
    posted_ids = set(posted.get("ids", [])) if isinstance(posted, dict) else set()
    return [a for a in articles if a["id"] not in posted_ids]


def generate_sns_posts(article: dict) -> dict:
    """ニュースからSNS投稿を生成"""
    prompt = f"""\
以下のAI関連ニュースについて、SNS投稿を生成してください。

ニュースタイトル: {article['title']}
概要: {article['description']}
URL: {article['link']}

## 出力形式（JSONのみ出力）
{{
  "x_post": "X(Twitter)投稿文（120文字以内。ニュースの要点+企業への影響を簡潔に。URLは含めない）",
  "linkedin_post": "LinkedIn投稿文（300文字程度。ニュースの分析と企業が取るべきアクションを含む。最後にハッシュタグ3つ）",
  "relevance": "AIリスク管理との関連度 high/medium/low"
}}

マークダウンのコードブロックで囲わずにJSONのみ出力してください。
"""
    system = "あなたはAIリスクコンサルタントです。企業のAIリスク管理の観点からニュースを分析し、専門的かつ分かりやすいSNS投稿を作成します。"
    result = call_claude(prompt, system=system, max_tokens=1024)
    result = result.strip()
    if result.startswith("```"):
        result = result.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(result)


def post_to_x(text: str, url: str) -> bool:
    """X(Twitter)に投稿"""
    if not all([X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET]):
        logger.warning("X API設定が未完了。スキップ。")
        return False

    try:
        from requests_oauthlib import OAuth1

        auth = OAuth1(X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET)
        tweet_text = f"{text}\n\n{url}"
        if len(tweet_text) > 280:
            tweet_text = f"{text[:250]}...\n{url}"

        resp = requests.post(
            "https://api.twitter.com/2/tweets",
            json={"text": tweet_text},
            auth=auth,
            timeout=15,
        )
        if resp.status_code in (200, 201):
            logger.info(f"X投稿成功: {text[:50]}...")
            return True
        else:
            logger.error(f"X投稿失敗: {resp.status_code} {resp.text[:200]}")
            return False
    except ImportError:
        logger.error("requests_oauthlib が必要です: pip install requests-oauthlib")
        return False


def post_to_linkedin(text: str) -> bool:
    """LinkedInに投稿"""
    if not all([LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_ID]):
        logger.warning("LinkedIn設定が未完了。スキップ。")
        return False

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
        logger.error(f"LinkedIn投稿失敗: {resp.status_code} {resp.text[:200]}")
        return False


def mark_posted(article_id: str):
    """投稿済みとして記録"""
    posted = load_json(POSTED_FILE)
    if not isinstance(posted, dict):
        posted = {"ids": []}
    posted.setdefault("ids", []).append(article_id)
    # 直近500件のみ保持
    posted["ids"] = posted["ids"][-500:]
    save_json(POSTED_FILE, posted)


def main():
    parser = argparse.ArgumentParser(description="AIニュース→SNS自動投稿")
    parser.add_argument("--dry-run", action="store_true", help="生成のみ")
    parser.add_argument("--count", type=int, default=2, help="処理件数")
    args = parser.parse_args()

    logger.info("=== ニュースSNS自動投稿開始 ===")

    articles = fetch_rss_news()
    logger.info(f"取得ニュース数: {len(articles)}")

    new_articles = filter_new_articles(articles)
    logger.info(f"新規ニュース数: {len(new_articles)}")

    if not new_articles:
        logger.info("新規ニュースなし。終了。")
        return

    processed = 0
    output_dir = Path(__file__).parent / "generated"
    output_dir.mkdir(exist_ok=True)

    for article in new_articles[: args.count]:
        try:
            logger.info(f"処理中: {article['title'][:60]}...")
            sns_data = generate_sns_posts(article)

            # 関連度が低いものはスキップ
            if sns_data.get("relevance") == "low":
                logger.info(f"関連度低のためスキップ: {article['title'][:40]}")
                mark_posted(article["id"])
                continue

            # ローカル保存
            save_json(
                output_dir / f"{datetime.now():%Y%m%d_%H%M}_{article['id'][:8]}.json",
                {"article": article, "sns": sns_data},
            )

            if not args.dry_run:
                post_to_x(sns_data["x_post"], article["link"])
                post_to_linkedin(sns_data["linkedin_post"])

            mark_posted(article["id"])
            processed += 1

        except Exception as e:
            logger.error(f"処理エラー: {article['title'][:40]} - {e}")

    logger.info(f"=== 完了: {processed}件処理 ===")
    print(f"✅ ニュースSNS投稿: {processed}件処理完了")


if __name__ == "__main__":
    main()
