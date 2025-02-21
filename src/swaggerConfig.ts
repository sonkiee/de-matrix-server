import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description:
        "This is a simple API documentation with Swagger and TypeScript",
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
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
