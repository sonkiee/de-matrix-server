import express, { Express } from "express";
import setupSwagger from "./swaggerConfig";

const app = express();

app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
