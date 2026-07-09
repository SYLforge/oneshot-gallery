import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getGalleryIndex } from "@/lib/entries";
import { localeUrl } from "@/lib/seo";
import { aesthetics } from "@/registry/taxonomy";

/**
 * All locales × (home, gallery, styles, styles/[family], about,
 * design/[slug]), one row per path with hreflang alternates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getGalleryIndex();

  const paths: { path: string; lastModified?: string }[] = [
    { path: "" },
    { path: "/gallery" },
    { path: "/styles" },
    { path: "/about" },
    ...aesthetics.map((family) => ({ path: `/styles/${family.id}` })),
    ...entries.map((entry) => ({
      path: `/design/${entry.slug}`,
      lastModified: entry.published,
    })),
  ];

  return paths.map(({ path, lastModified }) => ({
    url: localeUrl(routing.defaultLocale, path),
    ...(lastModified ? { lastModified } : {}),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
      ),
    },
  }));
}
