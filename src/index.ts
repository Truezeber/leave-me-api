import express from 'express';
import testRouter from './routes/test.route';
import { errorHandler } from './middlewares/error.middleware';
import { config } from './config/app.config';
import { logger } from './utils/logger';

const app = express();
const PORT = config.port;

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Leave Me API',
      version: '1.0.0',
      description: 'Leave Me API Documentation',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use('/api/test', testRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});