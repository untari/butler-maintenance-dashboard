// Shared enum values for ticket fields — the single source of truth for
// both the filter dropdowns and the editable status/priority cells, and
// must match the backend's own ALLOWED_STATUSES/ALLOWED_PRIORITIES in
// server/src/routes/tickets.js (duplicated there since frontend and
// backend don't share a module boundary).
export const STATUSES = ["Open", "In Progress", "Closed"];

export const CATEGORIES = [
  "HVAC",
  "Electrical",
  "Plumbing",
  "Security",
  "Lift",
  "Civil",
  "Safety",
];

export const PRIORITIES = ["Low", "Medium", "High"];
