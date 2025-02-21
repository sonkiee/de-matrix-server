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
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
