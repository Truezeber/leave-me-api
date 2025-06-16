import { Application } from 'express';
import testRouter from '../routes/test.route';
import userRouter from '../routes/testuser.route';
import registerRouter from '../routes/register.route'

export const setupRoutes = (app: Application): void => {
  app.use('/api/test', testRouter);
  app.use('/api/testusers', userRouter);
  app.use('/api/register', registerRouter);
};