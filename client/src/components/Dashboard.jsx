// Ties together widget layout (order/visibility + persistence), drag-and-
// drop reordering, and the widget registry into the actual dashboard grid.
// This is the only place that needs to know about all three — individual
// widgets and WidgetCard don't.
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDashboardLayout } from "../hooks/useDashboardLayout";
import { WIDGET_REGISTRY } from "../widgets/registry";
import WidgetCard from "./WidgetCard";

export default function Dashboard({ tickets }) {
  const { layout, reorder, toggleVisibility } = useDashboardLayout();

  // Require the pointer to move a few pixels before a drag starts, so a
  // plain click (e.g. the Hide button inside WidgetCard) isn't misread
  // as the start of a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const visibleIds = layout.order.filter((id) => layout.visible[id]);
  const hiddenIds = layout.order.filter((id) => !layout.visible[id]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(active.id, over.id);
    }
  }

  return (
    <div>
      {hiddenIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-neutral-500">
          <span>Hidden:</span>
          {hiddenIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleVisibility(id)}
              className="px-2.5 py-1 rounded-full border border-black/10 hover:border-black/20 text-neutral-700 transition-colors"
            >
              + {WIDGET_REGISTRY[id].title}
            </button>
          ))}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-6">
            {visibleIds.map((id) => {
              const widget = WIDGET_REGISTRY[id];
              const WidgetComponent = widget.component;
              return (
                <WidgetCard
                  key={id}
                  id={id}
                  title={widget.title}
                  onHide={() => toggleVisibility(id)}
                >
                  <WidgetComponent tickets={tickets} />
                </WidgetCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
