import express, { type Express } from "express";
import cors from "cors";
import router from "./routes/index";

const app: Express = express();

app.use(cors());
app.use(express.json());

// Logger sederhana tanpa modul pino yang memicu error Vercel
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(router);

export default app;