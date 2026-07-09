import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");
  const tHome = await getTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-muted">
        {tHome("kicker")}
      </p>
      <h1 className="font-display text-6xl md:text-8xl">
        <span aria-hidden className="text-brand">
          ●
        </span>
        neshot
      </h1>
      <p className="max-w-xl text-lg text-muted">{t("tagline")}</p>
      <p className="font-mono text-sm text-muted">
        npx shadcn add @oneshot/…
      </p>
    </main>
  );
}
