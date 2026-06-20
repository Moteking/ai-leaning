import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/** サービスサイト自身の sitemap.xml */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/badge", "/company", "/privacy", "/tokushoho"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }));
}
