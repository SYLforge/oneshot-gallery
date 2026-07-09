"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import EntryCard, { type EntryCardData } from "@/components/entry-card";
import { aesthetics, industries, techniques } from "@/registry/taxonomy";

type FacetGroup = {
  id: "aesthetic" | "technique" | "industry" | "stack";
  labelKey: "facetAesthetic" | "facetTechnique" | "facetIndustry" | "facetStack";
  options: { id: string; label: string }[];
};

type Sort = "newest" | "no";

const STACK_OPTIONS = [
  { id: "gsap-lenis", label: "GSAP + Lenis" },
  { id: "motion", label: "Motion" },
  { id: "css-only", label: "CSS-only" },
  { id: "vanilla-js", label: "Vanilla JS" },
];

function parseList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/**
 * Client-side facet bar + card grid over the full (static) gallery index.
 * Filter and sort state round-trips through the URL search params so
 * filtered views are linkable; the page itself stays SSG.
 */
export default function GalleryExplorer({
  entries,
  locale,
}: {
  entries: EntryCardData[];
  locale: "en" | "ko";
}) {
  const t = useTranslations("gallery");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = {
    aesthetic: parseList(searchParams.get("aesthetic")),
    technique: parseList(searchParams.get("technique")),
    industry: parseList(searchParams.get("industry")),
    stack: parseList(searchParams.get("stack")),
  };
  const sort: Sort = searchParams.get("sort") === "no" ? "no" : "newest";
  const anyFilter = Object.values(selected).some((list) => list.length > 0);

  const groups: FacetGroup[] = useMemo(
    () => [
      {
        id: "aesthetic",
        labelKey: "facetAesthetic",
        options: aesthetics.map((term) => ({
          id: term.id,
          label: term.label[locale],
        })),
      },
      {
        id: "technique",
        labelKey: "facetTechnique",
        options: techniques.map((term) => ({
          id: term.id,
          label: term.label[locale],
        })),
      },
      {
        id: "industry",
        labelKey: "facetIndustry",
        options: industries.map((term) => ({
          id: term.id,
          label: term.label[locale],
        })),
      },
      { id: "stack", labelKey: "facetStack", options: STACK_OPTIONS },
    ],
    [locale],
  );

  const navigate = (
    next: Record<string, string[]>,
    nextSort: Sort,
  ) => {
    const params = new URLSearchParams();
    for (const [key, values] of Object.entries(next)) {
      if (values.length > 0) params.set(key, values.join(","));
    }
    if (nextSort !== "newest") params.set("sort", nextSort);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const toggle = (group: FacetGroup["id"], id: string) => {
    const current = selected[group];
    const next = current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id];
    navigate({ ...selected, [group]: next }, sort);
  };

  const clear = () => navigate({}, sort);

  const results = entries.filter(
    (entry) =>
      (selected.aesthetic.length === 0 ||
        selected.aesthetic.includes(entry.aestheticId)) &&
      (selected.technique.length === 0 ||
        entry.techniqueIds.some((id) => selected.technique.includes(id))) &&
      (selected.industry.length === 0 ||
        entry.industryIds.some((id) => selected.industry.includes(id))) &&
      (selected.stack.length === 0 ||
        selected.stack.includes(entry.stackAnimation)),
  );

  const sorted = results.slice().sort((a, b) => {
    if (sort === "no") return a.no - b.no;
    return b.published.localeCompare(a.published) || b.no - a.no;
  });

  return (
    <div>
      {/* Facet bar */}
      <section aria-label={t("filtersAria")} className="border-y border-hairline">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-baseline gap-4 border-b border-hairline py-3 last:border-b-0"
          >
            <h3 className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:w-32 sm:text-[10.5px]">
              {t(group.labelKey)}
            </h3>
            <div className="scrollbar-none -my-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1">
              {group.options.map((option) => {
                const active = selected[group.id].includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(group.id, option.id)}
                    className={`shrink-0 whitespace-nowrap border px-2.5 py-1 font-mono text-[11px] tracking-[0.05em] transition-colors duration-200 ease-out ${
                      active
                        ? "border-accent text-accent"
                        : "border-hairline text-muted hover:text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Count + sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {t("count", { count: sorted.length })}
          {anyFilter && (
            <button
              type="button"
              onClick={clear}
              className="ml-4 border-b border-transparent text-accent transition-colors duration-200 ease-out hover:border-accent/60"
            >
              {t("clear")}
            </button>
          )}
        </p>
        <div
          role="group"
          aria-label={t("sortAria")}
          className="flex border border-hairline"
        >
          {(
            [
              ["newest", t("sortNewest")],
              ["no", t("sortNo")],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sort === value}
              onClick={() => navigate(selected, value)}
              className={`px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.15em] transition-colors duration-200 ease-out ${
                sort === value
                  ? "bg-surface text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid / empty state */}
      {sorted.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((entry) => (
            <li key={entry.slug}>
              <EntryCard entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-hairline px-6 py-16 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
          {t("empty")}
        </p>
      )}
    </div>
  );
}
