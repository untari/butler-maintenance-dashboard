// Wraps the existing filter controls + table as one widget. Owns its
// filter state locally — this widget's filters shouldn't affect what
// other widgets (like HighPriorityWidget) show — and filters the shared,
// already-fetched ticket list client-side rather than re-hitting the API.
import { useState } from "react";
import TicketFilters from "../components/TicketFilters";
import TicketList from "../components/TicketList";

export default function TicketListWidget({ tickets }) {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });

  const filtered = tickets.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div>
      <TicketFilters filters={filters} onChange={setFilters} />
      <TicketList tickets={filtered} />
    </div>
  );
}
