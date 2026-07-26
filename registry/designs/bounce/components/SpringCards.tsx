"use client";

import { useSpringPress } from "../hooks/useSpring";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Book = {
  id: string;
  ko: string;
  en: string;
  age: string;
  tone: "sky" | "peach" | "grape" | "butter";
  blurbKo: string;
  blurbEn: string;
  /** one-word emoji-free emoji stand-in drawn as SVG */
  shape: "bunny" | "rocket" | "cloud" | "apple";
};

const BOOKS: Book[] = [
  {
    id: "bunny",
    ko: "토끼가 통통",
    en: "Bunny Boings",
    age: "만 2–4세",
    tone: "peach",
    blurbKo: "깡총거리는 토끼 한 마리. 어디로 튀어 갈까요?",
    blurbEn: "A rabbit who can't stop hopping. Where does she go?",
    shape: "bunny",
  },
  {
    id: "rocket",
    ko: "둥둥 로켓",
    en: "The Boing Rocket",
    age: "만 4–6세",
    tone: "sky",
    blurbKo: "찌릿, 슝, 통통. 작은 로켓의 첫 우주 여행.",
    blurbEn: "Spark, whoosh, boing. A tiny rocket's first trip to space.",
    shape: "rocket",
  },
  {
    id: "cloud",
    ko: "구름이 말랑말랑",
    en: "Squishy Cloud",
    age: "만 3–5세",
    tone: "grape",
    blurbKo: "구름을 만져보세요. 말랑. 한 번 더 만져보세요.",
    blurbEn: "Touch the cloud. Squish. Now poke it again.",
    shape: "cloud",
  },
  {
    id: "apple",
    ko: "사과가 콩콩",
    en: "The Bouncy Apple",
    age: "만 2–4세",
    tone: "butter",
    blurbKo: "굴러가는 사과 하나. 동글동글, 콩콩콩.",
    blurbEn: "One rolling apple. Round and round, boing boing boing.",
    shape: "apple",
  },
];

function CardShape({ shape }: { shape: Book["shape"] }) {
  if (shape === "bunny") {
    return (
      <svg viewBox="0 0 80 80" width="72" height="72" focusable="false" aria-hidden="true">
        <ellipse cx="40" cy="56" rx="22" ry="18" fill="var(--bounce-ink)" />
        <ellipse cx="30" cy="24" rx="6" ry="16" fill="var(--bounce-ink)" />
        <ellipse cx="50" cy="24" rx="6" ry="16" fill="var(--bounce-ink)" />
        <ellipse cx="30" cy="26" rx="3" ry="10" fill="var(--bounce-accent)" />
        <ellipse cx="50" cy="26" rx="3" ry="10" fill="var(--bounce-accent)" />
        <circle cx="33" cy="52" r="2.6" fill="var(--bounce-cream)" />
        <circle cx="47" cy="52" r="2.6" fill="var(--bounce-cream)" />
        <path d="M37 60 q3 3 6 0" stroke="var(--bounce-cream)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (shape === "rocket") {
    return (
      <svg viewBox="0 0 80 80" width="72" height="72" focusable="false" aria-hidden="true">
        <path d="M40 8c12 8 16 22 16 36H24c0-14 4-28 16-36z" fill="var(--bounce-plum)" />
        <circle cx="40" cy="30" r="6" fill="var(--bounce-cream)" />
        <path d="M24 44l-10 14 14-6z" fill="var(--bounce-accent)" />
        <path d="M56 44l10 14-14-6z" fill="var(--bounce-accent)" />
        <path d="M32 44c0 6 4 12 8 18 4-6 8-12 8-18z" fill="var(--bounce-accent)" />
      </svg>
    );
  }
  if (shape === "cloud") {
    return (
      <svg viewBox="0 0 80 80" width="72" height="72" focusable="false" aria-hidden="true">
        <path
          d="M24 56c-9 0-16-5-16-13s7-13 16-13c2-5 7-9 14-9s13 4 15 10c2-1 4-1 6-1 9 0 16 6 16 14s-7 12-16 12H24z"
          fill="var(--bounce-cream)"
          stroke="var(--bounce-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // apple
  return (
    <svg viewBox="0 0 80 80" width="72" height="72" focusable="false" aria-hidden="true">
      <path d="M40 26c4-8 14-10 20-6 0 12-8 18-20 18z" fill="var(--bounce-plum)" />
      <path
        d="M40 30c-14 0-24 10-24 24 0 12 10 20 24 20s24-8 24-20c0-14-10-24-24-24z"
        fill="var(--bounce-accent)"
        stroke="var(--bounce-ink)"
        strokeWidth="3"
      />
      <path d="M40 28c0-6 2-10 6-12" stroke="var(--bounce-plum)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Card({ book }: { book: Book }) {
  const reduced = usePrefersReducedMotion();
  const ref = useSpringPress<HTMLLIElement>(reduced);

  return (
    <li
      ref={ref}
      className={`bounce-book bounce-book--${book.tone}`}
      data-bounce-card
      tabIndex={0}
    >
      <div className="bounce-book__art" aria-hidden="true">
        <CardShape shape={book.shape} />
      </div>
      <p className="bounce-book__age">
        <span lang="ko">{book.age}</span>
      </p>
      <h3 className="bounce-book__title">
        <span lang="ko" className="bounce-book__ko">
          {book.ko}
        </span>
        <span className="bounce-book__en">{book.en}</span>
      </h3>
      <p className="bounce-book__blurb">
        <span lang="ko">{book.blurbKo}</span>
        <span className="bounce-book__blurb-en">{book.blurbEn}</span>
      </p>
    </li>
  );
}

/**
 * The shelf — four picture-book cards that bounce in with overshoot as the
 * section scrolls into view (`char-split-reveal`'s sibling card preset in
 * useBounceReveal), and each card squashes when you press it. The card is
 * a real list item (`<li>`) inside a `<ul>`; focusable so keyboard and
 * touch reach it; the spring press is the same rubber gesture as the hero
 * CTA.
 */
export default function SpringCards() {
  return (
    <section
      id="bounce-books"
      className="bounce-shelf"
      aria-labelledby="bounce-shelf-title"
    >
      <div className="bounce-sec">
        <span className="bounce-sec__no" aria-hidden="true">
          하나
        </span>
        <h2 className="bounce-sec__title" id="bounce-shelf-title">
          <span lang="ko">요즘 나오는 책</span>
          <span className="bounce-sec__title-en">on the shelf</span>
        </h2>
      </div>
      <p className="bounce-shelf__lede">
        <span lang="ko">네 권의 그림책 — 한 권씩 튀어 올라옵니다.</span>
        <span className="bounce-shelf__lede-en">
          Four picture books — each one bounces in to say hi.
        </span>
      </p>
      <ul className="bounce-shelf__grid">
        {BOOKS.map((b) => (
          <Card key={b.id} book={b} />
        ))}
      </ul>
    </section>
  );
}
