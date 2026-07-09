"use client";

import { useMemo, useState } from "react";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { GalleryIndexEntry } from "@/lib/schema";
import {
  aesthetics,
  industries,
  techniques,
  type TaxonomyTerm,
} from "@/registry/taxonomy";

type EntryItem = {
  kind: "entry";
  id: string;
  href: string;
  no: number;
  title: string;
  accent: string;
  aestheticLabel: string;
  text: string[];
};

type ActionItem = {
  kind: "filter" | "nav";
  id: string;
  href: string;
  label: string;
  text: string[];
};

type PaletteItem = EntryItem | ActionItem;

function labelsFor(terms: TaxonomyTerm[], ids: string[]): string[] {
  return terms
    .filter((term) => ids.includes(term.id))
    .flatMap((term) => [term.label.en, term.label.ko]);
}

function formatNo(no: number): string {
  return String(no).padStart(2, "0");
}

/**
 * ⌘K palette — Fuse.js fuzzy search over the gallery index (titles,
 * descriptions, and taxonomy labels in both locales), plus quick filter
 * actions and site navigation. Focus trap, Esc, and aria wiring come
 * from cmdk's Radix dialog.
 */
export default function CommandPalette({
  entries,
  open,
  onOpenChange,
}: {
  entries: GalleryIndexEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("palette");
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { entryItems, filterItems, navItems, fuse } = useMemo(() => {
    const entryItems: EntryItem[] = entries.map((entry) => ({
      kind: "entry",
      id: `entry-${entry.slug}`,
      href: `/design/${entry.slug}`,
      no: entry.no,
      title: entry.title[locale],
      accent: entry.accent,
      aestheticLabel:
        aesthetics.find((term) => term.id === entry.aesthetic)?.label[locale] ??
        entry.aesthetic,
      text: [
        entry.title.en,
        entry.title.ko,
        entry.description.en,
        entry.description.ko,
        ...labelsFor(aesthetics, [entry.aesthetic]),
        ...labelsFor(techniques, entry.techniques),
        ...labelsFor(industries, entry.industry),
      ],
    }));

    const filterItems: ActionItem[] = [
      ...aesthetics.map((term) => ({
        kind: "filter" as const,
        id: `filter-aesthetic-${term.id}`,
        href: `/gallery?aesthetic=${term.id}`,
        label: term.label[locale],
        text: [term.label.en, term.label.ko],
      })),
      ...techniques.map((term) => ({
        kind: "filter" as const,
        id: `filter-technique-${term.id}`,
        href: `/gallery?technique=${term.id}`,
        label: term.label[locale],
        text: [term.label.en, term.label.ko],
      })),
    ];

    const navItems: ActionItem[] = (
      [
        ["gallery", "/gallery"],
        ["styles", "/styles"],
        ["about", "/about"],
      ] as const
    ).map(([key, href]) => ({
      kind: "nav",
      id: `nav-${key}`,
      href,
      label: tNav(key),
      text: [tNav(key)],
    }));

    const fuse = new Fuse<PaletteItem>(
      [...entryItems, ...filterItems, ...navItems],
      {
        keys: ["text"],
        threshold: 0.38,
        ignoreLocation: true,
      },
    );

    return { entryItems, filterItems, navItems, fuse };
  }, [entries, locale, tNav]);

  const trimmed = query.trim();
  const results: PaletteItem[] = trimmed
    ? fuse.search(trimmed).map((result) => result.item)
    : [
        ...entryItems,
        ...filterItems.slice(0, aesthetics.length),
        ...navItems,
      ];

  const groups = [
    {
      key: "entries",
      heading: t("groupEntries"),
      items: results.filter((item) => item.kind === "entry"),
    },
    {
      key: "filters",
      heading: t("groupFilters"),
      items: results.filter((item) => item.kind === "filter"),
    },
    {
      key: "nav",
      heading: t("groupNav"),
      items: results.filter((item) => item.kind === "nav"),
    },
  ].filter((group) => group.items.length > 0);

  const go = (href: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
      label={t("aria")}
      shouldFilter={false}
      overlayClassName="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[2px]"
      contentClassName="palette fixed left-1/2 top-[14vh] z-[101] w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 border border-hairline bg-surface"
    >
      <Command.Input
        value={query}
        onValueChange={setQuery}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
      />
      <Command.List>
        <Command.Empty>{t("empty")}</Command.Empty>
        {groups.map((group) => (
          <Command.Group key={group.key} heading={group.heading}>
            {group.items.map((item) =>
              item.kind === "entry" ? (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={() => go(item.href)}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 self-center rounded-full"
                    style={{ backgroundColor: item.accent }}
                  />
                  <span className="shrink-0 font-mono text-[11px] text-muted">
                    No. {formatNo(item.no)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-[15px]">
                    {item.title}
                  </span>
                  <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted sm:inline">
                    {item.aestheticLabel}
                  </span>
                </Command.Item>
              ) : (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={() => go(item.href)}
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] lowercase tracking-[0.05em]">
                    {item.kind === "filter"
                      ? t("filterItem", { label: item.label })
                      : item.label}
                  </span>
                  <span aria-hidden className="shrink-0 font-mono text-[11px] text-muted">
                    ↵
                  </span>
                </Command.Item>
              ),
            )}
          </Command.Group>
        ))}
      </Command.List>
      <p
        aria-hidden
        className="border-t border-hairline px-[18px] py-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted"
      >
        {t("hint")}
      </p>
    </Command.Dialog>
  );
}
