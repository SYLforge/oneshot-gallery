"use client";

import type { CSSProperties } from "react";
import { growCloud, type Cloud } from "./cloudShapes";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * The texture technique, made legible. A single cloud resting on the night
 * side of the page, with two feTurbulence fields layered on top of it:
 *  (a) a coarse sky-haze (the closing-eye veil) over the whole stage, and
 *  (b) a fine grain fractalNoise baked onto the puff itself, so the cloud
 *      reads as soft respiring vapor instead of a flat CSS blob.
 * Both filters are decorative-only and aria-hidden; the cloud carries a
 * bilingual role="img" description. Under reduced motion the filters hold
 * one composed still frame (no feOffset drift).
 */
const REST_CLOUD: Cloud = growCloud(2026, 7, 720, 300);

export default function NightField() {
  const reduced = usePrefersReducedMotion();
  // hook only to honor reduced motion as a documented signal; the visual
  // static-end-state is handled entirely in CSS (no JS writes here).
  void reduced;

  return (
    <section className="dream-night" aria-labelledby="dream-night-title">
      <div className="dream-sec" data-reveal>
        <span className="dream-sec__no" lang="ko" aria-hidden="true">
          셋
        </span>
        <h2 className="dream-sec__title" id="dream-night-title">
          the haze{" "}
          <span lang="ko" className="dream-sec__ko">
            안개
          </span>
        </h2>
      </div>

      <p className="dream-night__lede" data-reveal>
        <em>
          This is not a flat shape — it is vapor, held still long enough to read.
        </em>{" "}
        <span lang="ko">
          평면이 아닙니다 — 읽기에 충분할 만큼 멈춰 선, 수증기입니다.
        </span>
      </p>

      <div
        className="dream-night__stage"
        role="img"
        aria-label="A single soft cloud drifting on a deep indigo sky, layered with a fine grain texture. 짙은 남색 하늘 위를 흐르는 부드러운 구름 한 송이, 결이 있는 입자로 덮여 있다."
      >
        <svg
          className="dream-night__cloud"
          viewBox={REST_CLOUD.viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* (b) fine grain on the puff itself */}
            <filter id="dream-grain" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9 0.9"
                numOctaves={1}
                seed={3}
                result="grain"
              />
              <feColorMatrix
                in="grain"
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.18 0"
              />
              <feComposite
                operator="in"
                in2="SourceGraphic"
                result="masked"
              />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="masked" />
              </feMerge>
            </filter>
            {/* the soft radial fill of the puff */}
            <radialGradient id="dream-puff-fill" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor="#f4e4ff" />
              <stop offset="60%" stopColor="#c8b8e8" />
              <stop offset="100%" stopColor="#a78bd9" />
            </radialGradient>
          </defs>
          <path
            d={REST_CLOUD.d}
            fill="url(#dream-puff-fill)"
            filter="url(#dream-grain)"
          />
        </svg>

        {/* (a) coarse sky-haze over the whole stage */}
        <svg
          className="dream-night__haze"
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="dream-night-haze" x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.014 0.02"
                numOctaves={2}
                seed={11}
                result="n"
              />
              <feColorMatrix
                in="n"
                type="matrix"
                values="0 0 0 0 0.72  0 0 0 0 0.68  0 0 0 0 0.85  0 0 0 0.42 0"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#dream-night-haze)" />
        </svg>
      </div>

      <p className="dream-night__caption">
        Two SVG noise fields: the sky breathes, the cloud has a skin.{" "}
        <span lang="ko">
          두 겹의 SVG 노이즈 — 하늘은 호흡하고, 구름은 결을 가진다.
        </span>
      </p>
    </section>
  );
}
