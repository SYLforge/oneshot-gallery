import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getGalleryIndex } from "@/lib/entries";
import { pageAlternates, GITHUB_URL } from "@/lib/seo";
import { aesthetics, techniques } from "@/registry/taxonomy";
import IndexWall, { type WallRow } from "@/components/index-wall";

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  return { alternates: pageAlternates(l, "") };
}

function termLabel(
  terms: { id: string; label: Record<Locale, string> }[],
  id: string,
  locale: Locale,
): string {
  return terms.find((term) => term.id === id)?.label[locale] ?? id;
}

const sectionLabel =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted";

/** The annex lobby: hero statement, featured entries, the index wall. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tHome, tGallery] = await Promise.all([
    getTranslations("site"),
    getTranslations("home"),
    getTranslations("gallery"),
  ]);

  const entries = getGalleryIndex();
  const featured = entries.filter((entry) => entry.featured);
  const rows: WallRow[] = entries.map((entry) => ({
    slug: entry.slug,
    no: entry.no,
    title: entry.title[locale],
    aesthetic: termLabel(aesthetics, entry.aesthetic, locale),
    accent: entry.accent,
  }));

  const installCommand = "npx shadcn add @oneshot/<slug>";
  const steps = [tHome("howStep1"), tHome("howStep2"), tHome("howStep3")];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-[87.5rem] px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24">
        <p className={sectionLabel}>{tHome("kicker")}</p>
        <h1 className="mt-8 max-w-[17ch] font-display text-[clamp(3rem,8.5vw,7rem)] leading-[1.02] tracking-[-0.01em]">
          {tHome.rich("statement", {
            em: (chunks) => (
              <em className="accent-follow text-accent">{chunks}</em>
            ),
          })}
        </h1>
        <p className="sr-only">{t("description")}</p>
        <div className="mt-10 font-mono text-[12px] uppercase tracking-[0.18em] text-muted md:text-[13px]">
          <p>{tHome("trifectaEn")}</p>
          <p className="mt-1.5">{tHome("trifectaKo")}</p>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section
          aria-label={tHome("featuredKicker")}
          className="mx-auto max-w-[87.5rem] px-6 pb-16 md:px-10 md:pb-24"
        >
          <h2 className={sectionLabel}>{tHome("featuredKicker")}</h2>
          <div className="mt-5 space-y-6">
            {featured.map((entry) => (
              <Link
                key={entry.slug}
                href={`/design/${entry.slug}`}
                style={{ "--accent": entry.accent } as CSSProperties}
                className="group block border border-accent/40 bg-surface p-7 transition-colors duration-200 ease-out hover:border-accent md:p-10"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start md:gap-12">
                  <div className="min-w-0 max-w-3xl">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-accent">
                      {termLabel(aesthetics, entry.aesthetic, locale)}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.06] underline-offset-8 decoration-accent/70 group-hover:underline">
                      {entry.title[locale]}
                    </h3>
                    <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
                      {entry.description[locale]}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {entry.techniques.map((technique) => (
                        <li
                          key={technique}
                          className="border border-hairline px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted"
                        >
                          {termLabel(techniques, technique, locale)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                      {tHome("viewEntry")} →
                    </p>
                  </div>
                  <p
                    aria-hidden
                    className="shrink-0 font-display text-[clamp(3.5rem,7vw,6rem)] leading-none text-muted/25 select-none md:text-right"
                  >
                    No. {String(entry.no).padStart(2, "0")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* The index wall */}
      <section className="mx-auto max-w-[87.5rem] px-6 pb-16 md:px-10 md:pb-24">
        <div className="flex items-baseline justify-between gap-4 pb-5">
          <h2 className={sectionLabel}>{tHome("wallKicker")}</h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {tGallery("count", { count: entries.length })}
          </p>
        </div>
        <IndexWall rows={rows} ariaLabel={tHome("wallAria")} />
      </section>

      {/* How it works */}
      <section
        aria-label={tHome("howKicker")}
        className="border-y border-hairline"
      >
        <div className="mx-auto max-w-[87.5rem] px-6 py-14 md:px-10 md:py-20">
          <h2 className={sectionLabel}>{tHome("howKicker")}</h2>
          <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <li key={step} className="flex flex-col">
                <span
                  aria-hidden
                  className="font-display text-[3.25rem] leading-none text-muted/30 select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 max-w-[36ch] font-mono text-[12.5px] leading-relaxed text-text/85">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12 max-w-xl">
            <p className={sectionLabel}>{tHome("installHint")}</p>
            <code className="mt-3 block overflow-x-auto border border-hairline bg-surface px-4 py-3 font-mono text-[13px] whitespace-nowrap">
              <span aria-hidden className="text-muted">
                ${" "}
              </span>
              {installCommand}
            </code>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-[87.5rem] px-6 py-16 md:px-10 md:py-24">
        <p className="max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.15]">
          {tHome("ctaLine")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="border border-accent/50 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition-colors duration-200 ease-out hover:bg-accent/10"
          >
            {tHome("ctaGithub")}
          </a>
          <Link
            href="/about"
            className="border border-hairline px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-200 ease-out hover:border-accent/60 hover:text-text"
          >
            {tHome("ctaAbout")}
          </Link>
        </div>
      </section>
    </main>
  );
}
