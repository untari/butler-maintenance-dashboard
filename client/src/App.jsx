import { useEffect, useState } from "react";
import { fetchTickets } from "./api/tickets";
import TicketList from "./components/TicketList";

function App() {
  const [tickets, setTickets] = useState([]);
  // Tracked separately from `tickets` so the UI can distinguish
  // "still loading" from "loaded, but zero results" from "failed".
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    fetchTickets()
      .then((data) => {
        setTickets(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Butler Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          {status === "loading" && (
            <p className="text-slate-500 text-sm py-8 text-center">
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
