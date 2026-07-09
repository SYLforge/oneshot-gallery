"use client";

import { useTranslations } from "next-intl";
import { usePalette } from "@/components/palette-provider";

/** Header button that opens the command palette. */
export default function SearchTrigger() {
  const t = useTranslations("nav");
  const { openPalette } = usePalette();
  const [key, hint] = t("search").split(" · ");

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label={t("searchAria")}
      className="border border-hairline px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:border-accent/60 hover:text-text"
    >
      {key}
      {hint && <span className="hidden sm:inline"> · {hint}</span>}
    </button>
  );
}
