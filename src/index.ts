import express from 'express';
import testRouter from './routes/test.route';
import { errorHandler } from './middlewares/error.middleware';
import { config } from './config/app.config';
import { logger } from './utils/logger';
import { swaggerOptions } from './config/swagger.config';

const app = express();
const PORT = config.port;

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use('/api/test', testRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});