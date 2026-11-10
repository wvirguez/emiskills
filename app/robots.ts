import type { MetadataRoute } from "next";
import { getSiteEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const { SITE_URL } = getSiteEnv();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/go/", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
