"use client";

import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

type Slot = {
  time: string;
  act: string;
  actKo?: string;
  room: string;
};

/** Two-room schedule, one night. The tab toggles which room reads first. */
const ROOM_A = "MAIN ROOM";
const ROOM_B = "BASEMENT";

const SCHEDULE: Slot[] = [
  { time: "22:00", act: "반짝임", room: ROOM_B },
  { time: "23:00", act: "DEEP CUT", actKo: "딥컷", room: ROOM_A },
  { time: "00:30", act: "RAINBOW CHAN", room: ROOM_A },
  { time: "01:00", act: "BAY BAY", room: ROOM_B },
  { time: "02:00", act: "SOPHIE.XYZ", room: ROOM_A },
  { time: "02:30", act: "새벽세시", room: ROOM_B },
  { time: "03:30", act: "NULL SECTOR", room: ROOM_A },
  { time: "04:00", act: "VARG2™", room: ROOM_B },
  { time: "05:00", act: "KORELESS", room: ROOM_A },
  { time: "06:00", act: "LIGHTS UP", actKo: "종료", room: ROOM_A },
];

type Tier = {
  name: string;
  price: string;
  perk: string;
  perkKo: string;
  soldout?: boolean;
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "EARLY",
    price: "₩25,000",
    perk: "FIRST 200 · NO QUEUE",
    perkKo: "선착 200명 · 대기열 없음",
    soldout: true,
  },
  {
    name: "GENERAL",
    price: "₩40,000",
    perk: "FULL NIGHT · BOTH ROOMS",
    perkKo: "종일 · 두 룸",
    highlight: true,
  },
  {
    name: "PATRON",
    price: "₩90,000",
    perk: "BAR TAB + COAT CHECK",
    perkKo: "주류 + 코트 수하물",
  },
];

/**
 * Section 03 — the schedule + ticket ledger. The room toggle swaps the
 * schedule order with a 160ms opacity/translate cross-fade (linear, no
 * easing — same anti-easing doctrine as the press). Each ticket panel
 * wipes in with a direction-aware clip-path cut on enter (the
 * `clip-path-reveal` technique): left tier wipes from the left, the
 * highlighted middle from the top, the right tier from the right. The cuts
 * are 620ms `steps(8, end)` — a hard geometric wipe, never a soft fade.
 */
export default function TicketBlock() {
  const [room, setRoom] = useState<string>(ROOM_A);
  const headRef = useReveal<HTMLDivElement>();
  const t0 = useReveal<HTMLLIElement>();
  const t1 = useReveal<HTMLLIElement>();
  const t2 = useReveal<HTMLLIElement>();
  const refs = [t0, t1, t2];

  const ordered =
    room === ROOM_A
      ? [...SCHEDULE].sort(
          (a, b) =>
            (a.room === ROOM_A ? -1 : 1) - (b.room === ROOM_A ? -1 : 1) ||
            a.time.localeCompare(b.time),
        )
      : [...SCHEDULE].sort(
          (a, b) =>
            (a.room === ROOM_B ? -1 : 1) - (b.room === ROOM_B ? -1 : 1) ||
            a.time.localeCompare(b.time),
        );

  return (
    <section
      className="rave-section rave-tickets"
      id="rave-tickets"
      aria-labelledby="rave-tickets-title"
    >
      <div className="rave-reveal rave-reveal--br" ref={headRef}>
        <div className="rave-sechead">
          <span className="rave-sechead__no" aria-hidden="true">
            01
          </span>
          <h2 className="rave-sechead__title" id="rave-tickets-title">
            THE NIGHT <span lang="ko">이 밤</span>
          </h2>
          <p className="rave-sechead__note">
            DOORS 22:00 · LIGHTS 06:00 <span lang="ko">밤 10시부터 새벽 6시</span>
          </p>
        </div>
      </div>

      <div className="rave-tickets__grid">
        <div className="rave-schedule rave-block">
          <div
            className="rave-tabs"
            role="tablist"
            aria-label="Schedule room toggle · 룸 전환"
          >
            <button
              type="button"
              role="tab"
              aria-selected={room === ROOM_A}
              className={`rave-tab${room === ROOM_A ? " is-on" : ""}`}
              onClick={() => setRoom(ROOM_A)}
            >
              {ROOM_A} <span lang="ko">메인</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={room === ROOM_B}
              className={`rave-tab${room === ROOM_B ? " is-on" : ""}`}
              onClick={() => setRoom(ROOM_B)}
            >
              {ROOM_B} <span lang="ko">지하</span>
            </button>
          </div>

          <ul
            className="rave-schedule__list"
            key={room}
            aria-label={`${room} schedule · 타임테이블`}
          >
            {ordered.map((s) => (
              <li key={`${s.time}-${s.act}`} className="rave-schedule__row">
                <span className="rave-schedule__time">{s.time}</span>
                <span className="rave-schedule__act">
                  {s.act}
                  {s.actKo ? (
                    <span className="rave-schedule__actko" lang="ko">
                      {" "}
                      {s.actKo}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`rave-schedule__room${
                    s.room === ROOM_A ? " is-a" : " is-b"
                  }`}
                >
                  {s.room === ROOM_A ? "A" : "B"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="rave-tiers">
          {TIERS.map((tier, i) => (
            <li
              key={tier.name}
              ref={refs[i]}
              className={`rave-reveal rave-reveal--${["l", "t", "r"][i]} rave-tier${
                tier.highlight ? " rave-tier--hl" : ""
              }${tier.soldout ? " rave-tier--dead" : ""}`}
            >
              <div className="rave-tier__body">
                <p className="rave-tier__name">{tier.name}</p>
                <p className="rave-tier__price">{tier.price}</p>
                <p className="rave-tier__perk">
                  {tier.perk} <span lang="ko">{tier.perkKo}</span>
                </p>
                {tier.soldout ? (
                  <p className="rave-tier__dead">
                    SOLD OUT <span lang="ko">매진</span>
                  </p>
                ) : (
                  <a
                    className="rave-btn rave-press rave-tier__cta"
                    href="#rave-tickets"
                  >
                    RESERVE <span lang="ko">예약</span> →
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="rave-tickets__fine">
        ALL AGES · NO REFUND ONCE DOORS OPEN · BRING ID.{" "}
        <span lang="ko">전 연령 · 문 열린 뒤 환불 불가 · 신분증 지참.</span>
      </p>
    </section>
  );
}
