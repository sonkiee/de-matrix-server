import express, { Express } from "express";
import setupSwagger from "./swaggerConfig";
import connectDB from "./config/db";

const app = express();

app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});

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
