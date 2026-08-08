"use client";

import type { ReactNode } from "react";
import type { Widget } from "./widgets";

/**
 * WidgetCard — one piece of spatial glass.
 *
 * The shell provides the glass surface (backdrop-filter, multi-layer shadow,
 * contact drop-shadow) and the 3D housing that usePointerParallax drives via
 * `--w-rx/--w-ry/--w-lift`. The `data-tilt` + `data-depth` attributes are the
 * contract with that hook: depth ∈ {near,mid,far} decides how much the card
 * leans and lifts. A separate `__face` layer lets the glass float above the
 * contact shadow rather than casting onto itself.
 *
 * Each kind renders its own content (see renderWidget). All numeric values
 * use `widget-num` so the stylesheet can apply `font-variant-numeric:
 * tabular-nums` — columns of figures align the way a dashboard demands.
 */

const WEATHER_ICON: Record<"sun" | "cloud" | "rain", ReactNode> = {
  sun: (
    <svg viewBox="0 0 24 24" className="widget-ico" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <g stroke="none">
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" />
      </g>
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" className="widget-ico" aria-hidden="true">
      <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.3A3.6 3.6 0 0117 18z" />
    </svg>
  ),
  rain: (
    <svg viewBox="0 0 24 24" className="widget-ico" aria-hidden="true">
      <path d="M7 15a4 4 0 010-8 5 5 0 019.6-1.3A3.6 3.6 0 0117 15z" />
      <path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" />
    </svg>
  ),
};

function WeatherGlyph({ icon }: { icon: "sun" | "cloud" | "rain" }) {
  return WEATHER_ICON[icon];
}

