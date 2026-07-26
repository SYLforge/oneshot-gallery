"use client";

import { useReveal } from "../hooks/useReveal";

/**
 * Section 04 — the venue. A brutalist CSS/SVG site map of the abandoned
 * printworks (no image payload): two rooms, the bar, the entrance, the fire
 * exit, drawn as labeled blocks on a black ground with the one blue accent
 * marking the door you walk through. Below it, the address / access ledger
 * in monospace. The whole section wipes in with a clip-path cut from the
 * bottom on enter.
 */
export default function VenueMap() {
  const headRef = useReveal<HTMLDivElement>();
  const mapRef = useReveal<HTMLDivElement>();

  return (
    <section
      className="rave-section rave-venue"
      aria-labelledby="rave-venue-title"
    >
      <div className="rave-reveal rave-reveal--br" ref={headRef}>
        <div className="rave-sechead">
          <span className="rave-sechead__no" aria-hidden="true">
            02
          </span>
          <h2 className="rave-sechead__title" id="rave-venue-title">
            THE VENUE <span lang="ko">장소</span>
          </h2>
          <p className="rave-sechead__note">
            OLD PRINTWORKS · ITAEWON <span lang="ko">이태원 옛 인쇄소</span>
          </p>
        </div>
      </div>

      <div className="rave-reveal rave-reveal--t" ref={mapRef}>
        <div className="rave-block rave-map" role="img" aria-labelledby="rave-map-label">
          <p id="rave-map-label" className="rave-vh">
            Site map of the venue. 메인 룸과 지하 룸이 붙어 있고, 입구(전기파랑)는
            좌측, 비상구는 우측, 바는 메인 룸 뒤편에 있다.
          </p>
          <div className="rave-map__stage">
            <span className="rave-map__cell rave-map__door">DOOR · 입구</span>
            <span className="rave-map__cell rave-map__main">
              <span className="rave-map__name">MAIN ROOM</span>
              <span className="rave-map__ko" lang="ko">메인</span>
            </span>
            <span className="rave-map__cell rave-map__bar">BAR · 바</span>
            <span className="rave-map__cell rave-map__base">
              <span className="rave-map__name">BASEMENT</span>
              <span className="rave-map__ko" lang="ko">지하</span>
            </span>
            <span className="rave-map__cell rave-map__exit">EXIT · 비상구</span>
          </div>
        </div>

        <dl className="rave-venue__ledger">
          <div className="rave-venue__row">
            <dt className="rave-venue__k">ADDRESS</dt>
            <dd className="rave-venue__v">
              이태원로 54, 옛 한성인쇄 2·3층 · HANSEONG PRINTWORKS, 54 ITAEWON-RO,
              2F/3F
            </dd>
          </div>
          <div className="rave-venue__row">
            <dt className="rave-venue__k">METRO</dt>
            <dd className="rave-venue__v">
              이태원역 3번 출구 · 도보 4분 · ITAEWON STN EXIT 3, 4 MIN WALK
            </dd>
          </div>
          <div className="rave-venue__row">
            <dt className="rave-venue__k">ACCESS</dt>
            <dd className="rave-venue__v">
              지하 룸 계단 있음 · 엘리베이터 없음. STEP-FREE ACCESS TO MAIN FLOOR
              ONLY.
            </dd>
          </div>
          <div className="rave-venue__row">
            <dt className="rave-venue__k">LAST CALL</dt>
            <dd className="rave-venue__v">
              05:30 · 맥주는 새벽 5시 반까지. NO RE-ENTRY AFTER 03:00.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
