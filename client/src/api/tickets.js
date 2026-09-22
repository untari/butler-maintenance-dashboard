// Thin wrapper around the /api/tickets endpoint.
// Keeping fetch logic out of components makes them easier to read
// and gives us one place to change if the API shape ever changes.

// Falls back to localhost:4000 for local dev; can be overridden via
// a VITE_API_URL env var (e.g. when deploying frontend/backend separately).
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// filters: optional { status, category, priority } — any combination,
// matching what the backend route already supports.
export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  if (filters.priority) params.set("priority", filters.priority);

  const query = params.toString();
  const url = `${API_BASE_URL}/api/tickets${query ? `?${query}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets (${response.status})`);
  }
  return response.json();
}
