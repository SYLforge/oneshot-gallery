import type { MetadataRoute } from "next";
import { SITE_HOST } from "@/lib/seo";

/** Demos under /view are noindexed duplicates of the detail pages. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/view/",
    },
    sitemap: `${SITE_HOST}/sitemap.xml`,
  };
}
