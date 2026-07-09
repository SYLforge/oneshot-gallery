export type LocalizedLabel = {
  en: string;
  ko: string;
};

export type TaxonomyTerm = {
  id: string;
  label: LocalizedLabel;
  blurb: LocalizedLabel;
};

/**
 * Aesthetic families — every entry commits to exactly one.
 * Capped at 3 entries per family across tiers (see CONTRIBUTING).
 */
export const aesthetics: TaxonomyTerm[] = [
  {
    id: "washi-sumi-e",
    label: { en: "Washi & Sumi-e", ko: "화지·수묵" },
    blurb: {
      en: "Paper, ink, and negative space. Motion breathes like a brushstroke.",
      ko: "종이와 먹, 그리고 여백. 붓질처럼 호흡하는 모션.",
    },
  },
  {
    id: "neo-brutalist",
    label: { en: "Neo-Brutalist", ko: "네오브루탈리즘" },
    blurb: {
      en: "Hard shadows, raw type, zero easing apologies.",
      ko: "단단한 그림자, 날것의 타이포, 사과 없는 무이징.",
    },
  },
  {
    id: "editorial-serif",
    label: { en: "Editorial Serif", ko: "에디토리얼 세리프" },
    blurb: {
      en: "Magazine rhythm: columns, folios, drop caps, restraint.",
      ko: "잡지의 리듬: 단, 폴리오, 두문자, 절제.",
    },
  },
  {
    id: "terminal-core",
    label: { en: "Terminal Core", ko: "터미널 코어" },
    blurb: {
      en: "Phosphor glow, scanlines, and the poetry of log files.",
      ko: "인광 발광, 주사선, 로그 파일의 시.",
    },
  },
  {
    id: "luxury-fashion",
    label: { en: "Luxury & Fashion", ko: "럭셔리·패션" },
    blurb: {
      en: "Hairline type, slow reveals, expensive silence.",
      ko: "헤어라인 타이포, 느린 리빌, 값비싼 침묵.",
    },
  },
  {
    id: "cinematic-dark",
    label: { en: "Cinematic Dark", ko: "시네마틱 다크" },
    blurb: {
      en: "Letterboxed scenes, scrubbed reels, screen-direction copy.",
      ko: "레터박스 신, 스크럽 릴, 지문처럼 쓴 카피.",
    },
  },
  {
    id: "glass-futurism",
    label: { en: "Glass Futurism", ko: "글래스 퓨처리즘" },
    blurb: {
      en: "Refraction, aurora light, panels that remember your pointer.",
      ko: "굴절과 오로라 빛, 포인터를 기억하는 유리 패널.",
    },
  },
  {
    id: "playful-pop",
    label: { en: "Playful Pop", ko: "플레이풀 팝" },
    blurb: {
      en: "Stickers, springs, and colors that talk back.",
      ko: "스티커와 스프링, 말대꾸하는 컬러.",
    },
  },
  {
    id: "webtoon",
    label: { en: "Webtoon", ko: "웹툰" },
    blurb: {
      en: "Panel pacing, SFX lettering, the scroll as a page-turn.",
      ko: "패널 호흡, 효과음 레터링, 스크롤이 곧 페이지 넘김.",
    },
  },
  {
    id: "korean-traditional",
    label: { en: "Korean Traditional", ko: "한국 전통" },
    blurb: {
      en: "Dancheong, hanji, obangsaek — heritage as a living system.",
      ko: "단청, 한지, 오방색 — 살아 있는 체계로서의 전통.",
    },
  },
  {
    id: "swiss-typographic",
    label: { en: "Swiss Typographic", ko: "스위스 타이포그래피" },
    blurb: {
      en: "The grid is the hero. One red. Nothing else.",
      ko: "그리드가 주인공. 빨강 하나. 그 외엔 없음.",
    },
  },
  {
    id: "organic-nature",
    label: { en: "Organic Nature", ko: "오가닉 네이처" },
    blurb: {
      en: "Growth systems, wind fields, interfaces that breathe.",
      ko: "성장 시스템, 바람의 장, 숨 쉬는 인터페이스.",
    },
  },
  {
    id: "bento-product",
    label: { en: "Bento Product", ko: "벤토 프로덕트" },
    blurb: {
      en: "Tiles that expand, devices that explode into parts.",
      ko: "펼쳐지는 타일, 부품으로 분해되는 디바이스.",
    },
  },
  {
    id: "vaporwave",
    label: { en: "Vaporwave", ko: "베이퍼웨이브" },
    blurb: {
      en: "Perspective grids, chromatic drift, dead-mall radio.",
      ko: "원근 그리드, 색수차 드리프트, 폐쇄된 쇼핑몰의 라디오.",
    },
  },
];

