import { Application } from 'express';
import testRouter from '../routes/test.route';
import userRouter from '../routes/testuser.route';

export const setupRoutes = (app: Application): void => {
  app.use('/api/test', testRouter);
  app.use('/api/testusers', userRouter);
};