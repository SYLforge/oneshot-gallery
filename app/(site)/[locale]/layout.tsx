import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans_KR,
  Noto_Serif_KR,
  Schibsted_Grotesk,
} from "next/font/google";
import { routing } from "@/i18n/routing";
import { getGalleryIndex } from "@/lib/entries";
import PaletteProvider from "@/components/palette-provider";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import "../globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: {
      default: t("name"),
      template: `%s — ${t("name")}`,
    },
    description: t("description"),
  };
}

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${instrumentSerif.variable} ${notoSerifKr.variable} ${schibsted.variable} ${notoSansKr.variable} ${geistMono.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <PaletteProvider entries={getGalleryIndex()}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </PaletteProvider>
          <div className="grain" aria-hidden />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
