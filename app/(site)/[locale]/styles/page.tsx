import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getGalleryIndex } from "@/lib/entries";
import { pageAlternates } from "@/lib/seo";
import { aesthetics } from "@/registry/taxonomy";

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/styles">): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "styles" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: pageAlternates(l, "/styles"),
  };
}

/** Editorial index of the aesthetic families. */
export default async function StylesPage({
  params,
}: PageProps<"/[locale]/styles">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("styles");
  const entries = getGalleryIndex();

  const families = aesthetics.map((family) => ({
    ...family,
    entries: entries.filter((entry) => entry.aesthetic === family.id),
  }));

  return (
    <main className="mx-auto min-h-screen max-w-[87.5rem] px-6 py-14 md:px-10 md:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {t("kicker")}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
        {t("title")}
      </h1>

      <ol className="mt-14 border-t border-hairline">
        {families.map((family, i) => {
          const empty = family.entries.length === 0;
          return (
            <li key={family.id} className="border-b border-hairline">
              <Link
                href={`/styles/${family.id}`}
                className={`group flex flex-col gap-4 py-8 transition-colors duration-200 ease-out hover:bg-surface md:flex-row md:items-baseline md:gap-10 md:py-10 ${
                  empty ? "opacity-60" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="hidden w-[2.5ch] shrink-0 font-display text-[2.5rem] leading-none text-muted/30 select-none md:block"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 md:flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      className={`font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] transition-colors duration-200 ease-out ${
                        empty ? "text-muted" : "group-hover:text-accent"
                      }`}
                    >
                      {family.label.en}
                    </span>
                    <span className="font-display text-[clamp(1.1rem,2vw,1.5rem)] text-muted">
                      {family.label.ko}
                    </span>
                  </span>
                  <span className="mt-3 block max-w-2xl text-[13.5px] leading-relaxed text-muted">
                    {family.blurb[locale]}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {empty ? (
                    <span>{t("coming")}</span>
                  ) : (
                    <>
                      <span aria-hidden className="flex items-center gap-1.5">
                        {family.entries.map((entry) => (
                          <span
                            key={entry.slug}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: entry.accent }}
                          />
                        ))}
                      </span>
                      <span>{t("count", { count: family.entries.length })}</span>
                    </>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
