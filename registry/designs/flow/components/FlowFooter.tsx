"use client";

/**
 * The closing — the river reaches the sea.
 *
 * A quiet footer that names the page's central image one last time: every
 * written thing ends up in the same current. The colophon line states the
 * entry's discipline honestly — the water is drawn in code, not filmed; it
 * never stops because the loop never returns.
 */
export default function FlowFooter() {
  return (
    <footer className="flow-foot" data-reveal="">
      <p className="flow-foot__call">
        <span lang="ko">모든 글자는 같은 강물로</span>
      </p>
      <p className="flow-foot__sub">
        <em>All letters, the same river — to the same sea.</em>
      </p>
      <p className="flow-foot__legal">
        © 2026 FLOW · <span lang="ko">흐름</span> · MIT
      </p>
      <p className="flow-foot__colophon">
        <span lang="ko">코드로 그렸다 — 물은 멈추지 않는다.</span>{" "}
        <em>drawn in code — the water never stops.</em>
      </p>
    </footer>
  );
}
