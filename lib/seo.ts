import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/** Canonical production host — no trailing slash. */
export const SITE_HOST = "https://oneshot.gallery";

/** Repository placeholder until the org goes live. */
export const GITHUB_URL = "https://github.com/oneshot-gallery";

/** Locale-prefixed absolute URL for a localized route path ("" = home). */
export function localeUrl(locale: string, path: string): string {
  return `${SITE_HOST}/${locale}${path}`;
}

/**
 * Canonical + hreflang alternates for a localized route. `path` is the
 * route without the locale prefix, e.g. "" | "/gallery" | "/design/x".
 */
export function pageAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localeUrl(locale, path),
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, localeUrl(l, path)]),
    ),
  };
}
