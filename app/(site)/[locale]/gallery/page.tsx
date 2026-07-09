import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildCardData } from "@/lib/cards";
import { getGalleryIndex } from "@/lib/entries";
import { pageAlternates } from "@/lib/seo";
import GalleryExplorer from "@/components/gallery-explorer";

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
    alternates: pageAlternates(l, "/gallery"),
  };
}

/**
 * The gallery grid. The page itself is static — filtering and sorting
 * happen client-side over the full index, with state in the URL (read
 * via useSearchParams inside the Suspense boundary).
 */
export default async function GalleryPage({
  params,
}: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("gallery");
  const cards = getGalleryIndex().map((entry) =>
    buildCardData(entry, locale, t),
  );

  return (
    <main className="mx-auto min-h-screen max-w-[87.5rem] px-6 py-14 md:px-10 md:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {t("kicker")}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
        {t("title")}
      </h1>

      <div className="mt-12">
        <Suspense fallback={null}>
          <GalleryExplorer entries={cards} locale={locale} />
        </Suspense>
      </div>
    </main>
  );
}
