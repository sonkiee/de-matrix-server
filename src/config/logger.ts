import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const logger = morgan(isProduction ? "combined" : "dev");

export default logger;
