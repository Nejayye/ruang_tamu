import express, { type Express } from "express";
import cors from "cors";
import router from "./routes/index";
import { logger } from "./lib/logger";

const pinoHttp = require("pino-http");

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(router);

export default app;