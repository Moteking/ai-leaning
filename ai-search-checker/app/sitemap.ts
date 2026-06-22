import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getAllPostsMeta } from "@/lib/blog";

/** サービスサイト自身の sitemap.xml(ブログ記事も含む) */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/ai-mention", "/blog", "/badge", "/company", "/privacy", "/tokushoho"];
  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.5,
  }));

  const posts: MetadataRoute.Sitemap = getAllPostsMeta().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
