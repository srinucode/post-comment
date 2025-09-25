import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Comment Service API",
        version: "1.0.0",
        description: "API documentation for Comment Service",
      },
      servers: [
        {
          url: "http://localhost:3002",
        },
      ],
    },
    apis: ["./src/controllers/*.ts", "./src/routes/*.ts", "./src/docs/*.ts"], // <-- files where Swagger annotations live
  };

  const specs = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
