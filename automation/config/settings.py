"""
自動化システム共通設定
各APIキーは環境変数から読み込む。.envファイルまたはexportで設定。
"""
import os
from pathlib import Path

# ===== ディレクトリ =====
BASE_DIR = Path(__file__).resolve().parent.parent
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

# ===== Claude API =====
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = "claude-sonnet-4-20250514"

# ===== WordPress =====
WP_URL = os.environ.get("WP_URL", "")           # https://your-site.com
WP_USER = os.environ.get("WP_USER", "")
WP_APP_PASSWORD = os.environ.get("WP_APP_PASSWORD", "")  # Application Password

# ===== SNS =====
# X (Twitter) API v2
X_BEARER_TOKEN = os.environ.get("X_BEARER_TOKEN", "")
X_API_KEY = os.environ.get("X_API_KEY", "")
X_API_SECRET = os.environ.get("X_API_SECRET", "")
X_ACCESS_TOKEN = os.environ.get("X_ACCESS_TOKEN", "")
X_ACCESS_SECRET = os.environ.get("X_ACCESS_SECRET", "")

# LinkedIn
LINKEDIN_ACCESS_TOKEN = os.environ.get("LINKEDIN_ACCESS_TOKEN", "")
LINKEDIN_PERSON_ID = os.environ.get("LINKEDIN_PERSON_ID", "")

# ===== Email (SMTP) =====
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "")
FROM_NAME = os.environ.get("FROM_NAME", "AIリスクコンサルティング")

# ===== ニュースソース (RSS) =====
NEWS_RSS_FEEDS = [
    "https://news.google.com/rss/search?q=AI+リスク+企業&hl=ja&gl=JP&ceid=JP:ja",
    "https://news.google.com/rss/search?q=生成AI+規制&hl=ja&gl=JP&ceid=JP:ja",
    "https://news.google.com/rss/search?q=AIガバナンス&hl=ja&gl=JP&ceid=JP:ja",
    "https://news.google.com/rss/search?q=ChatGPT+情報漏洩&hl=ja&gl=JP&ceid=JP:ja",
    "https://feeds.feedburner.com/TheHackersNews",
]

# ===== ブログ設定 =====
BLOG_CATEGORIES = [
    "AIリスク管理",
    "AIガバナンス",
    "生成AI規制",
    "社内ルール策定",
    "AI倫理",
    "情報セキュリティ",
    "AI研修・教育",
    "業界別AI対策",
]

BLOG_TARGET_KEYWORDS = [
    "AI リスク管理", "AIガバナンス", "ChatGPT 社内ルール",
    "生成AI ガイドライン", "AI 情報漏洩 対策", "AI倫理 企業",
    "AI研修 企業", "AIリテラシー 教育",
]

# ===== 営業メール設定 =====
SALES_DAILY_LIMIT = 20  # 1日の送信上限
SALES_INTERVAL_SEC = 300  # メール間隔（秒）= 5分
