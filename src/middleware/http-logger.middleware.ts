import morgan from "morgan";
import logger from "../config/logger";

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const httpLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
  { stream },
);

export default httpLogger;
