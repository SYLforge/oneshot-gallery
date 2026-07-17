"use client";

/**
 * Section 04 — the colophon, and the sign-off. The page inverts exactly once,
 * here: sumi ground, xuan voice — stepping off the scroll into the studio
 * where the brush is being washed. Ember is permitted to carry meaning in
 * the dark (it clears AA on sumi), so the seal stays loud. A bordered button
 * scrolls back to the top — to begin the scroll again, the way a hand-scroll
 * is rewound.
 */
export default function Footer() {
  return (
    <footer className="shan-foot" aria-labelledby="shan-foot-title">
      <div className="shan-foot__inner" data-reveal="">
        <p className="shan-foot__eyebrow" aria-hidden="true">
          04 — 跋 · colophon
        </p>
        <h2 className="shan-foot__title" id="shan-foot-title">
          The scroll rewinds. The mountains remain.{" "}
          <span lang="zh" className="shan-foot__titlezh">
            卷可重展，山自長存。
          </span>
        </h2>
        <p className="shan-foot__line">
          Everything you saw was code: ridges summed from value noise, mist
          pooled in valleys and leaning toward your hand, weather cycling
          through the four seasons as you scrolled. Not one byte of it was a
          painting. The painting is the code.{" "}
          <span lang="zh" className="shan-foot__linezh">
            所見皆代碼 — 山脊為值噪聲之和，煙嵐聚於谷間而向汝手傾，四季隨卷展而流轉。
            無一像素為畫，畫即代碼本身。
          </span>
        </p>

        <a className="shan-foot__btn" href="#shan-top">
          <span className="shan-foot__btntext">
            rewind the scroll{" "}
            <span lang="zh" className="shan-foot__btnzh">
              重展此卷
            </span>
          </span>
        </a>

        <div className="shan-foot__grid">
          <p className="shan-foot__brand">
            山水 <span className="shan-foot__branden">SHAN-SHUI</span>
          </p>
          <p className="shan-foot__meta">
            an ink landscape, generated · est. from noise{" "}
            <span lang="zh">水墨生成 · 以噪為骨</span>
          </p>
        </div>

        <p className="shan-foot__koan">
          A mountain does not know it is being painted. We prefer it that way.{" "}
          <span lang="zh" className="shan-foot__koanzh">
            山不知其為畫。吾等樂其不知。
          </span>
        </p>

        <div className="shan-foot__base">
          <p className="shan-foot__copy">
            © 2026 SHAN-SHUI <span lang="zh">山水</span> — one scroll, drawn live{" "}
            <span lang="zh">一卷在手，水墨自成</span>
          </p>
        </div>

        <p className="shan-foot__dedication">
          In respectful conversation with{" "}
          <em>{`{Shan, Shui}*`}</em> by LingDong — the canonical procedural
          landscape. This entry aims to answer it for the live, scrollable,
          pointer-breathing web.
        </p>
      </div>
    </footer>
  );
}
