import { Router } from "express";
import fs from "fs";
import path from "path";

const visitsRouter = Router();
const DATA_DIR = path.join(process.cwd(), "data");
const VISITS_FILE = path.join(DATA_DIR, "visits.json");

visitsRouter.get("/visits", (_req, res) => {
  let count = 1000;
  try {
    if (fs.existsSync(VISITS_FILE)) {
      const data = JSON.parse(fs.readFileSync(VISITS_FILE, "utf8")) as { count?: number };
      count = (data.count ?? 1000) + 1;
    }
  } catch {}
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ count }));
  } catch {}
  res.json({ count });
});

export default visitsRouter;
