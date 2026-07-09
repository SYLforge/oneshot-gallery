import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getGalleryIndex } from "@/lib/entries";
import { aesthetics } from "@/registry/taxonomy";

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "gallery" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

/**
 * Gallery stub — a minimal index list. The real card grid arrives in a
 * later phase.
 */
export default async function GalleryPage({
  params,
}: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("gallery");
  const entries = getGalleryIndex();

  return (
    <main className="mx-auto min-h-screen max-w-[68.75rem] px-6 py-16 md:px-10 md:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {t("kicker")}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
        {t("title")}
      </h1>

      <ol className="mt-14 border-t border-hairline">
        {entries.map((entry) => (
          <li key={entry.slug} className="border-b border-hairline">
            <Link
              href={`/design/${entry.slug}`}
              style={{ "--accent": entry.accent } as CSSProperties}
              className="group flex items-baseline gap-4 py-5 transition-colors duration-200 ease-out hover:bg-surface md:gap-6"
            >
              <span className="shrink-0 font-mono text-[12px] text-muted">
                No. {String(entry.no).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-accent"
              />
              <span className="min-w-0 flex-1 truncate font-display text-xl transition-colors duration-200 ease-out group-hover:text-accent md:text-2xl">
                {entry.title[locale]}
              </span>
              <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-muted sm:inline">
                {aesthetics.find((term) => term.id === entry.aesthetic)?.label[
                  locale
                ] ?? entry.aesthetic}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
