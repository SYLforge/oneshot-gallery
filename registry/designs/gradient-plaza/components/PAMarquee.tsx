"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Ticker speed in px/second: resting drift, and what full rush adds. */
const BASE_PX_S = 42;
const RUSH_PX_S = 300;

const LINES = [
  {
    en: "Attention shoppers: the escalators run all night, for no one.",
    ko: "안내 말씀드립니다 — 에스컬레이터는 밤새 운행합니다, 아무도 없이.",
  },
  {
    en: "The fountain accepts wishes until 4 AM. Exact change only.",
    ko: "분수는 새벽 4시까지 소원을 받습니다. 동전은 정확히 준비해 주세요.",
  },
  {
    en: "Please do not feed the mannequins.",
    ko: "마네킹에게 먹이를 주지 마세요.",
  },
  {
    en: "Lost and found is now found and lost.",
    ko: "분실물 센터는 이제 스스로를 분실했습니다.",
  },
  {
    en: "Weather inside the mall: fluorescent, with rain expected in the food court.",
    ko: "몰 내부 날씨 — 형광등 맑음, 푸드코트에는 비 소식.",
  },
] as const;

type Props = {
  reduced: boolean;
  /** Live scroll energy 0→1 — the PA reads faster when you run. */
  energyRef: RefObject<number>;
};

/**
 * The PA ticker: one JS-driven marquee whose speed is coupled to scroll
 * energy — stroll and the announcements drift by; rush and the PA hurries
 * after you. The moving track is aria-hidden and duplicated once for a
 * seamless wrap; screen readers get the announcements exactly once from a
 * visually-hidden list. Without JavaScript (or with reduced motion) the
 * strip is simply a static line of announcements.
 */
export default function PAMarquee({ reduced, energyRef }: Props) {
  const clipRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const clip = clipRef.current;
    const track = trackRef.current;
    if (!clip || !track) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let x = 0;
    let runW = 0;
    let last = 0;

    const measure = () => {
      runW = track.scrollWidth / 2; // two identical runs
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 64);
      last = now;
      x -= (dt / 1000) * (BASE_PX_S + energyRef.current * RUSH_PX_S);
      if (runW > 0 && -x >= runW) x += runW;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };

    const sync = () => {
      const should = visible && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onVisibility = () => sync();

    const io = new IntersectionObserver((hits) => {
      visible = hits[hits.length - 1].isIntersecting;
      sync();
    });
    io.observe(clip);

    // The track is sized by its content (width: max-content), so this also
    // fires when the webfonts land and the runs get wider.
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    document.addEventListener("visibilitychange", onVisibility);
    measure();
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      track.style.transform = "";
    };
  }, [reduced, energyRef]);

  return (
    <div className="plaza-ticker">
      <ul className="plaza-sr">
        {LINES.map((line) => (
          <li key={line.en}>
            {line.en} <span lang="ko">{line.ko}</span>
          </li>
        ))}
      </ul>
      <div ref={clipRef} className="plaza-ticker__clip" aria-hidden="true">
        <div ref={trackRef} className="plaza-ticker__track">
          {[0, 1].map((copy) => (
            <div key={copy} className="plaza-ticker__run">
              {LINES.map((line) => (
                <span key={line.en} className="plaza-ticker__item">
                  <span className="plaza-ticker__mark">✦</span>
                  {line.en} <span lang="ko">{line.ko}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
