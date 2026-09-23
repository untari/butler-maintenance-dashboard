// Surfaces what needs attention right now: High priority tickets that
// aren't Closed yet. A condensed, scannable list rather than the full
// table — this widget answers "what should I look at first?"
export default function HighPriorityWidget({ tickets }) {
  const urgent = tickets
    .filter((t) => t.priority === "High" && t.status !== "Closed")
    // Oldest first — a ticket that's been waiting longest surfaces first.
    .sort((a, b) => (a.created < b.created ? -1 : 1));

  if (urgent.length === 0) {
    return (
      <p className="text-neutral-400 text-sm py-4 text-center">
        No open high-priority tickets.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/5">
      {urgent.map((ticket) => (
        <li
          key={ticket.id}
          className="py-2.5 flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-sm text-neutral-800 truncate">{ticket.title}</p>
            <p className="text-xs text-neutral-400">
              {ticket.category} · {ticket.created}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            {ticket.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
