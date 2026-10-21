import { Router } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Server Active" });
});

router.use(healthRouter);
router.use(contactRouter);

export default router;
