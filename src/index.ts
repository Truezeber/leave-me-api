import express from 'express';
import testRouter from './routes/test.route';
import { errorHandler } from './middlewares/error.middleware';
import { config } from './config/app.config';
import { logger } from './utils/logger';

const app = express();
const PORT = config.port;

app.use(express.json());

app.use('/api/test', testRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});