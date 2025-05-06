import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import compression from "compression";
import dotenv from "dotenv";
import { globalLimiter } from "./config/limiter";
import setupSwagger from "./swaggerConfig";
import connectDB from "./config/database";
import user from "./routes/user.routes";
import product from "./routes/product.routes";
import category from "./routes/category.routes";
import payment from "./routes/payment.routes";
import order from "./routes/order.routes";
import banner from "./routes/banner.routes";
import index from "./routes/index.routes";
import admin from "./routes/admin.routes";
import address from "./routes/location.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { corsOptions } from "./config/cors";
import logger from "./config/logger";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

setupSwagger(app);

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());

app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(compression());

app.use(logger);
// app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("public/uploads"));
app.use("/", index);
app.use("/api", index);
app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/payment", payment);
app.use("/api/orders", order);
app.use("/api/categories", category);
app.use("/api/banners", banner);
app.use("/api/admin", admin);
app.use("/api/user/address", address);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const NODE_ENV = process.env.NODE_ENV || "development";
    const PORT = parseInt(process.env.PORT || "3000", 10);
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
