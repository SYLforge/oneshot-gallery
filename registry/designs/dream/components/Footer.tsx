"use client";

/**
 * The deepest the page goes. A near-black indigo night, the closing line of
 * the brand, the fictional place, and a sign-off that promises only rest.
 * The dream haze lingers here at its lowest alpha, so the night is never
 * flat black — it is the soft dark behind closed eyelids.
 */
export default function Footer() {
  return (
    <footer className="dream-footer">
      <p className="dream-footer__call" data-reveal>
        COME REST{" "}
        <span aria-hidden="true" className="dream-footer__dot">
          ·
        </span>{" "}
        <span lang="ko">쉬러 오세요</span>
      </p>

      <div className="dream-footer__where" data-reveal>
        <p>
          <span lang="ko">제주 서귀포 · 느린구름 언덕 위</span>
          <span className="dream-footer__where-en">
            above the slow-cloud hill, Seogwipo, Jeju
          </span>
        </p>
        <p className="dream-footer__coords" aria-hidden="true">
          N 33.25° · E 126.56° · 312 m
        </p>
      </div>

      <p className="dream-footer__contact" data-reveal>
        <a className="dream-link" href="mailto:rest@dream.sky">
          rest@dream.sky
        </a>
        <a className="dream-link" href="#dream-hero">
          <span lang="ko">다시 하늘로</span> · back to the sky
        </a>
      </p>

      <p className="dream-footer__legal">
        © 2026 <span lang="ko">꿈</span> DREAM — the sky keeps your rest.{" "}
        <span lang="ko">하늘이 당신의 쉼을 간직합니다.</span>
      </p>
    </footer>
  );
}
