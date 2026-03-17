#!/bin/bash
# ============================================================
# AIリスクコンサル 自動化システム - 初期セットアップ
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📦 自動化システムセットアップ開始..."

# 1. Python仮想環境
echo "🐍 Python仮想環境を作成..."
python3 -m venv "$SCRIPT_DIR/venv"
source "$SCRIPT_DIR/venv/bin/activate"

# 2. 依存パッケージ
echo "📥 パッケージインストール..."
pip install -r "$SCRIPT_DIR/requirements.txt"

# 3. .envファイル
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo ""
    echo "⚠️  .env ファイルを作成しました。APIキーを設定してください:"
    echo "    $SCRIPT_DIR/.env"
    echo ""
fi

# 4. ディレクトリ作成
mkdir -p "$SCRIPT_DIR/logs"
mkdir -p "$SCRIPT_DIR/blog/generated"
mkdir -p "$SCRIPT_DIR/blog/sns_queue"
mkdir -p "$SCRIPT_DIR/news_sns/generated"
mkdir -p "$SCRIPT_DIR/risk_sns/generated"
mkdir -p "$SCRIPT_DIR/sales_email/queue"

# 5. .gitignore
cat > "$SCRIPT_DIR/.gitignore" << 'GITIGNORE'
.env
venv/
logs/
__pycache__/
*.pyc
blog/generated/
blog/sns_queue/
blog/blog_history.json
news_sns/generated/
news_sns/posted_news.json
risk_sns/generated/
risk_sns/post_history.json
sales_email/queue/
sales_email/companies.json
sales_email/sent_history.json
GITIGNORE

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "次のステップ:"
echo "  1. .env にAPIキーを設定"
echo "     vi $SCRIPT_DIR/.env"
echo ""
echo "  2. テスト実行（dry-run）"
echo "     cd $SCRIPT_DIR"
echo "     source venv/bin/activate"
echo "     python run_all.py --task blog --dry-run"
echo "     python run_all.py --task news_sns --dry-run"
echo "     python run_all.py --task risk_sns --dry-run"
echo "     python run_all.py --task sales --dry-run"
echo ""
echo "  3. cron登録（24時間自動運用開始）"
echo "     crontab $SCRIPT_DIR/crontab.txt"
echo ""
echo "  4. 稼働状況確認"
echo "     python run_all.py --status"
