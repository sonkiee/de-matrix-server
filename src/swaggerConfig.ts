import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FTL Express API",
      version: "1.0.0",
      description:
        "FTL E-commerce API documentation with Swagger and TypeScript",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: any) => {
  // Swagger docs will be accessible at /doc
  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // You can also make Swagger docs available at /api as an alternative.
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
