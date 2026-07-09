import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { buildCardData } from "@/lib/cards";
import { getGalleryIndex } from "@/lib/entries";
import { pageAlternates } from "@/lib/seo";
import { aesthetics, techniques } from "@/registry/taxonomy";
import EntryCard from "@/components/entry-card";

export function generateStaticParams(): { locale: string; family: string }[] {
  return routing.locales.flatMap((locale) =>
    aesthetics.map((family) => ({ locale, family: family.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/styles/[family]">): Promise<Metadata> {
  const { locale, family } = await params;
  const l: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const term = aesthetics.find((t) => t.id === family);
  if (!term) return {};
  return {
    title: `${term.label.en} · ${term.label.ko}`,
    description: term.blurb[l],
    alternates: pageAlternates(l, `/styles/${family}`),
  };
}

/** One aesthetic family: blurb writ large, its entries, its techniques. */
export default async function StyleFamilyPage({
  params,
}: PageProps<"/[locale]/styles/[family]">) {
  const { locale, family } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const term = aesthetics.find((t) => t.id === family);
  if (!term) notFound();

  const [t, tGallery] = await Promise.all([
    getTranslations("styles"),
    getTranslations("gallery"),
  ]);

  const entries = getGalleryIndex().filter(
    (entry) => entry.aesthetic === family,
  );
  const cards = entries.map((entry) => buildCardData(entry, locale, tGallery));

  const familyTechniques = techniques.filter((technique) =>
    entries.some((entry) => entry.techniques.includes(technique.id)),
  );

  return (
    <main className="mx-auto min-h-screen max-w-[87.5rem] px-6 py-14 md:px-10 md:py-20">
      <nav className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {t("familyKicker")}
        </p>
        <Link
          href="/styles"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-200 ease-out hover:text-text"
        >
          ← {t("backToStyles")}
        </Link>
      </nav>

      <header className="mt-6 border-b border-hairline pb-12 md:pb-16">
        <h1 className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]">
            {term.label.en}
          </span>
          <span className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-muted">
            {term.label.ko}
          </span>
        </h1>
        <p className="mt-6 max-w-3xl font-display text-[clamp(1.2rem,2.4vw,1.75rem)] leading-[1.35] text-text/85">
          <em>{term.blurb[locale]}</em>
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {t("count", { count: entries.length })}
        </p>
      </header>

      <section className="mt-12">
        {cards.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <li key={card.slug}>
                <EntryCard entry={card} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="border border-hairline px-6 py-16 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
            {t("familyEmpty")}
          </p>
        )}
      </section>

      {familyTechniques.length > 0 && (
        <section className="mt-16 border-t border-hairline pt-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {t("familyTechniques")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {familyTechniques.map((technique) => (
              <li key={technique.id}>
                <Link
                  href={`/gallery?technique=${technique.id}`}
                  className="inline-block border border-hairline px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent"
                >
                  {technique.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
