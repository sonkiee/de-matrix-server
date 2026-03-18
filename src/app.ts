import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import dotenv from "dotenv";
import { globalLimiter } from "./config/limiter";
import setupSwagger from "./swaggerConfig";
import routes from "./routes/index.routes";

import {
  errorHandler,
  methodNotAllowedHandler,
  notFoundHandler,
} from "./middleware/error.middleware";
import { corsOptions } from "./config/cors";
import httpLogger from "./middleware/http-logger.middleware";
import cookieParser from "cookie-parser";
import logger from "./config/logger";
import { PaymentsController } from "./modules/payment/payment.controller";

dotenv.config();

export const app = express();
app.set("trust proxy", 1); // if behind a proxy (e.g. Heroku, Render)

const paymentController = new PaymentsController();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

app.use(hpp());
app.use(compression());

app.use(httpLogger);
// app.use(globalLimiter);

app.post(
  "/api/order/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);
