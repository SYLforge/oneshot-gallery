"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type TabItem = {
  id: string;
  label: string;
  panel: ReactNode;
};

/**
 * Accessible tab rail (role=tablist/tab/tabpanel) with roving tabindex
 * and arrow-key navigation. Panels are server-rendered nodes passed in
 * as props; all of them stay in the DOM, hidden when inactive.
 */
export default function DetailTabs({
  items,
  ariaLabel,
}: {
  items: TabItem[];
  ariaLabel: string;
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
    if (event.key === "ArrowRight") next = (active + 1) % items.length;
    else if (event.key === "ArrowLeft")
      next = (active - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next !== null) {
      event.preventDefault();
      focusTab(next);
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b border-hairline"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${item.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`-mb-px whitespace-nowrap border-b px-4 py-3 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors duration-200 ease-out ${
              i === active
                ? "border-accent text-text"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-8"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
