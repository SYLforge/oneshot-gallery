"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useDrag } from "../hooks/useDrag";

type WindowId = "now" | "list" | "viz";

const WINDOW_META: Record<WindowId, { title: string; ko: string }> = {
  now: { title: "NOWPLAYING.EXE", ko: "지금 나오는 곡" },
  list: { title: "TRACKLIST.TXT", ko: "선곡표" },
  viz: { title: "VISUALIZER.EXE", ko: "비주얼라이저" },
};

const TRACKS = [
  {
    title: "Escalator to Nowhere",
    ko: "어디로도 가지 않는 에스컬레이터",
    artist: "Plaza Muzak Ensemble",
    artistKo: "플라자 무자크 앙상블",
    len: "4:52",
  },
  {
    title: "Fountain Coins (Wet Mix)",
    ko: "분수 동전 (웻 믹스)",
    artist: "Miss Foodcourt",
    artistKo: "미스 푸드코트",
    len: "3:33",
  },
  {
    title: "Anchor Store Heart",
    ko: "폐점한 백화점의 심장",
    artist: "New Sincerity Dept.",
    artistKo: "신성실 백화점부",
    len: "6:07",
  },
  {
    title: "B3 Slow Dance",
    ko: "지하 3층 슬로 댄스",
    artist: "The Escalators",
    artistKo: "디 에스컬레이터스",
    len: "5:19",
  },
  {
    title: "Last Bus Home",
    ko: "막차",
    artist: "Plaza Muzak Ensemble",
    artistKo: "플라자 무자크 앙상블",
    len: "4:04",
  },
] as const;

/**
 * Section 02 — the booth: three retro-OS windows over a tiled stage.
 * Drag them by the title bar (pointer or touch; release keeps a little
 * momentum), move the focused title bar with arrow keys (Shift = fine,
 * Home = respawn), click anywhere on a window to raise it. Minimize and
 * close are real buttons; closed windows come back from the taskbar.
 * Without JavaScript the windows simply stack in the document flow with
 * every track and label readable — dragging is enhancement, not content.
 */
export default function RadioWindows({ reduced }: { reduced: boolean }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stack, setStack] = useState<WindowId[]>(["viz", "list", "now"]);
  const [open, setOpen] = useState<Record<WindowId, boolean>>({
    now: true,
    list: true,
    viz: true,
  });
  const [track, setTrack] = useState(0);

  const raise = (id: WindowId) =>
    setStack((s) =>
      s[s.length - 1] === id ? s : [...s.filter((w) => w !== id), id],
    );

  const close = (id: WindowId) => setOpen((o) => ({ ...o, [id]: false }));

  const toggle = (id: WindowId) => {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
    raise(id);
  };

  const current = TRACKS[track];
  const prevTrack = () => setTrack((i) => (i + TRACKS.length - 1) % TRACKS.length);
  const nextTrack = () => setTrack((i) => (i + 1) % TRACKS.length);

  return (
    <section className="plaza-section plaza-booth" aria-labelledby="plaza-booth-title">
      <div className="plaza-sechead">
        <p className="plaza-sechead__no" aria-hidden="true">
          02
        </p>
        <h2
          id="plaza-booth-title"
          className="plaza-sechead__title plaza-ab"
          data-text="THE BOOTH"
        >
          THE BOOTH{" "}
          <span lang="ko" className="plaza-sechead__ko">
            방송 부스
          </span>
        </h2>
        <p className="plaza-sechead__meta">
          drag the windows · focus a title bar and steer with arrow keys ·{" "}
          <span lang="ko">창을 드래그하세요 · 타이틀 바에 포커스 후 화살표 키로 이동</span>
        </p>
      </div>

      <div ref={stageRef} className="plaza-stage">
        <PlazaWindow
          id="now"
          z={stack.indexOf("now")}
          open={open.now}
          stageRef={stageRef}
          reduced={reduced}
          onRaise={raise}
          onClose={close}
        >
          <p className="plaza-now__label">
            NOW PLAYING · <span lang="ko">지금 나오는 곡</span>
          </p>
          <p className="plaza-now__track">{current.title}</p>
          <p className="plaza-now__trackko" lang="ko">
            {current.ko}
          </p>
          <p className="plaza-now__artist">
            {current.artist} · <span lang="ko">{current.artistKo}</span>
          </p>
          <div className="plaza-now__progress" aria-hidden="true">
            <span className="plaza-now__fill" />
          </div>
          <p className="plaza-now__time">
            02:14 / {current.len} — looping until dawn ·{" "}
            <span lang="ko">동틀 때까지 반복</span>
          </p>
          <div className="plaza-now__controls">
            <button
              type="button"
              className="plaza-btn"
              onClick={prevTrack}
              aria-label="Previous track / 이전 곡"
            >
              ⟨⟨ PREV
            </button>
            <button
              type="button"
              className="plaza-btn"
              onClick={nextTrack}
              aria-label="Next track / 다음 곡"
            >
              NEXT ⟩⟩
            </button>
          </div>
        </PlazaWindow>

        <PlazaWindow
          id="list"
          z={stack.indexOf("list")}
          open={open.list}
          stageRef={stageRef}
          reduced={reduced}
          onRaise={raise}
          onClose={close}
        >
          <ul className="plaza-list">
            {TRACKS.map((t, i) => (
              <li key={t.title}>
                <button
                  type="button"
                  className="plaza-list__item"
                  aria-current={i === track ? "true" : undefined}
                  onClick={() => setTrack(i)}
                >
                  <span className="plaza-list__no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="plaza-list__name">
                    {t.title}
                    <span lang="ko" className="plaza-list__ko">
                      {t.ko}
                    </span>
                  </span>
                  <span className="plaza-list__len">{t.len}</span>
                </button>
              </li>
            ))}
          </ul>
        </PlazaWindow>

        <PlazaWindow
          id="viz"
          z={stack.indexOf("viz")}
          open={open.viz}
          stageRef={stageRef}
          reduced={reduced}
          onRaise={raise}
          onClose={close}
        >
          <Visualizer reduced={reduced} seed={track * 1.7} />
          <p className="plaza-viz__note">
            signal is decorative — the mall hears it anyway ·{" "}
            <span lang="ko">신호는 장식입니다 — 그래도 몰은 듣고 있어요</span>
          </p>
        </PlazaWindow>
      </div>

      <div className="plaza-taskbar">
        <p className="plaza-taskbar__clock" aria-hidden="true">
          AM 3:33
        </p>
        {(Object.keys(WINDOW_META) as WindowId[]).map((id) => (
          <button
            key={id}
            type="button"
            className="plaza-taskbar__btn"
            aria-pressed={open[id]}
            onClick={() => toggle(id)}
          >
            {WINDOW_META[id].title}
          </button>
        ))}
        <p className="plaza-taskbar__hint">
          closed windows live here · <span lang="ko">닫은 창은 여기 있어요</span>
        </p>
      </div>
    </section>
  );
}

