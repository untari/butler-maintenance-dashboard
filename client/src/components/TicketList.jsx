// Renders a table of tickets, with Status/Category/Priority/Created
// columns reorderable by dragging their headers — "Title" stays fixed
// as the anchor column so every row keeps a stable identifying cell.
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useColumnOrder } from "../hooks/useColumnOrder";
import { STATUSES, PRIORITIES } from "../constants/tickets";

// Color-coding status/priority lets someone scanning the dashboard spot
// what needs attention without reading every row, the "at a glance" goal.
const STATUS_STYLES = {
  Open: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Closed: "bg-emerald-100 text-emerald-800",
};

const PRIORITY_STYLES = {
  Low: "bg-neutral-100 text-neutral-600",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700",
};

// Same pill look the badges used to have, but an actual <select> underneath — status
// and priority are workflow state that legitimately changes over a
// ticket's life, unlike category/title/created which stay read-only.
// `appearance-none` strips the native select chrome so it still reads
// as a badge; the small chevron is the only hint it's interactive.
function EditableBadge({ value, options, styles, onChange }) {
  return (
    <span className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full pl-2 pr-5 py-0.5 text-xs font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 ${styles}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 opacity-50"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
      >
        <path
          d="M1 2.5 L4 5.5 L7 2.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// One entry per reorderable column: how to label it and how to render
// a ticket's value for it. Keyed the same way useColumnOrder's ids are.
// render receives (ticket, onUpdateTicket) — only the editable columns
// (status/priority) use the second argument.
const COLUMNS = {
  status: {
    label: "Status",
    render: (ticket, onUpdateTicket) => (
      <EditableBadge
        value={ticket.status}
        options={STATUSES}
        styles={STATUS_STYLES[ticket.status]}
        onChange={(value) => onUpdateTicket(ticket.id, { status: value })}
      />
    ),
  },
  category: {
    label: "Category",
    render: (ticket) => (
      <span className="text-neutral-600">{ticket.category}</span>
    ),
  },
  priority: {
    label: "Priority",
    render: (ticket, onUpdateTicket) => (
      <EditableBadge
        value={ticket.priority}
        options={PRIORITIES}
        styles={PRIORITY_STYLES[ticket.priority]}
        onChange={(value) => onUpdateTicket(ticket.id, { priority: value })}
      />
    ),
  },
  created: {
    label: "Created",
    render: (ticket) => (
      <span className="text-neutral-400">{ticket.created}</span>
    ),
  },
};

function SortableHeader({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="py-2 pr-4 font-medium text-xs uppercase tracking-wide"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="inline-flex items-center gap-1 cursor-grab active:cursor-grabbing touch-none hover:text-neutral-600 transition-colors"
      >
        {/* Grip icon — same affordance language as the dashboard widgets */}
        <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="4" cy="2" r="1.2" />
          <circle cx="4" cy="7" r="1.2" />
          <circle cx="4" cy="12" r="1.2" />
          <circle cx="10" cy="2" r="1.2" />
          <circle cx="10" cy="7" r="1.2" />
          <circle cx="10" cy="12" r="1.2" />
        </svg>
        {label}
      </button>
    </th>
  );
}

export default function TicketList({ tickets, onUpdateTicket = () => {} }) {
  const { order, reorder } = useColumnOrder();

  // Same activation distance as the dashboard widgets — a click on the
  // header shouldn't be misread as the start of a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(active.id, over.id);
    }
  }

  if (tickets.length === 0) {
    return (
      <p className="text-neutral-400 text-sm py-8 text-center">
        No tickets match the current filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 text-neutral-400">
              <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wide">
                Title
              </th>
              <SortableContext items={order} strategy={horizontalListSortingStrategy}>
                {order.map((key) => (
                  <SortableHeader key={key} id={key} label={COLUMNS[key].label} />
                ))}
              </SortableContext>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-black/5 hover:bg-neutral-50"
              >
                <td className="py-2.5 pr-4 text-neutral-800">{ticket.title}</td>
                {order.map((key) => (
                  <td key={key} className="py-2.5 pr-4">
                    {COLUMNS[key].render(ticket, onUpdateTicket)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
