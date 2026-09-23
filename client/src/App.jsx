import { useEffect, useState } from "react";
import { fetchTickets } from "./api/tickets";
import TicketList from "./components/TicketList";
import TicketFilters from "./components/TicketFilters";

function App() {
  const [tickets, setTickets] = useState([]);
  // Tracked separately from `tickets` so the UI can distinguish
  // "still loading" from "loaded, but zero results" from "failed".
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });

  // Refetches whenever filters change — TicketFilters always hands back
  // a brand-new object, so this effect re-runs on every filter edit.
  useEffect(() => {
    setStatus("loading");
    fetchTickets(filters)
      .then((data) => {
        setTickets(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [filters]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-8">
          Butler Dashboard
        </h1>

        <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 p-6">
          <TicketFilters filters={filters} onChange={setFilters} />

          {status === "loading" && (
            <p className="text-neutral-400 text-sm py-8 text-center">
              Loading tickets…
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm py-8 text-center">
              Couldn't load tickets. Is the backend running on localhost:4000?
            </p>
          )}
          {status === "ready" && <TicketList tickets={tickets} />}
        </div>
      </div>
    </main>
  );
}

export default App;
