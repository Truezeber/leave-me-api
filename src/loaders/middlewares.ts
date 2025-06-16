import { Application } from 'express';
import express from 'express';
import { errorHandler } from '../middlewares/error.middleware';

export const setupMiddlewares = (app: Application): void => {
  app.use(express.json());
  app.use(errorHandler);
};