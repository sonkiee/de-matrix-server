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
import logger from "./config/logger";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import winston from "winston";

dotenv.config();

const app = express();

setupSwagger(app);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(compression());

app.use(logger);
// app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  // Connect to MongoDB database and start the server.
  console.log("Starting server...");
  try {
    await connectDB();
    const NODE_ENV = process.env.NODE_ENV || "development";
    const PORT = parseInt(process.env.PORT || "3001");
    const HOST = process.env.HOST || "127.0.0.1";

    app.listen(PORT, HOST, () => {
      console.log(
        `🚀 Server is running on at http://${HOST}:${PORT} in ${NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.error("❌ Error starting server: ", error);
    process.exit(1);
  }
};

startServer();
