"use client";

/**
 * Chapter 06 — the colophon. Hours, the address, the phone, a sign-off koan,
 * the brand line, copyright, and a "back to top" link. Plain semantic HTML,
 * fully readable with JS off (the links are real anchors). The koan is the
 * page's parting line, written-in-Korean first, then re-felt in English —
 * never word-for-word.
 */
export default function NightFooter() {
  return (
    <footer
      className="ns-foot"
      aria-labelledby="ns-foot-title"
      data-reveal="panel"
    >
      <div className="ns-foot__inner">
        <h2 id="ns-foot-title" className="ns-sr">
          <span lang="ko">영업 정보</span> Hours &amp; address
        </h2>

        <div className="ns-foot__grid">
          <div>
            <p className="ns-foot__cellk">
              <span lang="ko">영업 시간</span>
              <span className="ns-mono">· HOURS</span>
            </p>
            <p className="ns-foot__cellv">
              <span lang="ko">밤 9시 — 새벽 4시</span>
              <span className="ns-foot__cellen">21:00 — 04:00</span>
            </p>
            <p className="ns-foot__celln">
              <span lang="ko">월요일 휴무 · 비 오는 날은 더 늦게까지.</span>
            </p>
            <p className="ns-foot__celln-en">
              Closed Mondays. When it rains, we stay open later.
            </p>
          </div>

          <div>
            <p className="ns-foot__cellk">
              <span lang="ko">자리</span>
              <span className="ns-mono">· WHERE</span>
            </p>
            <p className="ns-foot__cellv">
              <span lang="ko">서울 종로구 종로 12길, 뒷골목 첫 번째 텐트</span>
              <span className="ns-foot__cellen">JONGNO 12-GIL, ALLEY · SEOUL</span>
            </p>
            <p className="ns-foot__celln">
              <span lang="ko">편의점 불빛이 보이는 곳에서 두 걸음.</span>
            </p>
            <p className="ns-foot__celln-en">
              Two steps from where you can see the convenience-store light.
            </p>
          </div>

          <div>
            <p className="ns-foot__cellk">
              <span lang="ko">주문 · 자리</span>
              <span className="ns-mono">· ORDER</span>
            </p>
            <p className="ns-foot__cellv">
              <span lang="ko">텐트 앞에서 자리 잡고, 사장님께.</span>
              <span className="ns-foot__cellen">WALK-UP ONLY</span>
            </p>
            <p className="ns-foot__celln">
              <span lang="ko">전화 02-1234-5678 · 예약 없습니다.</span>
            </p>
            <p className="ns-foot__celln-en">
              Tel 02-1234-5678 · No reservations, ever.
            </p>
          </div>
        </div>

        <p className="ns-foot__koan">
          <span lang="ko">
            배고픈 사람이 모이면, 새벽은 금방 온다.
          </span>
          <span className="ns-foot__koan-en">
            Gather the hungry, and dawn comes faster than you think.
          </span>
        </p>

        <div className="ns-foot__base">
          <p className="ns-foot__brand">
            <span lang="ko">야식!</span>
            <span className="ns-foot__branden">NIGHT-SNACK · EST. 2019</span>
          </p>
          <p className="ns-foot__copy">
            <span lang="ko">© 2026 야식 · 새벽 포장마차</span>
            <span> · ONESHOT GALLERY ENTRY</span>
          </p>
          <a className="ns-foot__top" href="#ns-top">
            <span lang="ko">처음으로</span>
            <span className="ns-mono">↑ BACK TO TOP</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
