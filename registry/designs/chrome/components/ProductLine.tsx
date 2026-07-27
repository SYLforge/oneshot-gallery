"use client";

import type { CSSProperties } from "react";
import HoloFoil from "./HoloFoil";

type Product = {
  id: string;
  code: string; // monospace spec code
  name: string;
  nameKo: string;
  shade: string;
  shadeKo: string;
  line: string;
  lineKo: string;
  /** 0..1 — positions the moving specular along the chrome pill */
  spec: number;
  /** the holographic underglow hue token (sky/pink/mint) */
  glow: "sky" | "pink" | "mint";
};

/** Five pourings — every gloss is a metal, named by its finish. */
const PRODUCTS: Product[] = [
  {
    id: "mirror",
    code: "CRM-01",
    name: "Mirror Pour",
    nameKo: "거울 붓",
    shade: "Liquid Mercury",
    shadeKo: "액체 수은",
    line: "A gloss that sets to a mirror you can almost see your whole face in.",
    lineKo: "거의 온얼굴이 비치는 거울로 굳는 글로스.",
    spec: 0.32,
    glow: "sky",
  },
  {
    id: "dawn",
    code: "CRM-02",
    name: "Dawn Foil",
    nameKo: "새벽 박",
    shade: "Iridescent Pearl",
    shadeKo: "무지개 진주",
    line: "Pink at one angle, mint at another — the foil remembers the light.",
    lineKo: "한 각도에선 분홍, 다른 각도에선 민트 — 빛을 기억하는 박.",
    spec: 0.5,
    glow: "pink",
  },
  {
    id: "gunmetal",
    code: "CRM-03",
    name: "Gunmetal Veil",
    nameKo: "건메탈 베일",
    shade: "Cool Graphite",
    shadeKo: "차가운 흑연",
    line: "The deepest chrome — a shadow with a wet edge, never flat.",
    lineKo: "가장 깊은 크롬 — 젖은 테를 가진 그림자, 결코 납작하지 않다.",
    spec: 0.26,
    glow: "mint",
  },
  {
    id: "chrome-pink",
    code: "CRM-04",
    name: "Chrome Pink",
    nameKo: "크롬 핑크",
    shade: "Hot Hologram",
    shadeKo: "뜨거운 홀로그램",
    line: "The accent the whole counter orbits — metal that learned to blush.",
    lineKo: "매장 전체가 도는 액센트 — 붉힐 줄 안 금속.",
    spec: 0.46,
    glow: "pink",
  },
  {
    id: "platinum",
    code: "CRM-05",
    name: "Platinum Glaze",
    nameKo: "플래티넘 유광",
    shade: "White Chrome",
    shadeKo: "흰 크롬",
    line: "The lightest pour — a white that still reads as metal, not paint.",
    lineKo: "가장 옅은 붓 — 페인트가 아니라 금속으로 읽히는 하양.",
    spec: 0.58,
    glow: "sky",
  },
];

/**
 * A single "product photograph" — but no photograph. The chrome pill is a
 * CSS radial chrome gradient (silver core, highlight cap, shadow floor)
 * with a specular band positioned by `spec` and a holographic underglow
 * keyed to the product's glow token. Decorative; the text carries meaning.
 */
