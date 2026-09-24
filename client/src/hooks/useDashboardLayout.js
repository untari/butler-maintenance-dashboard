// Tracks which widgets are visible and in what order, persisted to
// localStorage so a user's arrangement survives a page refresh.
// This hook only knows about widget IDs — it has no idea what a widget
// actually renders (see ../widgets/registry.js for that).
import { useEffect, useState } from "react";

const STORAGE_KEY = "butler-dashboard-layout";

// Must stay in sync with the ids registered in ../widgets/registry.js.
const DEFAULT_LAYOUT = {
  order: ["status-summary", "ticket-list", "high-priority"],
  visible: {
    "status-summary": true,
    "ticket-list": true,
    "high-priority": true,
  },
};

function loadLayout() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const saved = JSON.parse(raw);

    // Keep the saved order, but drop ids we no longer recognize and
    // append any new default widgets the saved layout predates.
    const knownIds = DEFAULT_LAYOUT.order;
    const order = [
      ...saved.order.filter((id) => knownIds.includes(id)),
      ...knownIds.filter((id) => !saved.order.includes(id)),
    ];

    return {
      order,
      visible: { ...DEFAULT_LAYOUT.visible, ...saved.visible },
    };
  } catch {
    // Corrupt or missing localStorage data — fall back to defaults
    // rather than letting the dashboard crash on load.
    return DEFAULT_LAYOUT;
  }
}

export function useDashboardLayout() {
  const [layout, setLayout] = useState(loadLayout);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  // Moves `activeId` to the position `overId` currently occupies.
  function reorder(activeId, overId) {
    setLayout((prev) => {
      const oldIndex = prev.order.indexOf(activeId);
      const newIndex = prev.order.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev;
      }
      const next = [...prev.order];
      next.splice(oldIndex, 1);
      next.splice(newIndex, 0, activeId);
      return { ...prev, order: next };
    });
  }

  function toggleVisibility(id) {
    setLayout((prev) => ({
      ...prev,
      visible: { ...prev.visible, [id]: !prev.visible[id] },
    }));
  }

  return { layout, reorder, toggleVisibility };
}
