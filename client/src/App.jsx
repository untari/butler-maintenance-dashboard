import { useEffect, useState } from "react";
import { fetchTickets } from "./api/tickets";
import Dashboard from "./components/Dashboard";

function App() {
  const [tickets, setTickets] = useState([]);
  // Tracked separately from `tickets` so the UI can distinguish
  // "still loading" from "loaded, but zero results" from "failed".
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  // Fetches the full ticket set once. Individual widgets (e.g.
  // TicketListWidget's own filters) derive their own view from this
  // shared array client-side rather than each widget hitting the API.
  useEffect(() => {
    fetchTickets()
      .then((data) => {
        setTickets(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-8">
          Butler Dashboard
        </h1>

        {status === "loading" && (
          <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 p-6">
            <p className="text-neutral-400 text-sm py-8 text-center">
              Loading tickets…
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 p-6">
            <p className="text-red-600 text-sm py-8 text-center">
              Couldn't load tickets. Is the backend running on localhost:4000?
            </p>
          </div>
        )}
        {status === "ready" && <Dashboard tickets={tickets} />}
      </div>
    </main>
  );
}

export default App;