function ChromePill({ product }: { product: Product }) {
  const glowVar = `var(--chrome-glow-${product.glow})`;
  return (
    <svg
      className="chrome-pill"
      viewBox="0 0 260 340"
      role="img"
      aria-label={`${product.name} — ${product.shade}: a chrome cosmetics tube drawn entirely in gradients, a liquid-metal body with a moving white specular and a holographic ${product.glow} underglow. ${product.nameKo} — ${product.shadeKo}: 그라디언트만으로 그린 크롬 화장품 튜브, 움직이는 흰 반사점과 ${product.glow} 빛의 홀로그램 밑빛을 가진 액체 금속 보디.`}
    >
      <defs>
        <radialGradient id={`chrome-cap-${product.id}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#c8d0d8" />
          <stop offset="100%" stopColor="#2a2a3a" />
        </radialGradient>
        <linearGradient id={`chrome-body-${product.id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2a3a" />
          <stop offset="12%" stopColor="#6a6a7e" />
          <stop offset="30%" stopColor="#c8d0d8" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#c8d0d8" />
          <stop offset="88%" stopColor="#6a6a7e" />
          <stop offset="100%" stopColor="#2a2a3a" />
        </linearGradient>
        <linearGradient id={`chrome-spec-${product.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`chrome-glow-${product.id}`} cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor={glowVar} stopOpacity="0.55" />
          <stop offset="60%" stopColor={glowVar} stopOpacity="0.12" />
          <stop offset="100%" stopColor={glowVar} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* holographic floor glow */}
      <ellipse cx="130" cy="320" rx="92" ry="26" fill={`url(#chrome-glow-${product.id})`} />

      {/* cap */}
      <rect x="100" y="36" width="60" height="40" rx="6" fill={`url(#chrome-cap-${product.id})`} />
      <rect x="100" y="36" width="60" height="40" rx="6" fill="none" stroke="#2a2a3a" strokeOpacity="0.35" strokeWidth="1" />

      {/* body — the chrome tube */}
      <rect x="92" y="74" width="76" height="232" rx="10" fill={`url(#chrome-body-${product.id})`} />
      <rect x="92" y="74" width="76" height="232" rx="10" fill="none" stroke="#2a2a3a" strokeOpacity="0.3" strokeWidth="1" />

      {/* moving specular band */}
      <rect
        x="96"
        y="80"
        width="14"
        height="220"
        rx="7"
        fill={`url(#chrome-spec-${product.id})`}
        transform={`translate(${(product.spec - 0.3) * 90}, 0)`}
        opacity="0.7"
      />

      {/* shade etch line */}
      <line x1="104" y1="150" x2="156" y2="150" stroke="#2a2a3a" strokeOpacity="0.18" strokeWidth="1" />
    </svg>
  );
}

/**
 * Section 02 — the line. Five chrome pourings, each in a holographic-foil
 * card. Cards reveal with a fade as they enter the viewport; the chrome
 * pills are the entry's commitment to "no photographs" — every product
 * shot is a CSS chrome gradient.
 */
export default function ProductLine() {
  return (
    <section
      className="chrome-line"
      aria-labelledby="chrome-line-title"
    >
      <div className="chrome-sechead" data-reveal="fade">
        <p className="chrome-eyebrow">02 — the line · 다섯 붓</p>
        <h2 id="chrome-line-title" className="chrome-sechead__title">
          Five pourings{" "}
          <span lang="ko" className="chrome-sechead__ko">
            다섯 번의 붓
          </span>
        </h2>
        <p className="chrome-sechead__line">
          Every gloss is a metal, named by its finish.{" "}
          <span lang="ko" className="chrome-sechead__lineko">
            글로스 하나가 금속 하나, 마감으로 이름 붙인다.
          </span>
        </p>
      </div>

      <ul className="chrome-line__grid">
        {PRODUCTS.map((p) => (
          <li key={p.id} className="chrome-line__item" data-reveal="fade">
            <HoloFoil className="chrome-line__card" label={p.code}>
              <div
                className="chrome-line__art"
                style={{ "--chrome-spec-x": p.spec } as CSSProperties}
              >
                <ChromePill product={p} />
              </div>
              <div className="chrome-line__body">
                <p className="chrome-line__code">{p.code}</p>
                <h3 className="chrome-line__name">
                  {p.name}{" "}
                  <span lang="ko" className="chrome-line__nameko">
                    {p.nameKo}
                  </span>
                </h3>
                <p className="chrome-line__shade">
                  {p.shade}{" "}
                  <span lang="ko" className="chrome-line__shadeko">
                    {p.shadeKo}
                  </span>
                </p>
                <p className="chrome-line__line">{p.line}</p>
                <p className="chrome-line__line" lang="ko">
                  {p.lineKo}
                </p>
              </div>
            </HoloFoil>
          </li>
        ))}
      </ul>
    </section>
  );
}
