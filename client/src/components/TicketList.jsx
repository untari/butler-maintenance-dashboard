// Renders a table of tickets

// Color-coding status/priority lets someone scanning the dashboard spot
// what needs attention without reading every row, the "at a glance" goal.
const STATUS_STYLES = {
  Open: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Closed: "bg-emerald-100 text-emerald-800",
};

const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",
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
      <p className="text-slate-500 text-sm py-8 text-center">
        No tickets match the current filters.
      </p>
    );
  }

  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          <th className="py-2 pr-4 font-medium">Title</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Category</th>
          <th className="py-2 pr-4 font-medium">Priority</th>
          <th className="py-2 font-medium">Created</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr
            key={ticket.id}
            className="border-b border-slate-100 hover:bg-slate-50"
          >
            <td className="py-2 pr-4 text-slate-800">{ticket.title}</td>
            <td className="py-2 pr-4">
              <Badge label={ticket.status} styles={STATUS_STYLES[ticket.status]} />
            </td>
            <td className="py-2 pr-4 text-slate-600">{ticket.category}</td>
            <td className="py-2 pr-4">
              <Badge
                label={ticket.priority}
                styles={PRIORITY_STYLES[ticket.priority]}
              />
            </td>
            <td className="py-2 text-slate-500">{ticket.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
