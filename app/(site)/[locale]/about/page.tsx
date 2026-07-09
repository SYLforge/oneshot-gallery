import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { GITHUB_URL, pageAlternates } from "@/lib/seo";

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: pageAlternates(l, "/about"),
  };
}

type AboutLink = { label: string; href: string };

type AboutSection = {
  title: string;
  paragraphs: string[];
  links?: AboutLink[];
};

const RUBRIC_URL = `${GITHUB_URL}/blob/main/docs/RUBRIC.md`;
const CONTRIBUTING_URL = `${GITHUB_URL}/blob/main/CONTRIBUTING.md`;

/**
 * Long-form editorial copy, written natively per locale (not translated
 * line-by-line). UI strings live in messages/*.json; this is content.
 */
const CONTENT: Record<Locale, { lede: string; sections: AboutSection[] }> = {
  en: {
    lede: "A design gallery should hand you the whole thing. This one does.",
    sections: [
      {
        title: "What this is",
        paragraphs: [
          "Oneshot Gallery is an open-source annex of art-directed, full-page frontend designs. Every entry ships as a trifecta: a live demo you can resize and prod, the complete source code, and the exact AI prompt that produced it.",
          "The gap it fills is real. Inspiration galleries show you screenshots and keep the code; component registries paywall the complete pages. Here nothing is held back — copy the files, install them with one command, or take the prompt and grow your own version.",
        ],
      },
      {
        title: "Honest provenance",
        paragraphs: [
          "Every prompt is labeled with its class. One-shot means the page came out of a single prompt, with the number of corrective follow-ups counted and disclosed. Distilled recipe means the prompt was reconstructed after iterative work — still reproducible, never passed off as a lucky first take.",
          "Each PROMPT.md pins the exact model id, the date, the harness it ran in, and a verification status. When a prompt is re-run and the result holds, the entry is marked verified; until then it stays honestly unverified.",
        ],
      },
      {
        title: "The quality bar",
        paragraphs: [
          "Every candidate faces the rubric before it gets a number. Anti-slop is policy: no generic gradient-on-black, no unreviewed AI output, no entry without a point of view. Fourteen entries that survive curation beat four hundred that don't — curation is the product.",
        ],
        links: [{ label: "docs/RUBRIC.md ↗", href: RUBRIC_URL }],
      },
      {
        title: "Media & licensing",
        paragraphs: [
          "All code is MIT — use it commercially, strip the credits, we mean it. Imagery and posters are CC BY 4.0. When an entry uses generated imagery (ComfyUI or otherwise), its meta discloses the workflow provenance; entries built without any generated assets carry the pure-code label.",
        ],
      },
      {
        title: "Contribute",
        paragraphs: [
          "New entries start with pnpm new-entry, which scaffolds the full anatomy: meta, tokens, prompt, and breakdowns in both languages. Pull requests run the same validator and rubric the curators use. Bring an aesthetic that isn't represented yet — the taxonomy has room.",
        ],
        links: [
          { label: "GitHub ↗", href: GITHUB_URL },
          { label: "CONTRIBUTING.md ↗", href: CONTRIBUTING_URL },
        ],
      },
    ],
  },
  ko: {
    lede: "디자인 갤러리라면 전부를 건네야 한다고 믿습니다. 여기는 그렇게 합니다.",
    sections: [
      {
        title: "이것은 무엇인가",
        paragraphs: [
          "원샷 갤러리는 아트 디렉션이 완결된 풀페이지 프론트엔드 디자인을 모아 둔 오픈소스 별관입니다. 모든 작품은 세 가지를 한 세트로 내놓습니다. 직접 만지고 크기를 바꿔 볼 수 있는 라이브 데모, 전체 소스 코드, 그리고 그 결과물을 만들어낸 AI 프롬프트 원문.",
          "이 갤러리가 메우려는 틈은 분명합니다. 영감 갤러리는 스크린샷만 보여주고 코드는 감추며, 컴포넌트 레지스트리는 완성된 페이지에 값을 매깁니다. 여기서는 아무것도 잠그지 않습니다. 파일을 복사하든, 명령어 하나로 설치하든, 프롬프트를 가져다 새 버전을 기르든 — 전부 자유입니다.",
        ],
      },
      {
        title: "정직한 출처",
        paragraphs: [
          "모든 프롬프트에는 등급이 붙습니다. 원샷(one-shot)은 프롬프트 한 번으로 페이지가 나왔다는 뜻이고, 후속 수정이 있었다면 그 횟수까지 그대로 적습니다. 증류 레시피(distilled recipe)는 여러 차례의 작업 끝에 재구성한 프롬프트라는 뜻입니다. 재현은 가능하지만, 운 좋은 첫 시도였던 척은 하지 않습니다.",
          "PROMPT.md마다 정확한 모델 ID와 날짜, 실행한 하네스, 검증 상태를 못 박아 둡니다. 프롬프트를 다시 돌려 결과가 유지되면 '검증됨'으로 표시하고, 그 전까지는 정직하게 '미검증'으로 남겨 둡니다.",
        ],
      },
      {
        title: "품질의 기준",
        paragraphs: [
          "모든 후보작은 번호를 받기 전에 루브릭을 통과해야 합니다. 안티 슬롭은 정책입니다. 검은 배경에 그라디언트만 얹은 흔한 화면도, 검수 없는 AI 출력물도, 관점 없는 작품도 받지 않습니다. 큐레이션을 통과한 열네 점이 그렇지 못한 사백 점보다 낫습니다. 큐레이션이 곧 제품입니다.",
        ],
        links: [{ label: "docs/RUBRIC.md ↗", href: RUBRIC_URL }],
      },
      {
        title: "미디어와 라이선스",
        paragraphs: [
          "코드는 전부 MIT입니다. 상업적으로 쓰고, 크레딧을 지워도 됩니다. 진심입니다. 이미지와 포스터는 CC BY 4.0을 따릅니다. 생성 이미지(ComfyUI 등)를 쓴 작품은 메타데이터에 워크플로 출처를 함께 공개하고, 생성 에셋 없이 만든 작품에는 '순수 코드' 라벨을 붙입니다.",
        ],
      },
      {
        title: "기여하기",
        paragraphs: [
          "새 작품은 pnpm new-entry로 시작합니다. 메타, 토큰, 프롬프트, 두 언어의 해설까지 — 필요한 뼈대가 한 번에 생성됩니다. 풀 리퀘스트는 큐레이터가 쓰는 것과 동일한 검증기와 루브릭을 통과해야 합니다. 아직 없는 미학을 들고 와 주세요. 분류표에는 자리가 남아 있습니다.",
        ],
        links: [
          { label: "GitHub ↗", href: GITHUB_URL },
          { label: "CONTRIBUTING.md ↗", href: CONTRIBUTING_URL },
        ],
      },
    ],
  },
};

/** Single-column editorial page with the giant-numeral section motif. */
export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const content = CONTENT[locale];

  return (
    <main className="mx-auto min-h-screen max-w-[46rem] px-6 py-16 md:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {t("kicker")}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-none">
        {t("title")}
      </h1>
      <p className="mt-10 font-display text-[clamp(1.4rem,3vw,2rem)] leading-[1.3]">
        <em>{content.lede}</em>
      </p>

      {content.sections.map((section, i) => (
        <section key={section.title} className="mt-16 border-t border-hairline pt-10">
          <div className="flex items-baseline gap-6">
            <span
              aria-hidden
              className="font-display text-[3.5rem] leading-none text-muted/25 select-none"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight">
              {section.title}
            </h2>
          </div>
          <div className="mt-6 space-y-5">
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-[15px] leading-[1.85] text-text/85"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {section.links && (
            <p className="mt-6 flex flex-wrap gap-3">
              {section.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </p>
          )}
        </section>
      ))}
    </main>
  );
}
