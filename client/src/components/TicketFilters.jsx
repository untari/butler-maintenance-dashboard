// Controlled filter bar: the parent (App) owns the actual filter state,
// this component just renders controls and reports changes upward.
// Hardcoded option lists match the fixed enum values used across the
// dataset and the backend's filtering logic
const STATUSES = ["Open", "In Progress", "Closed"];
const CATEGORIES = [
  "HVAC",
  "Electrical",
  "Plumbing",
  "Security",
  "Lift",
  "Civil",
  "Safety",
];
const PRIORITIES = ["Low", "Medium", "High"];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 rounded-md px-2 py-1.5 text-slate-800 bg-white"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function TicketFilters({ filters, onChange }) {
  const hasActiveFilters = filters.status || filters.category || filters.priority;

  return (
    <div className="flex flex-wrap items-end gap-4 mb-4">
      <FilterSelect
        label="Status"
        value={filters.status}
        options={STATUSES}
        onChange={(value) => onChange({ ...filters, status: value })}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        options={CATEGORIES}
        onChange={(value) => onChange({ ...filters, category: value })}
      />
      <FilterSelect
        label="Priority"
        value={filters.priority}
        options={PRIORITIES}
        onChange={(value) => onChange({ ...filters, priority: value })}
      />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ status: "", category: "", priority: "" })}
          className="text-sm text-blue-600 hover:underline pb-1.5"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
