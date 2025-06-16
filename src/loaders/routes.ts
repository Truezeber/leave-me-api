import { Application } from 'express';
import testRouter from '../routes/test.route';

export const setupRoutes = (app: Application): void => {
  app.use('/api/test', testRouter);
};