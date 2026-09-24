// Routes for /api/tickets — reads the JSON data source and applies
// optional status/category/priority filters from the query string.
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../data/tickets.json");

const router = Router();

// GET /api/tickets?status=Open&category=HVAC&priority=High
// Any combination of filters is optional — omitted ones are ignored.
router.get("/", (req, res) => {
  const tickets = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const { status, category, priority } = req.query;

  const filtered = tickets.filter((ticket) => {
    if (status && ticket.status !== status) return false;
    if (category && ticket.category !== category) return false;
    if (priority && ticket.priority !== priority) return false;
    return true;
  });

  res.json(filtered);
});

const ALLOWED_STATUSES = ["Open", "In Progress", "Closed"];
const ALLOWED_PRIORITIES = ["Low", "Medium", "High"];

// PATCH /api/tickets/:id — updates status and/or priority on one ticket
// and persists the change back to the JSON file. Deliberately limited to
// these two fields: they're workflow state that legitimately changes
// over a ticket's life. Category/title/created stay read-only — a
// ticket's classification isn't something that changes after the fact.
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status, priority } = req.body;

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}` });
  }
  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `Invalid priority: ${priority}` });
  }

  const tickets = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) {
    return res.status(404).json({ error: `Ticket ${id} not found` });
  }

  if (status !== undefined) ticket.status = status;
  if (priority !== undefined) ticket.priority = priority;

  fs.writeFileSync(DATA_PATH, JSON.stringify(tickets, null, 2) + "\n");
  res.json(ticket);
});

export default router;
