import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/** サービスサイト自身の robots.txt。AIクローラーを明示的に許可。 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
