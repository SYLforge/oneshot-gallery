"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { GalleryIndexEntry } from "@/lib/schema";
import CommandPalette from "@/components/command-palette";

type PaletteContextValue = {
  openPalette: () => void;
};

const PaletteContext = createContext<PaletteContextValue | null>(null);

/** Hook for trigger buttons (header search, etc.). */
export function usePalette(): PaletteContextValue {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within <PaletteProvider>");
  }
  return context;
}

/**
 * Mounts the ⌘K / Ctrl+K command palette once per page shell and exposes
 * an imperative opener via context. `entries` is the gallery index,
 * serialized from the server layout.
 */
export default function PaletteProvider({
  entries,
  children,
}: {
  entries: GalleryIndexEntry[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <PaletteContext.Provider value={{ openPalette: () => setOpen(true) }}>
      {children}
      <CommandPalette entries={entries} open={open} onOpenChange={setOpen} />
    </PaletteContext.Provider>
  );
}
