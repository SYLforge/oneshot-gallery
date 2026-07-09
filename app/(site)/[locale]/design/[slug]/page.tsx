import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { codeToHtml, type BundledLanguage } from "shiki";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  getBreakdownDoc,
  getDesignDoc,
  getEntryMeta,
  getEntryTokens,
  getGalleryIndex,
  getPromptDoc,
  getRegistryItem,
  hasOgImage,
  type PromptDoc,
  type RegistryFile,
} from "@/lib/entries";
import { inlineMarkdown, renderMarkdown } from "@/lib/markdown";
import { pageAlternates } from "@/lib/seo";
import type { EntryMeta, EntryTokens } from "@/lib/schema";
import { aesthetics, industries, techniques, type TaxonomyTerm } from "@/registry/taxonomy";
import CodeViewer, { type CodeFile } from "@/components/code-viewer";
import CopyButton from "@/components/copy-button";
import DetailTabs from "@/components/detail-tabs";
import PreviewFrame from "@/components/preview-frame";

/* ------------------------------------------------------------------ */
/* Static generation                                                   */
/* ------------------------------------------------------------------ */

export function generateStaticParams(): { locale: string; slug: string }[] {
  const entries = getGalleryIndex();
  return routing.locales.flatMap((locale) =>
    entries.map((entry) => ({ locale, slug: entry.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/design/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const entry = getGalleryIndex().find((e) => e.slug === slug);
  if (!entry) return {};
  return {
    title: entry.title[l],
    description: entry.description[l],
    alternates: pageAlternates(l, `/design/${slug}`),
    openGraph: hasOgImage(slug)
      ? {
          title: entry.title[l],
          description: entry.description[l],
          images: [{ url: `/media/${slug}/og.png`, width: 1200, height: 630 }],
        }
      : undefined,
    twitter: hasOgImage(slug) ? { card: "summary_large_image" } : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function termLabel(terms: TaxonomyTerm[], id: string, locale: Locale): string {
  return terms.find((t) => t.id === id)?.label[locale] ?? id;
}

function formatNo(no: number): string {
  return `No. ${String(no).padStart(2, "0")}`;
}

function formatSize(content: string): string {
  return `${(Buffer.byteLength(content, "utf8") / 1024).toFixed(1)} KB`;
}

function langFor(name: string): BundledLanguage | "text" {
  if (name.endsWith(".tsx")) return "tsx";
  if (name.endsWith(".ts")) return "ts";
  if (name.endsWith(".css")) return "css";
  if (name.endsWith(".md")) return "markdown";
  return "text";
}

/** Display order: page.tsx, components/*, hooks/*, styles.css, fonts.ts, PROMPT.md. */
function fileRank(name: string): number {
  if (name === "page.tsx") return 0;
  if (name.startsWith("components/")) return 1;
  if (name.startsWith("hooks/")) return 2;
  if (name === "styles.css") return 3;
  if (name === "fonts.ts") return 4;
  if (name === "PROMPT.md") return 6;
  return 5;
}

async function highlightFiles(
  files: RegistryFile[],
  slug: string,
): Promise<CodeFile[]> {
  const prefix = `registry/designs/${slug}/`;
  const named = files
    .map((file) => ({
      name: file.path.startsWith(prefix)
        ? file.path.slice(prefix.length)
        : file.path,
      content: file.content,
    }))
    .sort(
      (a, b) =>
        fileRank(a.name) - fileRank(b.name) || a.name.localeCompare(b.name),
    );

  return Promise.all(
    named.map(async (file) => ({
      name: file.name,
      size: formatSize(file.content),
      raw: file.content,
      html: await codeToHtml(file.content, {
        lang: langFor(file.name),
        theme: "vesper",
        // Sit the code on the annex's surface instead of vesper's own black.
        colorReplacements: { "#101010": "#141416" },
      }),
    })),
  );
}

/** Title with an italic display accent after the em dash. */
function EntryTitle({ title }: { title: string }) {
  const dash = title.indexOf("—");
  if (dash === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, dash).trim()}
      <span aria-hidden className="text-accent">
        {" — "}
      </span>
      <em>{title.slice(dash + 1).trim()}</em>
    </>
  );
}

/** Loose shape of a next-intl translator, for passing into sync helpers. */
type Translator = (key: string, values?: Record<string, string | number>) => string;

/* ------------------------------------------------------------------ */
/* Server-rendered tab panels                                          */
/* ------------------------------------------------------------------ */

function PromptPanel({ doc, t }: { doc: PromptDoc; t: Translator }) {
  const distilled = doc.provenance !== "oneshot";
  const verified = doc.verification === "verified";
  const facts: Array<[string, string]> = [
    [t("promptModel"), doc.model],
    [t("promptHarness"), doc.harness],
    [t("promptDate"), doc.date],
  ];
  if (doc.attempts !== undefined) {
    facts.push([t("promptAttempts"), String(doc.attempts)]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${
            distilled
              ? "border-[#b98a3a]/60 text-[#d9a24a]"
              : "border-accent/60 text-accent"
          }`}
        >
          {distilled ? t("provDistilled") : t("provOneshot")}
        </span>
        <span className="border border-hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {verified ? t("verVerified") : t("verUnverified")}
        </span>
      </div>

      <dl className="mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-8 gap-y-2">
        {facts.map(([term, detail]) => (
          <div key={term} className="contents">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {term}
            </dt>
            <dd className="font-mono text-[13px]">{detail}</dd>
          </div>
        ))}
      </dl>

      {doc.intro && (
        <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-muted">
          {doc.intro.replace(/\s*\n\s*/g, " ")}
        </p>
      )}

      <div className="mt-8 border border-hairline bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {t("promptFile")}
          </span>
          <CopyButton
            text={doc.prompt}
            label={t("copyPrompt")}
            copiedLabel={t("copied")}
            className="border border-accent/50 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.15em] text-accent transition-colors duration-200 ease-out hover:bg-accent/10"
          />
        </div>
        <pre className="max-h-[34rem] overflow-auto px-5 py-5 font-mono text-[13px] leading-[1.75] whitespace-pre-wrap break-words">
          {doc.prompt}
        </pre>
      </div>

      {doc.deviations.length > 0 && (
        <section className="mt-10">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {t("deviations")}
          </h3>
          <ul className="mt-4 max-w-3xl space-y-3">
            {doc.deviations.map((item) => (
              <li
                key={item.slice(0, 40)}
                className="flex gap-3 text-[14px] leading-relaxed"
              >
                <span aria-hidden className="select-none text-muted">
                  —
                </span>
                <span
                  className="deviation-item min-w-0"
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TokensPanel({
  tokens,
  t,
}: {
  tokens: EntryTokens;
  t: Translator;
}) {
  const th =
    "px-4 py-2.5 text-left font-mono text-[11px] font-normal uppercase tracking-[0.15em] text-muted";
  return (
    <div className="space-y-12">
      <section>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {t("palette")}
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tokens.colors.map((color) => (
            <li
              key={color.name}
              className="flex gap-3 border border-hairline bg-surface p-3"
            >
              <span
                aria-hidden
                className="h-12 w-12 shrink-0 border border-hairline"
                style={{ backgroundColor: color.value }}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[13px]">{color.name}</span>
                  <CopyButton
                    text={color.value}
                    label={color.value}
                    copiedLabel={t("copiedShort")}
                    className="font-mono text-[12px] text-muted underline-offset-4 transition-colors duration-200 ease-out hover:text-text hover:underline"
                  />
                </div>
                <p className="mt-1 text-[12.5px] leading-snug text-muted">
                  {color.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {t("fonts")}
        </h3>
        <div className="mt-4 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[30rem] text-[13.5px]">
            <thead className="border-b border-hairline bg-surface">
              <tr>
                <th scope="col" className={th}>
                  {t("fontFamily")}
                </th>
                <th scope="col" className={th}>
                  {t("fontRole")}
                </th>
                <th scope="col" className={th}>
                  {t("fontSource")}
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.fonts.map((font) => (
                <tr
                  key={font.family}
                  className="border-b border-hairline last:border-b-0"
                >
                  <td className="px-4 py-3 align-top font-mono whitespace-nowrap">
                    {font.family}
                  </td>
                  <td className="px-4 py-3 align-top leading-relaxed">
                    {font.role}
                  </td>
                  <td className="px-4 py-3 align-top text-muted whitespace-nowrap">
                    {font.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {tokens.texture && (
        <section>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {t("texture")}
          </h3>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-muted">
            {tokens.texture}
          </p>
        </section>
      )}

      {tokens.motion.length > 0 && (
        <section>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {t("motion")}
          </h3>
          <div className="mt-4 overflow-x-auto border border-hairline">
            <table className="w-full min-w-[30rem] text-[13px]">
              <thead className="border-b border-hairline bg-surface">
                <tr>
                  <th scope="col" className={th}>
                    {t("motionName")}
                  </th>
                  <th scope="col" className={th}>
                    {t("motionValue")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.motion.map((motion) => (
                  <tr
                    key={motion.name}
                    className="border-b border-hairline last:border-b-0"
                  >
                    <td className="px-4 py-3 align-top font-mono whitespace-nowrap">
                      {motion.name}
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-[12.5px] leading-relaxed text-muted">
                      {motion.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function MetaRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="py-3.5">
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
        {term}
      </dt>
      <dd className="mt-1.5 text-[13px]">{children}</dd>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="border border-hairline px-2 py-0.5 font-mono text-[11px] tracking-[0.05em] text-text/85">
      {children}
    </span>
  );
}

function MetaSidebar({
  meta,
  locale,
  t,
}: {
  meta: EntryMeta;
  locale: Locale;
  t: Translator;
}) {
  return (
    <aside className="mt-14 border-t border-hairline pt-6 lg:mt-0 lg:border-t-0 lg:pt-0">
      <h2 className="border-b border-hairline pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {t("meta")}
      </h2>
      <dl className="divide-y divide-hairline">
        <MetaRow term={t("metaModel")}>
          <span className="font-mono">
            {meta.prompt.modelLabel}
            <span className="text-muted"> · {meta.prompt.date}</span>
          </span>
        </MetaRow>
        <MetaRow term={t("metaPromptClass")}>
          <span className="font-mono">
            {meta.prompt.oneshot ? t("classOneshot") : t("classDistilled")}
          </span>
        </MetaRow>
        <MetaRow term={t("metaFollowUps")}>
          <span className="font-mono">{meta.prompt.followUps}</span>
        </MetaRow>
        <MetaRow term={t("metaStack")}>
          <span className="flex flex-wrap gap-1.5">
            <Chip>{meta.stack.animation}</Chip>
            <Chip>{meta.stack.styling}</Chip>
            {meta.stack.renderer.map((renderer) => (
              <Chip key={renderer}>{renderer}</Chip>
            ))}
          </span>
        </MetaRow>
        <MetaRow term={t("metaDependencies")}>
          {meta.dependencies.length > 0 ? (
            <span className="flex flex-wrap gap-1.5">
              {meta.dependencies.map((dep) => (
                <Chip key={dep}>{dep}</Chip>
              ))}
            </span>
          ) : (
            <span className="font-mono text-accent">{t("zeroDeps")}</span>
          )}
        </MetaRow>
        <MetaRow term={t("metaMediaSource")}>
          <span className="font-mono">
            {meta.media.source === "code" ? t("pureCode") : meta.media.source}
          </span>
        </MetaRow>
        <MetaRow term={t("metaMediaBudget")}>
          <span className="font-mono">
            {meta.media.budgetKB.toLocaleString(locale)} KB
          </span>
        </MetaRow>
        <MetaRow term={t("metaLicense")}>
          <span className="font-mono">{meta.license}</span>
        </MetaRow>
        <MetaRow term={t("metaPublished")}>
          <span className="font-mono">{meta.published}</span>
        </MetaRow>
        <MetaRow term={t("metaIndustry")}>
          {meta.industry
            .map((id) => termLabel(industries, id, locale))
            .join(" · ")}
        </MetaRow>
      </dl>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function DesignDetailPage({
  params,
}: PageProps<"/[locale]/design/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const entries = getGalleryIndex();
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const meta = getEntryMeta(slug);
  const tokens = getEntryTokens(slug);
  const registryItem = getRegistryItem(slug);
  const promptDoc = getPromptDoc(slug);
  const designHtml = renderMarkdown(getDesignDoc(slug));
  const breakdownSource = getBreakdownDoc(slug, locale);
  const breakdownHtml = breakdownSource
    ? renderMarkdown(breakdownSource)
    : null;
  const codeFiles = await highlightFiles(registryItem.files, slug);

  const t = await getTranslations("detail");

  const prev = index > 0 ? entries[index - 1] : undefined;
  const next = index < entries.length - 1 ? entries[index + 1] : undefined;

  const installCommand = `npx shadcn add @oneshot/${slug}`;
  const registrySnippet = `"@oneshot": "https://oneshot.gallery/r/{name}.json"`;

  const sectionLabel =
    "font-mono text-[11px] uppercase tracking-[0.2em] text-muted";

  return (
    <main
      className="min-h-screen"
      style={{ "--accent": meta.accent } as CSSProperties}
    >
      <div className="mx-auto max-w-[87.5rem] px-6 md:px-10">
        {/* Header band */}
        <header className="border-b border-hairline py-14 md:py-20">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <div className="max-w-3xl md:order-1">
              <p className={sectionLabel}>{t("index")}</p>
              <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.04]">
                <EntryTitle title={meta.title[locale]} />
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                {meta.description[locale]}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                <li>
                  <span className="inline-block border border-accent/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                    {termLabel(aesthetics, meta.aesthetic, locale)}
                  </span>
                </li>
                {meta.techniques.map((technique) => (
                  <li key={technique}>
                    <span className="inline-block border border-hairline px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                      {termLabel(techniques, technique, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p
              className="shrink-0 font-display text-[clamp(4rem,8vw,7rem)] leading-none text-muted/30 select-none md:order-2 md:text-right"
              aria-label={formatNo(meta.no)}
            >
              {formatNo(meta.no)}
            </p>
          </div>
        </header>

        <div className="py-12 md:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_18.75rem] lg:gap-14">
          {/* Preview + install */}
          <div className="min-w-0">
            <section aria-label={t("preview")}>
              <h2 className={sectionLabel}>{t("preview")}</h2>
              <div className="mt-4">
                <PreviewFrame
                  slug={slug}
                  title={t("previewTitle", { title: meta.title[locale] })}
                  labels={{
                    loadDemo: t("loadDemo"),
                    loading: t("demoLoading"),
                    openFull: t("openFull"),
                    reload: t("reload"),
                    viewportAria: t("viewportAria"),
                  }}
                />
              </div>
            </section>

            <section aria-label={t("install")} className="mt-12">
              <h2 className={sectionLabel}>{t("install")}</h2>
              <div className="mt-4 flex items-center gap-3 border border-hairline bg-surface py-2.5 pr-2.5 pl-4">
                <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">
                  <span aria-hidden className="text-muted">
                    ${" "}
                  </span>
                  {installCommand}
                </code>
                <CopyButton
                  text={installCommand}
                  label={t("copy")}
                  copiedLabel={t("copied")}
                />
              </div>
              <details className="group mt-3">
                <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-200 ease-out hover:text-text [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-200 ease-out group-open:rotate-90"
                  >
                    ›
                  </span>
                  {t("registrySummary")}
                </summary>
                <div className="mt-3 border border-hairline bg-surface">
                  <div className="flex items-center gap-3 py-2.5 pr-2.5 pl-4">
                    <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-muted">
                      {registrySnippet}
                    </code>
                    <CopyButton
                      text={registrySnippet}
                      label={t("copy")}
                      copiedLabel={t("copied")}
                    />
                  </div>
                  <p className="border-t border-hairline px-4 py-2.5 text-[12.5px] leading-relaxed text-muted">
                    {t("registryCaption")}
                  </p>
                </div>
              </details>
            </section>
          </div>

          {/* Meta rail — right at ≥1024px, stacked below preview otherwise */}
          <MetaSidebar meta={meta} locale={locale} t={t} />
        </div>

        {/* Tab rail */}
        <div className="pb-20">
          <DetailTabs
            ariaLabel={t("tabsAria")}
            items={[
              // Breakdown leads and is the default tab.
              ...(breakdownHtml
                ? [
                    {
                      id: "breakdown",
                      label: t("tabBreakdown"),
                      panel: (
                        <div
                          className="md-doc max-w-3xl"
                          dangerouslySetInnerHTML={{ __html: breakdownHtml }}
                        />
                      ),
                    },
                  ]
                : []),
              {
                id: "code",
                label: t("tabCode"),
                panel: (
                  <CodeViewer
                    files={codeFiles}
                    labels={{
                      filesAria: t("filesAria"),
                      copy: t("copy"),
                      copied: t("copied"),
                    }}
                  />
                ),
              },
              {
                id: "prompt",
                label: t("tabPrompt"),
                panel: <PromptPanel doc={promptDoc} t={t} />,
              },
              {
                id: "tokens",
                label: t("tabTokens"),
                panel: <TokensPanel tokens={tokens} t={t} />,
              },
              {
                id: "design",
                label: t("tabDesign"),
                panel: (
                  <div
                    className="md-doc max-w-3xl"
                    dangerouslySetInnerHTML={{ __html: designHtml }}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Prev / next footer */}
      <footer className="border-t border-hairline">
        <nav
          aria-label={t("pagerAria")}
          className="mx-auto grid max-w-[87.5rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-10 md:px-10"
        >
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              {t("prev")}
            </p>
            {prev ? (
              <Link
                href={`/design/${prev.slug}`}
                className="mt-1.5 block truncate font-display text-lg transition-colors duration-200 ease-out hover:text-accent"
              >
                {prev.title[locale]}
              </Link>
            ) : (
              <p aria-hidden className="mt-1.5 font-display text-lg text-muted/50">
                —
              </p>
            )}
          </div>
          <Link
            href="/gallery"
            className="border border-hairline px-4 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-200 ease-out hover:border-accent/60 hover:text-text"
          >
            {t("backToGallery")}
          </Link>
          <div className="min-w-0 text-right">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              {t("next")}
            </p>
            {next ? (
              <Link
                href={`/design/${next.slug}`}
                className="mt-1.5 block truncate font-display text-lg transition-colors duration-200 ease-out hover:text-accent"
              >
                {next.title[locale]}
              </Link>
            ) : (
              <p aria-hidden className="mt-1.5 font-display text-lg text-muted/50">
                —
              </p>
            )}
          </div>
        </nav>
      </footer>
    </main>
  );
}
