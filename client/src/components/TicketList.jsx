// Renders a table of tickets

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

function Badge({ label, styles }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}

export default function TicketList({ tickets }) {
  if (tickets.length === 0) {
    return (
      <p className="text-neutral-400 text-sm py-8 text-center">
        No tickets match the current filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-black/5 text-neutral-400">
            <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wide">
              Title
            </th>
            <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wide">
              Status
            </th>
            <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wide">
              Category
            </th>
            <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wide">
              Priority
            </th>
            <th className="py-2 font-medium text-xs uppercase tracking-wide">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-black/5 hover:bg-neutral-50"
            >
              <td className="py-2.5 pr-4 text-neutral-800">{ticket.title}</td>
              <td className="py-2.5 pr-4">
                <Badge
                  label={ticket.status}
                  styles={STATUS_STYLES[ticket.status]}
                />
              </td>
              <td className="py-2.5 pr-4 text-neutral-600">
                {ticket.category}
              </td>
              <td className="py-2.5 pr-4">
                <Badge
                  label={ticket.priority}
                  styles={PRIORITY_STYLES[ticket.priority]}
                />
              </td>
              <td className="py-2.5 text-neutral-400">{ticket.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
