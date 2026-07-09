"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * EN / KO toggle that re-links the current pathname in the other locale.
 * Rendered in the header and repeated in the footer.
 */
export default function LocaleSwitcher({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations("nav");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("localeAria")}
      className={`flex items-center font-mono text-[11px] uppercase tracking-[0.15em] ${className ?? ""}`}
    >
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span aria-hidden className="px-1 text-muted/50">
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={locale}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "px-0.5 py-1 text-text"
                : "px-0.5 py-1 text-muted transition-colors duration-200 ease-out hover:text-text"
            }
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
