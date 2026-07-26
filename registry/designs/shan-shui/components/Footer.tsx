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
          04 — 발 · 跋 · colophon
        </p>
        <h2 className="shan-foot__title" id="shan-foot-title">
          <span lang="ko">두루마리는 감기고, 산은 남는다.</span>{" "}
          The scroll rewinds. The mountains remain.{" "}
          <span lang="zh" className="shan-foot__titlezh">
            卷可重展，山自長存。
          </span>
        </h2>
        <p className="shan-foot__line">
          <span lang="ko">
            당신이 본 모든 것은 코드였다 — 산등성이는 값-노이즈의 합이고, 안개는
            골짜기에 모이면서도 당신의 손으로 기울고, 날씨는 스크롤을 따라 사계절을
            흘렀다. 한 픽셀도 그림이 아니다. 그림은 코드 자체다.
          </span>{" "}
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
            <span lang="ko">두루마리 감기</span> rewind the scroll{" "}
            <span lang="zh" className="shan-foot__btnzh">
              重展此卷
            </span>
          </span>
        </a>

        <div className="shan-foot__grid">
          <p className="shan-foot__brand">
            <span lang="ko">산수</span> <span lang="zh">山水</span>{" "}
            <span className="shan-foot__branden">SHAN-SHUI</span>
          </p>
          <p className="shan-foot__meta">
            <span lang="ko">생성된 수묵 풍경 · 노이즈에서 비롯되다</span>{" "}
            an ink landscape, generated · est. from noise{" "}
            <span lang="zh">水墨生成 · 以噪為骨</span>
          </p>
        </div>

        <p className="shan-foot__koan">
          <span lang="ko">산은 자기가 그려지고 있다는 것을 모른다. 우리는 그렇게 있는 편이 좋다.</span>{" "}
          A mountain does not know it is being painted. We prefer it that way.{" "}
          <span lang="zh" className="shan-foot__koanzh">
            山不知其為畫。吾等樂其不知。
          </span>
        </p>

        <div className="shan-foot__base">
          <p className="shan-foot__copy">
            © 2026 SHAN-SHUI <span lang="ko">산수</span> <span lang="zh">山水</span> —{" "}
            <span lang="ko">한 축, 실시간으로 그리다</span> one scroll, drawn live{" "}
            <span lang="zh">一卷在手，水墨自成</span>
          </p>
        </div>

        <p className="shan-foot__dedication">
          <span lang="ko">
            <em>{`{Shan, Shui}*`}</em> by LingDong — 절차적 산수화의 정석 — 에 대한
            경의 어린 대화. 이 엔트리는 살아 있고 스크롤되며 손길에 반응하는 웹을
            위해 그것에 답하려 한다.
          </span>{" "}
          In respectful conversation with{" "}
          <em>{`{Shan, Shui}*`}</em> by LingDong — the canonical procedural
          landscape. This entry aims to answer it for the live, scrollable,
          pointer-breathing web.
        </p>
      </div>
    </footer>
  );
}
