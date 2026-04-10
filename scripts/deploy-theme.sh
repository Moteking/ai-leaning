#!/bin/bash
set -eu

THEME_ID="${THEME_ID:-189863330075}"
TOKEN="${SHOPIFY_TOKEN:?SHOPIFY_TOKEN required}"
SHOP="${SHOPIFY_SHOP:-jq6u4v-im.myshopify.com}"
BASE_URL="https://theme-kit-access.shopifyapps.com/cli/admin/api/2024-10/themes/${THEME_ID}/assets.json"

cd "$(dirname "$0")/../theme"

SUCCESS=0
FAILED=0
FAILED_FILES=()

# Find all theme files except README.md
while IFS= read -r file; do
  rel="${file#./}"
  # Skip README
  [[ "$rel" == "README.md" ]] && continue

  # Build JSON with properly escaped file content
  payload=$(jq -n --arg key "$rel" --rawfile value "$rel" \
    '{asset: {key: $key, value: $value}}')

  http_code=$(curl -s -o /tmp/resp.json -w "%{http_code}" -X PUT "$BASE_URL" \
    -H "X-Shopify-Access-Token: $TOKEN" \
    -H "X-Shopify-Shop: $SHOP" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if [[ "$http_code" == "200" ]]; then
    printf "  OK   %s\n" "$rel"
    SUCCESS=$((SUCCESS + 1))
  else
    printf "  FAIL [%s] %s\n" "$http_code" "$rel"
    cat /tmp/resp.json
    echo
    FAILED=$((FAILED + 1))
    FAILED_FILES+=("$rel")
  fi

  # Small delay to avoid rate limiting
  sleep 0.15
done < <(find . -type f | sort)

echo
echo "======================================"
echo "  Success: $SUCCESS"
echo "  Failed:  $FAILED"
echo "======================================"

if [[ $FAILED -gt 0 ]]; then
  echo "Failed files:"
  for f in "${FAILED_FILES[@]}"; do
    echo "  - $f"
  done
  exit 1
fi
