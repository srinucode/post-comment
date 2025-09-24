import swaggerJsDoc from "swagger-jsdoc";
// @ts-ignore: missing type declarations for swagger-ui-express
const swaggerUi = require("swagger-ui-express");
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Post Service API",
      version: "1.0.0",
      description: "API for managing posts",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/controllers/*.ts"],
};

export const setupSwagger = (app: Express) => {
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
