// Reusable chrome around every dashboard widget: a draggable header
// (grip handle + title), a hide button, and a content area. Individual
// widgets only need to render their own content — this component owns
// everything about "being a widget on the dashboard" (drag, hide, framing).
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// How many of the grid's columns a widget occupies, keyed by the
// registry's `span` value. Written as full static class strings (not
// built with template interpolation) so Tailwind's scanner can find them.
// md only ever has 2 columns, so span 2 and span 3 look identical there —
// they only diverge at xl, where the grid actually has 3 columns.
const SPAN_CLASSES = {
  1: "",
  2: "md:col-span-2 xl:col-span-2",
  3: "md:col-span-2 xl:col-span-3",
};

export default function WidgetCard({ id, title, onHide, span = 1, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Fading the widget while it's being dragged gives clear feedback
    // about which one is moving, without hiding the layout underneath.
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden ${SPAN_CLASSES[span]}`}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 transition-colors touch-none"
            aria-label="Drag to reorder"
          >
            {/* Grip icon — two columns of three dots, the standard drag affordance */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="4" cy="2" r="1.2" />
              <circle cx="4" cy="7" r="1.2" />
              <circle cx="4" cy="12" r="1.2" />
              <circle cx="10" cy="2" r="1.2" />
              <circle cx="10" cy="7" r="1.2" />
              <circle cx="10" cy="12" r="1.2" />
            </svg>
          </button>
          <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onHide}
          className="text-neutral-300 hover:text-neutral-500 transition-colors text-xs"
          aria-label={`Hide ${title}`}
        >
          Hide
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
