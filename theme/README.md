# Custom Shopify Theme

A custom Shopify theme built for a watch/timepiece e-commerce store. Based on Shopify's Online Store 2.0 architecture (sections, blocks, JSON templates).

## Directory structure

```
theme/
├── assets/           # CSS, JS, images
│   ├── base.css
│   └── theme.js
├── config/           # Theme settings
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/           # HTML shell
│   └── theme.liquid
├── locales/          # Translations
│   └── en.default.json
├── sections/         # Reusable section modules
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── featured-categories.liquid
│   ├── featured-collection.liquid
│   ├── image-with-text.liquid
│   ├── newsletter.liquid
│   ├── main-product.liquid
│   ├── main-collection.liquid
│   ├── main-list-collections.liquid
│   ├── main-cart.liquid
│   ├── main-page.liquid
│   ├── main-search.liquid
│   ├── main-404.liquid
│   ├── related-products.liquid
│   ├── header-group.json
│   └── footer-group.json
├── snippets/         # Reusable partials
│   ├── meta-tags.liquid
│   ├── product-card.liquid
│   ├── product-card-placeholder.liquid
│   ├── icon-search.liquid
│   ├── icon-account.liquid
│   ├── icon-cart.liquid
│   ├── icon-close.liquid
│   └── icon-arrow-right.liquid
└── templates/        # Page templates (JSON)
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── list-collections.json
    ├── cart.json
    ├── page.json
    ├── search.json
    └── 404.json
```

## Design tokens

Colors and typography can be configured through **Theme editor > Theme settings**:

- Background / Foreground
- Accent color (default red — brand accent)
- Header & Footer background
- Heading / Body font
- Page width
- Button corner radius

## Deploying to Shopify

### Option 1: Shopify CLI (recommended)

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# From the repo root:
cd theme

# Log in to your store (opens browser)
shopify theme dev --store=YOUR-STORE.myshopify.com

# Push to a new unpublished theme
shopify theme push --unpublished --store=YOUR-STORE.myshopify.com

# Later, push updates
shopify theme push --theme=THEME_ID --store=YOUR-STORE.myshopify.com
```

### Option 2: ZIP upload

```bash
cd theme && zip -r ../theme.zip . -x "*.DS_Store"
```

Then upload `theme.zip` via **Shopify Admin > Online Store > Themes > Add theme > Upload zip file**.

### Option 3: Theme Access password

1. Install the **Theme Access** app in your Shopify admin.
2. Create a password for a collaborator.
3. Run:
   ```bash
   export SHOPIFY_CLI_THEME_TOKEN=shptka_xxxxxxxxxxx
   shopify theme push --store=YOUR-STORE.myshopify.com
   ```

## After deployment

1. Create navigation menus in **Online Store > Navigation**:
   - `main-menu` (e.g., Watches, Collections, About, Support)
   - `footer`
2. Upload logo in **Theme editor > Header section**
3. Create collections (Sport, Classic, Digital, Analog) and add products.
4. Update the homepage sections via **Theme editor**:
   - Hero image and headline
   - Featured categories
   - Featured collection
   - Image-with-text
5. Configure social media links in **Theme settings > Social media**.

## Product data import

Separately, use `data/products.csv` (generated from the SKU list) to import products via **Products > Import** in Shopify admin.

## Local development

The theme uses vanilla CSS and JS — no build step required.

```bash
# Live-reload development server
shopify theme dev --store=YOUR-STORE.myshopify.com
```

Your local changes will hot-reload in the browser.
