import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/locale-switcher";
import SearchTrigger from "@/components/search-trigger";

const NAV_ITEMS = [
  { key: "gallery", href: "/gallery" },
  { key: "styles", href: "/styles" },
  { key: "about", href: "/about" },
] as const;

/** Bilingual "EN · 한글" label — the Korean half yields on small screens. */
function NavLabel({ label }: { label: string }) {
  const [primary, secondary] = label.split(" · ");
  return (
    <>
      {primary}
      {secondary && <span className="hidden lg:inline"> · {secondary}</span>}
    </>
  );
}

/**
 * Global chrome: logotype, primary nav, palette trigger, locale switcher.
 * Sticky, hairline-bordered, blurred over the page.
 */
export default async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[87.5rem] items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
        <Link
          href="/"
          aria-label={t("homeAria")}
          className="flex shrink-0 items-baseline font-display text-[21px] leading-none tracking-tight"
        >
          <span aria-hidden className="text-brand">
            ●
          </span>
          neshot
        </Link>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <nav
            aria-label={t("primaryAria")}
            className="flex items-center gap-3 sm:gap-5"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:text-text"
              >
                <NavLabel label={t(item.key)} />
              </Link>
            ))}
          </nav>
          <SearchTrigger />
          <LocaleSwitcher className="hidden sm:flex" />
        </div>
      </div>
    </header>
  );
}