/**
 * Motion / technique tags — 1 to 6 per entry, each anchored by a
 * breakdown section explaining how it was built.
 */
export const techniques: TaxonomyTerm[] = [
  {
    id: "scroll-scrub-pinned",
    label: { en: "Scroll-scrubbed pinned section", ko: "스크롤 스크럽 핀 섹션" },
    blurb: {
      en: "A pinned scene whose timeline is driven by lerp-smoothed scroll progress.",
      ko: "lerp로 스무딩된 스크롤 진행도가 타임라인을 모는 고정 섹션.",
    },
  },
  {
    id: "canvas-particles",
    label: { en: "Canvas particle field", ko: "캔버스 파티클 필드" },
    blurb: {
      en: "A DPR-aware canvas system, often coupled to scroll velocity or pointer.",
      ko: "스크롤 속도나 포인터에 반응하는 DPR 대응 캔버스 시스템.",
    },
  },
  {
    id: "char-split-reveal",
    label: { en: "Character-split reveal", ko: "글자 분할 리빌" },
    blurb: {
      en: "Accessible split text (aria-label + aria-hidden spans) animated per glyph.",
      ko: "접근성을 지킨 스플릿 텍스트를 글리프 단위로 애니메이션.",
    },
  },
  {
    id: "feturbulence-texture",
    label: { en: "feTurbulence texture", ko: "feTurbulence 텍스처" },
    blurb: {
      en: "SVG fractal noise as grain, paper fiber, or displacement maps.",
      ko: "SVG 프랙탈 노이즈로 만든 그레인, 종이 결, 변위 맵.",
    },
  },
  {
    id: "typewriter",
    label: { en: "Typewriter sequence", ko: "타자기 시퀀스" },
    blurb: {
      en: "Timed or velocity-driven character output with a living cursor.",
      ko: "시간 또는 속도 기반의 글자 출력과 살아 있는 커서.",
    },
  },
  {
    id: "ascii-render",
    label: { en: "ASCII renderer", ko: "ASCII 렌더러" },
    blurb: {
      en: "Canvas scenes rasterized into character density fields.",
      ko: "캔버스 장면을 문자 밀도의 장으로 래스터화.",
    },
  },
  {
    id: "crt-scanline",
    label: { en: "CRT scanline & distortion", ko: "CRT 주사선·왜곡" },
    blurb: {
      en: "Aperture grilles, barrel distortion, phosphor persistence.",
      ko: "애퍼처 그릴, 배럴 왜곡, 인광 잔상.",
    },
  },
  {
    id: "marquee",
    label: { en: "Kinetic marquee", ko: "키네틱 마퀴" },
    blurb: {
      en: "Looping tickers that react to scroll direction or velocity.",
      ko: "스크롤 방향·속도에 반응하는 순환 티커.",
    },
  },
  {
    id: "drag-physics",
    label: { en: "Drag physics", ko: "드래그 물리" },
    blurb: {
      en: "Inertia, springs, and rotation on user-draggable objects.",
      ko: "드래그 가능한 오브젝트의 관성, 스프링, 회전.",
    },
  },
  {
    id: "webgl-shader",
    label: { en: "WebGL shader scene", ko: "WebGL 셰이더 신" },
    blurb: {
      en: "Fragment-shader gradients and fields with a CSS fallback.",
      ko: "CSS 폴백을 갖춘 프래그먼트 셰이더 그라디언트와 필드.",
    },
  },
  {
    id: "svg-line-draw",
    label: { en: "SVG line draw", ko: "SVG 선 드로잉" },
    blurb: {
      en: "stroke-dashoffset drawing scrubbed by scroll or time.",
      ko: "스크롤이나 시간으로 스크럽하는 stroke-dashoffset 드로잉.",
    },
  },
  {
    id: "clip-path-reveal",
    label: { en: "Clip-path reveal", ko: "클립패스 리빌" },
    blurb: {
      en: "Direction-aware inset/polygon wipes on images and panels.",
      ko: "방향을 인지하는 이미지·패널의 인셋/폴리곤 와이프.",
    },
  },
  {
    id: "pointer-parallax",
    label: { en: "Pointer parallax", ko: "포인터 패럴랙스" },
    blurb: {
      en: "Layered depth that drifts with the pointer, lerped and capped.",
      ko: "포인터를 따라 흐르는 레이어 깊이 — lerp와 상한 처리.",
    },
  },
  {
    id: "flip-layout",
    label: { en: "FLIP layout transition", ko: "FLIP 레이아웃 전환" },
    blurb: {
      en: "First-Last-Invert-Play morphs between layout states.",
      ko: "레이아웃 상태 사이를 잇는 First-Last-Invert-Play 모프.",
    },
  },
  {
    id: "sprite-scrub",
    label: { en: "Sprite-sequence scrub", ko: "스프라이트 시퀀스 스크럽" },
    blurb: {
      en: "Image-sequence strips scrubbed by scroll — the no-video video.",
      ko: "스크롤로 스크럽하는 이미지 시퀀스 — 비디오 없는 비디오.",
    },
  },
  {
    id: "spring-press",
    label: { en: "Spring press feedback", ko: "스프링 프레스 피드백" },
    blurb: {
      en: "Squash-and-stretch on press, tuned spring configs.",
      ko: "누를 때의 스쿼시·스트레치, 조율된 스프링 설정.",
    },
  },
  {
    id: "glass-specular",
    label: { en: "Specular glass", ko: "스펙큘러 글래스" },
    blurb: {
      en: "backdrop-filter panels whose highlights track the pointer.",
      ko: "하이라이트가 포인터를 추적하는 backdrop-filter 패널.",
    },
  },
  {
    id: "text-path",
    label: { en: "Text on a path", ko: "패스 위의 텍스트" },
    blurb: {
      en: "SVG textPath waves and orbits, often velocity-modulated.",
      ko: "SVG textPath의 물결과 궤도 — 속도로 변조되곤 함.",
    },
  },
];

