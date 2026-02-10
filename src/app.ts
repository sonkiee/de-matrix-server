import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import dotenv from "dotenv";
import { globalLimiter } from "./config/limiter";
import setupSwagger from "./swaggerConfig";
import connectDB from "./config/database";
import routes from "./routes/index.routes";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { corsOptions } from "./config/cors";
import httpLogger from "./middleware/http-logger.middleware";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import logger from "./config/logger";

dotenv.config();

export const app = express();

setupSwagger(app);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(compression());

app.use(httpLogger);
// app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);
