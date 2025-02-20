import express, { Express } from "express";
import setupSwagger from "./swaggerConfig";
import connectDB from "./config/database";
import user from "./routes/user.routes";
import product from "./routes/product.routes";
import category from "./routes/category.routes";
import payment from "./routes/payment.routes";

const app = express();

app.use(express.json());

setupSwagger(app);

app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/payment", payment);
app.use("/api/category", category);

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
