"use client";

import { useRef } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";

type Track = {
  no: string;
  titleEn: string;
  titleKo: string;
  runtime: string;
  bpm: string;
  blurbEn: string;
  blurbKo: string;
  /** This track's accent role, lifted from tokens.json. */
  accent: string;
};

const TRACKS: Track[] = [
  {
    no: "01",
    titleEn: "First Light",
    titleKo: "첫 빛",
    runtime: "03:42",
    bpm: "120",
    blurbEn: "The field ignites — a slow core swelling into the first beat.",
    blurbKo: "장이 점화된다 — 느린 핵이 첫 비트로 부풀어 오른다.",
    accent: "var(--pulse-violet)",
  },
  {
    no: "02",
    titleEn: "Ember Drift",
    titleKo: "잔불의 흐름",
    runtime: "04:18",
    bpm: "120",
    blurbEn: "Warm particles shear across the rim, the kick turning over.",
    blurbKo: "따뜻한 입자가 가장자리를 가로지르고, 킥이 뒤집힌다.",
    accent: "var(--pulse-ember)",
  },
  {
    no: "03",
    titleEn: "Hold",
    titleKo: "버팀",
    runtime: "05:02",
    bpm: "120",
    blurbEn: "The beat holds its breath; the nebula dims to a single pulse.",
    blurbKo: "비트가 숨을 참고, 성운은 하나의 맥동으로 어두워진다.",
    accent: "var(--pulse-magenta)",
  },
  {
    no: "04",
    titleEn: "Afterglow",
    titleKo: "여운",
    runtime: "04:46",
    bpm: "120",
    blurbEn: "Cool mist settles, the field cooling from ember to aqua.",
    blurbKo: "차가운 안개가 내려앉고, 장이 잔불에서 아쿠아로 식는다.",
    accent: "var(--pulse-aqua)",
  },
];

type Props = {
  /** The page shares this ref so the hero's nebula reads the same track value. */
  trackRef: React.MutableRefObject<{ raw: number; smooth: number }>;
};

/**
 * Section 02 — the tracklist, pinned and scrubbed. As you scroll through the
 * 280vh pin, `--pulse-track` sweeps 0→1 and the nebula's palette/intensity
 * shifts across the four tracks. The tracklist itself is a fixed-height band
 * inside the sticky inner: each row emphasizes as it crosses the active band
 * (driven by --pulse-track), its index numeral brightening to its accent.
 *
 * Under reduced motion the lerp in useScrollProgress is bypassed, so the
 * emphasis tracks the wheel 1:1 — still fully usable, just unsmoothed.
 *
 * The four tracks tile the 0→1 progress into four segments; the active track
 * index is `floor(track · 4)`, clamped. The CSS reads --pulse-track directly
 * to drive per-row emphasis, so this component is mostly static markup.
 */
export default function Tracklist({ trackRef }: Props) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  useScrollProgress(pinRef, "--pulse-track", (raw, smooth) => {
    trackRef.current.raw = raw;
    trackRef.current.smooth = smooth;
  });

  return (
    <section
      className="pulse-tracklist"
      aria-labelledby="pulse-tracklist-title"
      ref={pinRef}
    >
      <div className="pulse-tracklist__sticky">
        <div className="pulse-tracklist__head" data-reveal>
          <p className="pulse-section__no" aria-hidden="true">
            02 · TRACKLIST
          </p>
          <h2 className="pulse-section__title" id="pulse-tracklist-title">
            Four movements{" "}
            <span lang="ko" className="pulse-section__ko">
              네 개의 악장
            </span>
          </h2>
          <p className="pulse-section__meta">
            SCROLL TO ADVANCE · <span lang="ko">스크롤하면 곡이 넘어간다</span>
          </p>
        </div>

        <ol className="pulse-tracklist__rows" role="list">
          {TRACKS.map((t, i) => (
            <li
              key={t.no}
              className="pulse-track"
              data-track-index={i}
              style={
                { "--pulse-track-accent": t.accent } as React.CSSProperties
              }
            >
              <span className="pulse-track__no" aria-hidden="true">
                {t.no}
              </span>
              <div className="pulse-track__body">
                <h3 className="pulse-track__title">
                  <span className="pulse-track__title-en">{t.titleEn}</span>
                  <span lang="ko" className="pulse-track__title-ko">
                    {t.titleKo}
                  </span>
                </h3>
                <p className="pulse-track__blurb">
                  {t.blurbEn}
                  <span lang="ko" className="pulse-track__blurb-ko">
                    {t.blurbKo}
                  </span>
                </p>
              </div>
              <dl className="pulse-track__meta">
                <div>
                  <dt>BPM</dt>
                  <dd>{t.bpm}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{t.runtime}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        {/* The beat readout — a sequencer instrument voice */}
        <p className="pulse-tracklist__readout" aria-hidden="true">
          <span className="pulse-tracklist__readout-bpm">120</span>
          <span className="pulse-tracklist__readout-unit">BPM</span>
          <span lang="ko" className="pulse-tracklist__readout-ko">
            · 분당 박자
          </span>
        </p>
      </div>
    </section>
  );
}
