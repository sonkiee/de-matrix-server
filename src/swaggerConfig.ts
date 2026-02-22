import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

export default function setupSwagger(app: Express) {
  const specPath = path.join(process.cwd(), "openapi.yaml");
  const swaggerDocument = YAML.load(specPath);

  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
