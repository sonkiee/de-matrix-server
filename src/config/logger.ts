import morgan from "morgan";

const isProduction = process.env.NODE_ENV === "production";

const logger = morgan(isProduction ? "combined" : "dev");

export default logger;
