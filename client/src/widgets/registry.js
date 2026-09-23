// Single source of truth mapping a widget's ID (the same ID
// useDashboardLayout uses for ordering/visibility) to its display title
// and the component that renders its content. Adding a widget to the
// dashboard means adding one entry here — the Dashboard container and
// the layout hook don't need to know anything about individual widgets.
import HighPriorityWidget from "./HighPriorityWidget";

export const WIDGET_REGISTRY = {
  "high-priority": {
    title: "Needs Attention",
    component: HighPriorityWidget,
  },
};
