/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // better-sqlite3 はネイティブモジュールのため、サーバーバンドルでは外部依存として扱う
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

module.exports = nextConfig;
