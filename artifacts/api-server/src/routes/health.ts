import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/health", (req: any, res: any) => {
  res.json({ status: "ok" });
});

export default healthRouter;
