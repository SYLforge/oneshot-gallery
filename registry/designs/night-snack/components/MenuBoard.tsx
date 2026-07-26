"use client";

/**
 * Chapter 05 — the menu. 오늘의 메뉴 / TODAY'S MENU. Plain semantic HTML: an
 * ordered list of dishes, each a row with a number, a bilingual name, a
 * price, and an optional tag (매운 / NEW). Fully readable with JS off — this
 * is the SSR-completed page, and nothing here is gated behind `.ns-js` or any
 * observer. The menu is the part of the tent that has to survive a blackout.
 *
 * Prices are tabular-nums mono so the column lines up; the tag chips reuse the
 * page's neon palette (soju-green for vegetarian, pink for hot). The dashed
 * row dividers read as a hand-torn receipt.
 */
type Dish = {
  no: string;
  ko: string;
  en: string;
  price: string;
  tag?: { ko: string; en: string; kind: "hot" | "veg" };
};

const DISHES: Dish[] = [
  {
    no: "01",
    ko: "닭꼬치",
    en: "Grilled chicken skewer",
    price: "₩3,500",
    tag: { ko: "시그니처", en: "SIGNATURE", kind: "hot" },
  },
  {
    no: "02",
    ko: "떡·소시지 꼬치",
    en: "Tteokbokki & sausage skewer",
    price: "₩4,000",
    tag: { ko: "매운맛", en: "SPICY", kind: "hot" },
  },
  {
    no: "03",
    ko: "오뎅 탕",
    en: "Odeng (fish-cake) soup",
    price: "₩5,000",
    tag: { ko: "국물", en: "BROTH", kind: "veg" },
  },
  {
    no: "04",
    ko: "골뱅이 비빔면",
    en: "Spicy cone-nail noodles",
    price: "₩7,000",
    tag: { ko: "매운맛", en: "SPICY", kind: "hot" },
  },
  {
    no: "05",
    ko: "파전",
    en: "Green-onion pancake",
    price: "₩8,000",
    tag: { ko: "채소", en: "VEG", kind: "veg" },
  },
  {
    no: "06",
    ko: "소주 한 병",
    en: "Soju, one bottle",
    price: "₩5,500",
  },
  {
    no: "07",
    ko: "맥주 500mL",
    en: "Draft beer, 500mL",
    price: "₩4,500",
  },
];

export default function MenuBoard() {
  return (
    <section
      className="ns-menu"
      aria-labelledby="ns-menu-title"
      data-reveal="panel"
    >
      <div className="ns-menu__inner">
        <div className="ns-menu__head">
          <h2
            className="ns-menu__title"
            id="ns-menu-title"
            lang="ko"
            data-reveal
          >
            오늘의 메뉴
          </h2>
          <p className="ns-menu__date ns-mono" data-reveal>
            2026.07.18 · FRI · 밤 9시 — 새벽 4시
          </p>
        </div>

        <ol className="ns-menu__list">
          {DISHES.map((d) => (
            <li className="ns-menu__row" key={d.no} data-reveal>
              <span className="ns-menu__no ns-mono">{d.no}</span>
              <span className="ns-menu__name">
                <span lang="ko">{d.ko}</span>
                <span className="ns-menu__name-en">{d.en}</span>
              </span>
              <span className="ns-menu__price">
                {d.price}
                {d.tag ? (
                  <span
                    className={
                      d.tag.kind === "hot"
                        ? "ns-menu__tag ns-menu__tag--hot"
                        : "ns-menu__tag"
                    }
                  >
                    <span lang="ko">{d.tag.ko}</span>{" "}
                    <span className="ns-mono">{d.tag.en}</span>
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>

        <p className="ns-menu__note" data-reveal>
          <span lang="ko">
            모든 가격 부가세 포함. 매운맛 조절 가능합니다 — 사장님께 말씀만
            주세요. 자리는 공유합니다, 모르는 분 옆에 앉는 게 이곳의 예의.
          </span>
          All prices include tax. Spice is adjustable — just ask the boss. Seats
          are shared; sitting beside a stranger is the courtesy of this place.
        </p>
      </div>
    </section>
  );
}
