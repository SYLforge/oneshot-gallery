"use client";

import { useState } from "react";

type TrackStatus = "rendering" | "held" | "archived";

type Track = {
  id: string;
  cat: string;
  titleEn: string;
  titleKo: string;
  bpm: string;
  len: string;
  status: TrackStatus;
  statusEn: string;
  statusKo: string;
  noteEn: string;
  noteKo: string;
};

const TRACKS: Track[] = [
  {
    id: "t1",
    cat: "GLT-001",
    titleEn: "CARRIER LOST",
    titleKo: "반송파 상실",
    bpm: "138",
    len: "04:12",
    status: "rendering",
    statusEn: "RENDERING",
    statusKo: "렌더 중",
    noteEn:
      "the drop is a single corrupted I-frame looped for thirty-two bars. the mastering engineer cried; we kept it.",
    noteKo:
      "드롭은 손상된 I-프레임 하나를 32마디 동안 루프한 것이다. 마스터링 엔지니어가 울었다. 우리는 그대로 두었다.",
  },
  {
    id: "t2",
    cat: "GLT-002",
    titleEn: "BANDWIDTH PRAYER",
    titleKo: "대역폭의 기도",
    bpm: "94",
    len: "06:48",
    status: "held",
    statusEn: "HELD",
    statusKo: "보류",
    noteEn:
      "sample rate drifts 0.7% over the runtime. nobody notices unless they try to mix it. that is the point.",
    noteKo:
      "샘플레이트가 재생 시간 동안 0.7% 흘러간다. 믹스하려 하지 않으면 아무도 모른다. 그게 요점이다.",
  },
  {
    id: "t3",
    cat: "GLT-003",
    titleEn: "RGB DRIFT",
    titleKo: "RGB 드리프트",
    bpm: "160",
    len: "03:30",
    status: "rendering",
    statusEn: "RENDERING",
    statusKo: "렌더 중",
    noteEn:
      "three channels, three tempos, converging only at the outro. mastered to look like a misaligned print.",
    noteKo:
      "세 채널, 세 템포, 아웃트로에서만 만난다. 어긋난 인쇄물처럼 마스터링했다.",
  },
  {
    id: "t4",
    cat: "GLT-000",
    titleEn: "DEAD PIXEL HYMN",
    titleKo: "데드 픽셀 찬가",
    bpm: "—",
    len: "∞",
    status: "archived",
    statusEn: "ARCHIVED",
    statusKo: "보관",
    noteEn:
      "the first thing we ever rendered, on a monitor with a stuck green pixel. we built the studio around the pixel. it still glows.",
    noteKo:
      "우리가 처음 렌더한 것. 픽셀 하나가 녹색으로 고장 난 모니터 위에서. 스튜디어는 그 픽셀을 중심으로 지었다. 그 픽셀은 아직 빛난다.",
  },
];

/**
 * Section 04 — the release ledger. Each row is a real <button>
 * (keyboard-reachable, aria-expanded) that opens a one-line note. One row is
 * ARCHIVED (the origin myth). Without JS the notes are simply visible —
 * hiding is gated on `.gl-js`.
 */
export default function TrackList() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="gl-tracks" aria-labelledby="gl-tracks-title">
      <div className="gl-sechead" data-tear>
        <span className="gl-sechead__no" aria-hidden="true">
          04
        </span>
        <h2 className="gl-sechead__title" id="gl-tracks-title">
          the catalogue{" "}
          <span lang="ko" className="gl-sechead__ko">
            카탈로그
          </span>
        </h2>
      </div>

      <ul className="gl-tracks__list">
        {TRACKS.map((track) => {
          const expanded = open === track.id;
          return (
            <li
              key={track.id}
              data-tear
              className={`gl-track gl-track--${track.status}`}
            >
              <button
                type="button"
                className="gl-track__row"
                aria-expanded={expanded}
                aria-controls={`gl-track-note-${track.id}`}
                onClick={() => setOpen(expanded ? null : track.id)}
              >
                <span className="gl-track__cross" aria-hidden="true">
                  +
                </span>
                <span className="gl-track__cat">{track.cat}</span>
                <span className="gl-track__name">
                  {track.titleEn} ·{" "}
                  <span lang="ko">{track.titleKo}</span>
                </span>
                <span className="gl-track__bpm">{track.bpm} BPM</span>
                <span className="gl-track__len">{track.len}</span>
                <span className="gl-track__status">
                  {track.statusEn} — <span lang="ko">{track.statusKo}</span>
                </span>
              </button>
              <div
                id={`gl-track-note-${track.id}`}
                className={`gl-track__note ${expanded ? "is-open" : "is-closed"}`}
              >
                <p>{track.noteEn}</p>
                <p lang="ko">{track.noteKo}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
