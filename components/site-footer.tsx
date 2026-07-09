import { getTranslations } from "next-intl/server";
import { GITHUB_URL } from "@/lib/seo";
import LocaleSwitcher from "@/components/locale-switcher";

/** Global footer: license line, provenance, GitHub, locale switcher. */
export default async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
          {t("license")}
          <span aria-hidden className="px-2 text-muted/50">
            ·
          </span>
          {t("builtWith")}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:text-text"
          >
            {t("github")}
          </a>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
