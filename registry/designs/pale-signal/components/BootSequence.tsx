"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useTypewriter } from "../hooks/useTypewriter";

const BOOT_LINES = [
  "PALE.SIGNAL BIOS v3.7 — cold boot 21:58:04 KST",
  "phosphor driver ............... OK",
  "memory 640K ................... OK (as it always was)",
  "azimuth drive DISH-01 ......... locked",
  "azimuth drive DISH-02 ......... locked",
  "azimuth drive DISH-03 ......... retired — skipped, with respect",
  "calibrating against the hum of the moon ... done",
  "channel open. 하늘이 호출을 수락했다.",
] as const;

const FULL_LOG = BOOT_LINES.join("\n");

/**
 * Section 01 — the boot hero. Server-rendered (and no-JS) state is the
 * *completed* boot screen; once JS mounts, the terminal goes dark and boots
 * for real. Any key, tap, wheel, or scroll completes it instantly, and a
 * hard timeout guarantees it can never trap anyone.
 */
export default function BootSequence() {
  const reduced = usePrefersReducedMotion();
  const [play, setPlay] = useState(false);
  const { settled, typing, done, finish } = useTypewriter(BOOT_LINES, play);

  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }
    // A breath of black screen, then power on.
    const id = window.setTimeout(() => setPlay(true), 60);
    return () => window.clearTimeout(id);
  }, [reduced, finish]);

  const booting = play && !done;

  // Skip on any input. Never trap the user in a boot screen.
  useEffect(() => {
    if (!booting) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("scroll", skip, { passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("scroll", skip);
    };
  }, [booting, finish]);

  // Belt and suspenders: the boot always completes on its own.
  useEffect(() => {
    if (!booting) return;
    const t = window.setTimeout(finish, 7000);
    return () => window.clearTimeout(t);
  }, [booting, finish]);

  return (
    <header className="ps-hero" id="ps-boot">
      <div className="ps-hero__log" role="img" aria-label={FULL_LOG}>
        <pre aria-hidden="true" className="ps-hero__pre">
          {settled.join("\n")}
          {booting ? (
            <>
              {settled.length > 0 ? "\n" : ""}
              {typing}
              <span className="ps-cursor" />
            </>
          ) : null}
        </pre>
      </div>

      <div className={`ps-hero__id ${booting ? "is-waiting" : "is-on"}`}>
        <h1 className="ps-title" aria-label="PALE.SIGNAL">
          <span aria-hidden="true" className="ps-title__text">
            PALE.SIGNAL
          </span>
        </h1>
        <p className="ps-hero__sub">
          <span lang="ko">관측소</span> — listening post
          <span className="ps-cursor ps-cursor--idle" aria-hidden="true" />
        </p>
        <p className="ps-hero__meta">
          est. 1979 · decommissioned 2019 · still listening ·{" "}
          <span lang="ko">아직 듣고 있음</span>
        </p>
      </div>

      {booting ? (
        <p className="ps-hero__hint" aria-hidden="true">
          any key / tap — skip boot ·{" "}
          <span lang="ko">아무 키나 누르면 건너뜁니다</span>
        </p>
      ) : (
        <p className="ps-hero__hint" aria-hidden="true">
          ▼ scroll — <span lang="ko">오늘 밤의 기록으로</span>
        </p>
      )}
    </header>
  );
}
