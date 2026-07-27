"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Book = {
  id: string;
  titleKo: string;
  titleEn: string;
  author: string;
  spec: string;
  plates: ("pink" | "blue" | "yellow")[];
  hue: string;
};

const BOOKS: Book[] = [
  {
    id: "b1",
    titleKo: "세 도시의 밤",
    titleEn: "Nights of Three Cities",
    author: "박서영 · Park Seo-yeong",
    spec: "A5 · 128p · 2C",
    plates: ["pink", "blue"],
    hue: "pink",
  },
  {
    id: "b2",
    titleKo: "망점의 시",
    titleEn: "A Halftone Almanac",
    author: "최문하 · Choi Mun-ha",
    spec: "B6 · 96p · 3C",
    plates: ["pink", "blue", "yellow"],
    hue: "blue",
  },
  {
    id: "b3",
    titleKo: "필름 굽는 법",
    titleEn: "How to Bake Film",
    author: "이린 · Lee Rin",
    spec: "A5 · 64p · 2C",
    plates: ["blue", "yellow"],
    hue: "yellow",
  },
  {
    id: "b4",
    titleKo: "겹침에 대하여",
    titleEn: "On Overprint",
    author: "정하늘 · Jeong Ha-neul",
    spec: "A4 · 40p · 1C",
    plates: ["pink"],
    hue: "pink",
  },
  {
    id: "b5",
    titleKo: "재생지 일기",
    titleEn: "Recycled Diaries",
    author: "윤하로 · Yun Ha-ro",
    spec: "B5 · 160p · 2C",
    plates: ["blue", "yellow"],
    hue: "blue",
  },
  {
    id: "b6",
    titleKo: "상영관 노트",
    titleEn: "Notes from the Projection Booth",
    author: "김솔 · Kim Sol",
    spec: "A6 · 88p · 3C",
    plates: ["pink", "blue", "yellow"],
    hue: "yellow",
  },
];

/**
 * Section 03 — the catalogue. A grid of book covers, every one built from
 * CSS + inline SVG (no images): a halftone field in the title's plate,
 * the Korean title set in the literary serif, an overprinted spine block,
 * and the ISBN/folio in the ledger mono. Each cover wipes open with a
 * clip-path-reveal as it enters the viewport — the inset polygon grows
 * from the bottom edge like a sheet feeding off the press, staggered so a
 * row reads as a small print run. Under reduced motion / no-JS the covers
 * simply stand revealed.
 *
 * The reveal is IntersectionObserver-driven and writes one class; the clip
 * animation is CSS. Covers are real <article>s with a heading + meta for
 * the accessibility tree.
 */
export default function BookGrid() {
  const reduced = usePrefersReducedMotion();
  const gridRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduced) {
      // No-JS / reduced motion: everything already revealed.
      grid?.querySelectorAll<HTMLElement>(".riso-cover").forEach((el) =>
        el.classList.add("is-revealed"),
      );
      return;
    }
    const covers = Array.from(
      grid.querySelectorAll<HTMLElement>(".riso-cover"),
    );
    const io = new IntersectionObserver(
      (hits) => {
        for (const h of hits) {
          if (h.isIntersecting) {
            h.target.classList.add("is-revealed");
            io.unobserve(h.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    covers.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      className="riso-section riso-books"
      id="riso-books"
      ref={gridRef}
      aria-labelledby="riso-books-title"
    >
      <div className="riso-secnum__row">
        <span className="riso-secnum" aria-hidden="true">03</span>
        <h2 className="riso-secnum__title" id="riso-books-title">
          The catalogue <span lang="ko">목록</span>
        </h2>
        <p className="riso-secnum__note">
          <span>Printed this season.</span>{" "}
          <span lang="ko">이번 절기에 찍은 책.</span>
        </p>
      </div>

      <div className="riso-books__grid">
        {BOOKS.map((b) => (
          <article
            key={b.id}
            className={`riso-cover riso-cover--${b.hue}`}
            aria-labelledby={`${b.id}-t`}
          >
            <div className="riso-cover__face">
              <span
                className="riso-cover__halftone"
                aria-hidden="true"
              />
              <svg className="riso-cover__mark" viewBox="0 0 120 160" width="120" height="160" aria-hidden="true" focusable="false">
                {/* spine block */}
                <rect x="10" y="10" width="100" height="20" fill="var(--riso-ink)" />
                {/* a small overprinted circle mark, unique per hue */}
                <circle cx="60" cy="92" r="30" fill="none" stroke="var(--riso-ink)" strokeWidth="2" />
                <circle cx="60" cy="92" r="6" fill="var(--riso-ink)" />
              </svg>
              <p className="riso-cover__imprint" lang="ko">리소 출판</p>
              <h3 id={`${b.id}-t`} className="riso-cover__title" lang="ko">
                {b.titleKo}
              </h3>
              <p className="riso-cover__title-en">{b.titleEn}</p>
              <p className="riso-cover__author">{b.author}</p>
              <div className="riso-cover__foot">
                <span className="riso-cover__spec">{b.spec}</span>
                <span className="riso-cover__plates" aria-hidden="true">
                  {b.plates.map((p) => (
                    <span key={p} className={`riso-cover__plate riso-cover__plate--${p}`} />
                  ))}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
