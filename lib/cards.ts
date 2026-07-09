/**
 * Server-side mapping from gallery-index rows to locale-resolved card
 * payloads (components/entry-card.tsx). Import from server components
 * only — poster detection touches the filesystem.
 */
import type { Locale } from "@/i18n/routing";
import { hasPoster } from "@/lib/entries";
import type { GalleryIndexEntry } from "@/lib/schema";
import { aesthetics } from "@/registry/taxonomy";
import type { EntryCardData } from "@/components/entry-card";

/** Loose shape of a next-intl translator for the "gallery" namespace. */
type GalleryTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function buildCardData(
  entry: GalleryIndexEntry,
  locale: Locale,
  t: GalleryTranslator,
): EntryCardData {
  const title = entry.title[locale];
  return {
    slug: entry.slug,
    no: entry.no,
    title,
    description: entry.description[locale],
    aestheticId: entry.aesthetic,
    aestheticLabel:
      aesthetics.find((term) => term.id === entry.aesthetic)?.label[locale] ??
      entry.aesthetic,
    techniqueIds: entry.techniques,
    techniqueCountLabel: t("techniqueCount", { count: entry.techniques.length }),
    industryIds: entry.industry,
    stackAnimation: entry.stack.animation,
    mediaLabel: entry.media === "code" ? t("mediaCode") : entry.media,
    accent: entry.accent,
    theme: entry.theme,
    published: entry.published,
    featured: entry.featured,
    hasPoster: hasPoster(entry.slug),
    posterAlt: t("posterAlt", { title }),
  };
}
