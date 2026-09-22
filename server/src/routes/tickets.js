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

export default router;