function renderWidget(w: Widget): ReactNode {
  switch (w.kind) {
    case "weather":
      return (
        <>
          <div className="widget-weather__head">
            <span className="widget-num widget-weather__temp">
              {w.temp}
              <span className="widget-weather__deg">{w.tempUnit}</span>
            </span>
            <div className="widget-weather__cond">
              <WeatherGlyph icon="sun" />
              <span>
                {w.conditionEn} ·{" "}
                <span lang="ko">{w.conditionKo}</span>
              </span>
            </div>
          </div>
          <p className="widget-weather__city">
            {w.cityEn} · <span lang="ko">{w.cityKo}</span>
          </p>
          <ul className="widget-hourly" role="list">
            {w.hourly.map((h) => (
              <li key={h.hour} className="widget-hourly__cell">
                <span className="widget-hourly__hour widget-num">{h.hour}</span>
                <span className="widget-hourly__icon">
                  <WeatherGlyph icon={h.icon} />
                </span>
                <span className="widget-hourly__temp widget-num">
                  {h.temp}°
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "schedule":
      return (
        <>
          <p className="widget-schedule__title">
            {w.nextEn} · <span lang="ko">{w.nextKo}</span>
          </p>
          <p className="widget-schedule__count">
            {w.countdownEn} · <span lang="ko">{w.countdownKo}</span>
          </p>
          <ul className="widget-meetings" role="list">
            {w.meetings.map((m) => (
              <li key={m.time} className="widget-meeting">
                <span className="widget-meeting__time widget-num">
                  {m.time}
                </span>
                <span className="widget-meeting__body">
                  <span className="widget-meeting__name">
                    {m.titleEn} ·{" "}
                    <span lang="ko">{m.titleKo}</span>
                  </span>
                  <span className="widget-meeting__with">
                    {m.withEn} · <span lang="ko">{m.withKo}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "chart":
      return (
        <>
          <div className="widget-chart__head">
            <span className="widget-num widget-chart__total">
              {w.total}
              <span className="widget-chart__unit">{w.totalUnit}</span>
            </span>
            <span className="widget-chart__delta">
              {w.deltaEn} · <span lang="ko">{w.deltaKo}</span>
            </span>
          </div>
          <ul className="widget-bars" role="list">
            {w.bars.map((b) => (
              <li key={b.dayEn} className="widget-bar">
                <span
                  className="widget-bar__fill"
                  style={{ ["--w-bar" as string]: `${b.value}%` }}
                />
                <span className="widget-bar__day" lang="ko">
                  {b.dayKo}
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "music":
      return (
        <>
          <div className="widget-music__head">
            <span className="widget-music__art" aria-hidden="true">
              <svg viewBox="0 0 48 48" className="widget-music__glyph">
                <circle cx="16" cy="32" r="4" />
                <circle cx="34" cy="28" r="4" />
                <path d="M20 32V14l18-4v18" />
              </svg>
            </span>
            <div className="widget-music__meta">
              <p className="widget-music__track">
                {w.trackEn} · <span lang="ko">{w.trackKo}</span>
              </p>
              <p className="widget-music__artist">
                {w.artistEn} · <span lang="ko">{w.artistKo}</span>
              </p>
            </div>
          </div>
          <div className="widget-music__bar" aria-hidden="true">
            <span
              className="widget-music__progress"
              style={{ ["--w-prog" as string]: `${w.progress * 100}%` }}
            />
          </div>
          <div className="widget-music__time">
            <span className="widget-num">{w.elapsed}</span>
            <span className="widget-num widget-music__dur">
              {w.duration}
            </span>
          </div>
          <div className="widget-music__controls" aria-hidden="true">
            <span className="widget-music__btn widget-music__btn--prev" />
            <span className="widget-music__btn widget-music__btn--play" />
            <span className="widget-music__btn widget-music__btn--next" />
          </div>
        </>
      );

    case "health":
      return (
        <>
          <div className="widget-health__ring" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="widget-ring">
              <circle
                className="widget-ring__track"
                cx="60"
                cy="60"
                r="50"
              />
              <circle
                className="widget-ring__value"
                cx="60"
                cy="60"
                r="50"
                style={{
                  ["--w-ring" as string]: `${(w.ringPct / 100) * 314.16}`,
                }}
              />
            </svg>
            <span className="widget-ring__pct widget-num">{w.ringPct}%</span>
          </div>
          <p className="widget-health__ring-label">
            {w.ringLabelEn} · <span lang="ko">{w.ringLabelKo}</span>
          </p>
          <div className="widget-health__steps">
            <span className="widget-num widget-health__count">
              {w.steps.toLocaleString()}
            </span>
            <span className="widget-health__goal">
              / {w.stepsGoal.toLocaleString()} {w.stepsUnit}
            </span>
          </div>
        </>
      );

    case "air":
      return (
        <ul className="widget-air" role="list">
          <li className="widget-air__cell">
            <span className="widget-num widget-air__value">
              {w.pm25}
              <span className="widget-air__unit">{w.pm25Unit}</span>
            </span>
            <span className="widget-air__label">
              {w.pm25LabelEn} · <span lang="ko">{w.pm25LabelKo}</span>
            </span>
          </li>
          <li className="widget-air__cell">
            <span className="widget-num widget-air__value">{w.uv}</span>
            <span className="widget-air__label">
              {w.uvLabelEn} · <span lang="ko">{w.uvLabelKo}</span>
            </span>
          </li>
          <li className="widget-air__cell">
            <span className="widget-num widget-air__value">
              {w.wind}
              <span className="widget-air__unit">{w.windUnit}</span>
            </span>
            <span className="widget-air__label">
              {w.windLabelEn} · <span lang="ko">{w.windLabelKo}</span>
            </span>
          </li>
        </ul>
      );

    case "timer":
      return (
        <>
          <p className="widget-timer__remain widget-num">{w.remaining}</p>
          <p className="widget-timer__task">
            {w.taskEn} · <span lang="ko">{w.taskKo}</span>
          </p>
          <div className="widget-timer__bar" aria-hidden="true">
            <span
              className="widget-timer__progress"
              style={{ ["--w-prog" as string]: `${w.progress * 100}%` }}
            />
          </div>
        </>
      );

    case "messages":
      return (
        <>
          <div className="widget-msg__head">
            <span className="widget-num widget-msg__count">{w.count}</span>
            <span className="widget-msg__unit">{w.countUnit}</span>
          </div>
          <ul className="widget-msgs" role="list">
            {w.messages.map((m, i) => (
              <li key={i} className="widget-msg">
                <span className="widget-msg__from">
                  {m.fromEn} · <span lang="ko">{m.fromKo}</span>
                </span>
                <span className="widget-msg__preview">
                  {m.previewEn} <span lang="ko">{m.previewKo}</span>
                </span>
                <span className="widget-msg__time widget-num">{m.time}</span>
              </li>
            ))}
          </ul>
        </>
      );
  }
}

export default function WidgetCard({ widget }: { widget: Widget }) {
  return (
    <article
      className={`widget-card widget-card--${widget.kind}`}
      data-tilt=""
      data-depth={widget.depth}
      style={{
        ["--w-span-col" as string]: widget.span.col,
        ["--w-span-row" as string]: widget.span.row,
      }}
      aria-label={`${widget.labelEn} · ${widget.labelKo}`}
    >
      <div className="widget-card__face">
        <span className="widget-card__sheen" aria-hidden="true" />
        <header className="widget-card__head">
          <span className="widget-card__label">
            {widget.labelEn} · <span lang="ko">{widget.labelKo}</span>
          </span>
          <span className="widget-card__dot" aria-hidden="true" />
        </header>
        <div className="widget-card__body">{renderWidget(widget)}</div>
      </div>
    </article>
  );
}
