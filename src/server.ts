import "dotenv/config";
import { app } from "./app";
import logger from "./config/logger";

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = parseInt(process.env.PORT || "3001");
const HOST = process.env.HOST || "127.0.0.1";

(async () => {
  try {
    logger.info("Testing database connection...");

    const client = await (await import("./db")).pool.connect();
    await client.query("SELECT 1"); // Test the database connection
    client.release();
    logger.info("✅ Postgres connected");

    logger.info("Starting server...");
    app.listen(PORT, HOST, () => {
      logger.info(
        `🚀 Server is running on at http://${HOST}:${PORT} in ${NODE_ENV} mode`,
      );
    });
  } catch (error) {
    logger.error("❌ Error starting server: ", error);
    process.exit(1);
  }
})();
