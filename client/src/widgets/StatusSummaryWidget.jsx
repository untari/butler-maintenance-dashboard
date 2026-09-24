// At-a-glance counts by status — the first thing a facilities manager
// wants to know when opening the dashboard: how much is outstanding,
// how much is being worked, how much is done. Big numbers, small
// labels — a stat tile, not another table.
const STATUSES = ["Open", "In Progress", "Closed"];

const STAT_COLORS = {
  Open: "text-amber-600",
  "In Progress": "text-blue-600",
  Closed: "text-emerald-600",
};

export default function StatusSummaryWidget({ tickets }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STATUSES.map((status) => {
        const count = tickets.filter((t) => t.status === status).length;
        return (
          <div key={status} className="text-center">
            <div className={`text-3xl font-semibold ${STAT_COLORS[status]}`}>
              {count}
            </div>
            <div className="text-xs text-neutral-500 mt-1">{status}</div>
          </div>
        );
      })}
    </div>
  );
}
