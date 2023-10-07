import fs from "fs";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerConfig = (app) => {
  const file = fs.readFileSync("./swagger.yaml", "utf8");
  const swaggerDocument = YAML.parse(file);

  const openapiSpecification = swaggerJsdoc({
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Hello world',
            version: '1.0.2'
        },
    },
    apis: ['./src/routes/*.routes.js']
  });

  app.use("/docs/api", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
};
