"use client";

import { useState } from "react";

/**
 * Section 03 — the artist's chop. A vermillion seal (印, the stamp; 心 the
 * heart-mind within) that presses when activated — the one interactive
 * flourish, and the one place the warm accent is allowed to be loud.
 *
 * Pressing it stamps the seal: a fresh ink impression blooms over the xuan
 * (scale + opacity, the seal-press motion from tokens.json), then settles.
 * A live count of "impressions" is announced — a gentle gamification of the
 * literati habit of marking a finished painting. Fully keyboard-reachable
 * (it's a real button) and touch-friendly (no hover dependency).
 */
export default function SealStamp() {
  const [count, setCount] = useState(0);
  const [pressed, setPressed] = useState(false);

  const press = () => {
    setPressed(true);
    setCount((c) => c + 1);
    // the seal lifts after the impression lands
    window.setTimeout(() => setPressed(false), 900);
  };

  return (
    <section className="shan-seal" aria-labelledby="shan-seal-title">
      <div className="shan-seal__inner" data-reveal="">
        <p className="shan-eyebrow" aria-hidden="true">
          03 — 落款 · the chop
        </p>
        <h2 className="shan-seal__title" id="shan-seal-title">
          A painting is not finished until it is signed.{" "}
          <span lang="zh" className="shan-seal__titlezh">
            畫成而後落印
          </span>
        </h2>
        <p className="shan-seal__line">
          The vermillion chop is the painter entering the painting. Press it —
          leave your mark on the scroll. The seal reads{" "}
          <span lang="zh">心</span>, the heart-mind: the one character a
          literati painter most wanted on the paper.{" "}
          <span lang="zh" className="shan-seal__linezh">
            朱印一方，畫家入畫。鈐之 — 留汝之痕於卷上。印文曰「心」，文人畫家最欲落於紙上之一字。
          </span>
        </p>

        <div className="shan-seal__stage">
          {/* the paper the seal stamps onto */}
          <div className="shan-seal__paper" aria-hidden="true">
            {/* the impression left behind */}
            <svg
              className={`shan-seal__impression ${count > 0 ? "is-stamped" : ""}`}
              viewBox="0 0 96 96"
              aria-hidden="true"
              focusable="false"
              key={count}
            >
              <rect x="6" y="6" width="84" height="84" rx="3" fill="#a83232" />
              <rect
                x="12"
                y="12"
                width="72"
                height="72"
                rx="1.5"
                fill="none"
                stroke="#f4ede0"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <text
                className="shan-sealglyph"
                x="48"
                y="65"
                textAnchor="middle"
                fontSize="44"
                fill="#f4ede0"
              >
                心
              </text>
            </svg>
          </div>

          {/* the floating chop, pressed on click */}
          <button
            type="button"
            className={`shan-seal__btn ${pressed ? "is-pressing" : ""}`}
            onClick={press}
            aria-label={`Press the seal. Impressions so far: ${count}. 印章按下。已鈐印 ${count} 次。`}
          >
            <span className="shan-seal__btnface" aria-hidden="true">
              <svg viewBox="0 0 72 72" width={56} height={56} focusable="false">
                <rect x="5" y="5" width="62" height="62" rx="3" fill="#8a2626" />
                <text
                  className="shan-sealglyph"
                  x="36"
                  y="49"
                  textAnchor="middle"
                  fontSize="38"
                  fill="#f4ede0"
                >
                  心
                </text>
              </svg>
            </span>
            <span className="shan-seal__btnlabel">
              press to stamp{" "}
              <span lang="zh" className="shan-seal__btnlabelzh">
                鈐印
              </span>
            </span>
          </button>
        </div>

        <p className="shan-seal__count" aria-live="polite">
          {count === 0 ? (
            <>
              no impressions yet{" "}
              <span lang="zh">尚未鈐印</span>
            </>
          ) : (
            <>
              {count} impression{count === 1 ? "" : "s"} on the scroll{" "}
              <span lang="zh">卷上已鈐 {count} 印</span>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