/** Fictional brand verticals, for browsing by "what kind of site is this". */
export const industries: TaxonomyTerm[] = [
  {
    id: "atelier",
    label: { en: "Atelier & Craft", ko: "아틀리에·공방" },
    blurb: { en: "Studios, workshops, makers.", ko: "스튜디오, 공방, 만드는 사람들." },
  },
  {
    id: "publishing",
    label: { en: "Publishing & Media", ko: "출판·미디어" },
    blurb: { en: "Magazines, journals, stories.", ko: "잡지, 저널, 이야기." },
  },
  {
    id: "science",
    label: { en: "Science & Observation", ko: "과학·관측" },
    blurb: { en: "Observatories, bureaus, instruments.", ko: "관측소, 관서, 계기." },
  },
  {
    id: "entertainment",
    label: { en: "Entertainment", ko: "엔터테인먼트" },
    blurb: { en: "Webtoons, scores, screens.", ko: "웹툰, 음악, 스크린." },
  },
  {
    id: "fashion-beauty",
    label: { en: "Fashion & Beauty", ko: "패션·뷰티" },
    blurb: { en: "Houses, scents, silhouettes.", ko: "하우스, 향, 실루엣." },
  },
  {
    id: "product",
    label: { en: "Product & Hardware", ko: "프로덕트·하드웨어" },
    blurb: { en: "Devices and the pages that sell them.", ko: "디바이스와 그것을 파는 페이지." },
  },
  {
    id: "retail-food",
    label: { en: "Retail & Food", ko: "리테일·푸드" },
    blurb: { en: "Shops, clubs, counters.", ko: "가게, 클럽, 카운터." },
  },
  {
    id: "culture",
    label: { en: "Culture & Heritage", ko: "문화·유산" },
    blurb: { en: "Museums, guilds, restoration.", ko: "박물관, 길드, 복원." },
  },
  {
    id: "wellness",
    label: { en: "Wellness", ko: "웰니스" },
    blurb: { en: "Retreats, rituals, rest.", ko: "리트릿, 의식, 쉼." },
  },
];

export const taxonomyIds = {
  aesthetics: aesthetics.map((t) => t.id),
  techniques: techniques.map((t) => t.id),
  industries: industries.map((t) => t.id),
};
