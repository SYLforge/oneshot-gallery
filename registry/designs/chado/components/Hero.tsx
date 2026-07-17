"use client";

import type { CSSProperties } from "react";
import BreathCue from "./BreathCue";

/**
 * The chashitsu gate — the hero of the ceremony.
 *
 * The signature move is the title set in tategaki (縦書き): the two kanji of
 * 茶道 climb a vertical column in Shippori Mincho, the authentic Japanese
 * reading direction. Almost no Western "Japanese-inspired" site uses
 * writing-mode: vertical-rl; this one leads with it. The two glyphs split
 * into aria-hidden spans behind an aria-label so each can rise along the
 * column on its own delay — the header writes itself top-to-bottom, the only
 * direction a brush ever travels.
 *
 * Beside the column: the wordmark CHADŌ, the romanized reading sadō, the
 * one-line proposition (一期一会 / one bowl), and the breath cue that paces
 * the whole page. The rest of the hero is paper. The ma is the point.
 */
const TITLE = ["茶", "道"];

export default function Hero({ cueActive }: { cueActive: boolean }) {
  return (
    <header className="chado-hero" id="chado-top">
      <p className="chado-hero__folio">
        <span lang="ja">茶道</span> · No. 20 · 2026 ·{" "}
        <span lang="ja">京都</span>
      </p>

      <div className="chado-hero__stage">
        {/* The tategaki title — the only thing that reads top-to-bottom. */}
        <h1 className="chado-tategaki" lang="ja" aria-label="茶道（さどう）">
          {TITLE.map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="chado-tategaki__ch"
              style={{ "--ch-ci": i } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div className="chado-hero__col">
          <p className="chado-hero__kicker">
            <span lang="ja">一服</span> · One Bowl
          </p>
          <p className="chado-hero__name">CHADŌ</p>
          <p className="chado-hero__reading">
            <span lang="ja">さどう</span> · sadō · the way of tea
          </p>

          <p className="chado-hero__proposition" data-reveal>
            <span lang="ja">
              茶道は、一服の茶を全身で受け取るためにある。
            </span>
          </p>
          <p className="chado-hero__proposition chado-hero__proposition--en" data-reveal>
            The whole ceremony exists so that one bowl of tea can be
            received with full attention. You are not late. The water is
            not yet boiling. Please, slow down.
          </p>

          <BreathCue active={cueActive} />

          <p className="chado-hero__scrollhint" aria-hidden="true">
            <span className="chado-hero__scrollline" />
            <span lang="ja">どうぞ</span> · please, begin
          </p>
        </div>
      </div>
    </header>
  );
}
