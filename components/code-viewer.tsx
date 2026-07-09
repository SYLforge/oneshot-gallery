"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import CopyButton from "@/components/copy-button";

export type CodeFile = {
  /** Display name relative to the entry, e.g. "components/SignalField.tsx". */
  name: string;
  /** Human file size, e.g. "8.8 KB". */
  size: string;
  /** Shiki-highlighted HTML (rendered at build time). */
  html: string;
  /** Raw source, for the copy button. */
  raw: string;
};

export type CodeViewerLabels = {
  filesAria: string;
  copy: string;
  copied: string;
};

/**
 * File tabs over build-time-highlighted sources. Only the active file is
 * in the DOM; the tab strip scrolls horizontally when needed.
 */
export default function CodeViewer({
  files,
  labels,
}: {
  files: CodeFile[];
  labels: CodeViewerLabels;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const focusTab = (index: number) => {
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (active + 1) % files.length;
    else if (event.key === "ArrowLeft")
      next = (active - 1 + files.length) % files.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = files.length - 1;
    if (next !== null) {
      event.preventDefault();
      focusTab(next);
    }
  };

  const file = files[active];
  if (!file) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label={labels.filesAria}
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border border-hairline bg-surface"
      >
        {files.map((f, i) => (
          <button
            key={f.name}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-file-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-source`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap border-b-2 border-r border-r-hairline px-3.5 py-2.5 font-mono text-[12px] transition-colors duration-200 ease-out ${
              i === active
                ? "border-b-accent text-text"
                : "border-b-transparent text-muted hover:text-text"
            }`}
          >
            {f.name}
            <span
              className={`ml-2 text-[10.5px] ${
                i === active ? "text-muted" : "text-muted/60"
              }`}
            >
              {f.size}
            </span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-source`}
        aria-labelledby={`${baseId}-file-${active}`}
        tabIndex={0}
        className="border border-t-0 border-hairline bg-surface"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-2.5">
          <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {file.name}
          </span>
          <CopyButton
            text={file.raw}
            label={labels.copy}
            copiedLabel={labels.copied}
          />
        </div>
        <div
          className="code-block"
          dangerouslySetInnerHTML={{ __html: file.html }}
        />
      </div>
    </div>
  );
}