type WindowProps = {
  id: WindowId;
  /** Position in the raise stack; the last-raised window sits on top. */
  z: number;
  open: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  reduced: boolean;
  onRaise: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  children: ReactNode;
};

function PlazaWindow({
  id,
  z,
  open,
  stageRef,
  reduced,
  onRaise,
  onClose,
  children,
}: WindowProps) {
  const winRef = useRef<HTMLElement | null>(null);
  const [minimized, setMinimized] = useState(false);
  const drag = useDrag({
    windowRef: winRef,
    stageRef,
    reduced,
    onActivate: () => onRaise(id),
  });
  const meta = WINDOW_META[id];

  return (
    <section
      ref={winRef}
      className={`plaza-window plaza-window--${id}`}
      style={{ zIndex: 10 + z }}
      hidden={!open}
      aria-label={`${meta.title} — ${meta.ko}`}
      onPointerDown={() => onRaise(id)}
    >
      <div className="plaza-window__bar">
        <button
          type="button"
          className="plaza-window__grip"
          aria-label={`Move ${meta.title} — arrow keys, Shift for small steps, Home to reset / ${meta.ko} 창 이동 — 화살표 키, Shift는 미세 이동, Home은 제자리`}
          {...drag}
        >
          <span className="plaza-window__dots" aria-hidden="true">
            ⣿⣿
          </span>
          <span className="plaza-window__name">{meta.title}</span>
        </button>
        <button
          type="button"
          className="plaza-window__sys"
          aria-expanded={!minimized}
          aria-label={`Minimize ${meta.title} / ${meta.ko} 접기`}
          onClick={() => setMinimized((m) => !m)}
        >
          <span aria-hidden="true">▁</span>
        </button>
        <button
          type="button"
          className="plaza-window__sys"
          aria-label={`Close ${meta.title} / ${meta.ko} 닫기`}
          onClick={() => onClose(id)}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
      <div className="plaza-window__body" hidden={minimized}>
        {children}
      </div>
    </section>
  );
}

/**
 * A fake spectrum: 27 bars whose amplitudes are sums of two incommensurate
 * sines (seeded per track, so changing the song changes the dance). Two
 * fillStyle changes per frame — all mint bars, then all pink caps. The rAF
 * loop pauses offscreen, when minimized (display:none is "not
 * intersecting"), and when the tab hides; reduced motion draws one frame.
 */
function Visualizer({ reduced, seed }: { reduced: boolean; seed: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let last = 0;
    let time = 9_000;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const n = 27;
      const gap = 3;
      const bw = Math.max(2, (w - gap * (n - 1)) / n);
      const tops: number[] = [];
      ctx.fillStyle = "#05ffa1";
      for (let i = 0; i < n; i++) {
        const a =
          0.16 +
          0.46 * Math.abs(Math.sin(i * 0.37 + seed + t * 0.0021)) +
          0.3 * Math.abs(Math.sin(i * 0.91 - t * 0.0012 + seed * 2.3));
        const bh = Math.max(2, a * (h - 12));
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
        tops.push(bh);
      }
      ctx.fillStyle = "#ff71ce";
      for (let i = 0; i < n; i++) {
        ctx.fillRect(i * (bw + gap), h - tops[i] - 5, bw, 3);
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - last, 64);
      last = now;
      time += dt;
      draw(time);
    };

    const sync = () => {
      const should = !reduced && visible && !document.hidden;
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

    resize();
    draw(time);

    const io = new IntersectionObserver((hits) => {
      visible = hits[hits.length - 1].isIntersecting;
      sync();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(time);
    });
    ro.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, seed]);

  return (
    <canvas
      ref={canvasRef}
      className="plaza-viz__canvas"
      role="img"
      aria-label="Fake spectrum bars pulsing to a silent broadcast. 소리 없는 방송에 맞춰 일렁이는 가짜 스펙트럼 막대."
    />
  );
}
