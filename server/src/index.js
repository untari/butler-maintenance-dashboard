// Entry point for the Butler Dashboard API.
// Kept intentionally thin: this file wires up middleware and routes,
// the actual logic lives in ./routes and ./data (added in later steps).
import express from "express";
import cors from "cors";
import ticketsRouter from "./routes/tickets.js";

const app = express();
const PORT = process.env.PORT || 4000;

// The dashboard's frontend runs on a different port (Vite dev server),
// so we need CORS enabled for local development.
app.use(cors());
app.use(express.json());

// Simple health check — useful for confirming the server is up
// before wiring the frontend to it.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Mount the tickets router — handles GET /api/tickets with optional
// ?status=&category=&priority= filters (see routes/tickets.js).
app.use("/api/tickets", ticketsRouter);

app.listen(PORT, () => {
  console.log(`Butler Dashboard API listening on http://localhost:${PORT}`);
});
