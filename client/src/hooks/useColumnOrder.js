// Tracks the display order of the ticket table's reorderable columns,
// persisted to localStorage so it survives a refresh. "Title" is
// intentionally not included — it's the anchor column and always
// renders first; only the columns after it can be rearranged.
import { useEffect, useState } from "react";

const STORAGE_KEY = "butler-ticket-columns";
const DEFAULT_ORDER = ["status", "category", "priority", "created"];

function loadOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ORDER;
    const saved = JSON.parse(raw);

    // Keep the saved order, but drop keys we no longer recognize and
    // append any new default columns the saved order predates.
    const known = DEFAULT_ORDER;
    return [
      ...saved.filter((key) => known.includes(key)),
      ...known.filter((key) => !saved.includes(key)),
    ];
  } catch {
    // Corrupt or missing localStorage data — fall back to defaults
    // rather than letting the table crash on load.
    return DEFAULT_ORDER;
  }
}

export function useColumnOrder() {
  const [order, setOrder] = useState(loadOrder);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  }, [order]);

  // Moves `activeKey` to the position `overKey` currently occupies.
  function reorder(activeKey, overKey) {
    setOrder((prev) => {
      const oldIndex = prev.indexOf(activeKey);
      const newIndex = prev.indexOf(overKey);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev;
      }
      const next = [...prev];
      next.splice(oldIndex, 1);
      next.splice(newIndex, 0, activeKey);
      return next;
    });
  }

  return { order, reorder };
}
