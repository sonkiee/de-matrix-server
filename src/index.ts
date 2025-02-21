import express from "express";
import cors from "cors";
import hemlet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import setupSwagger from "./swaggerConfig";
import connectDB from "./config/database";
import user from "./routes/user.routes";
import product from "./routes/product.routes";
import category from "./routes/category.routes";
import payment from "./routes/payment.routes";
import order from "./routes/order.routes";
import banner from "./routes/banner.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

setupSwagger(app);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("public/uploads"));

app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/payment", payment);
app.use("/api/orders", order);
app.use("/api/category", category);
app.use("/api/banners", banner);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error starting server: ", error);
    process.exit(1);
  }
};

startServer();
