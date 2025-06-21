import { Application } from "express";
import registerRouter from "../routes/register.route";

export const setupRoutes = (app: Application): void => {
  app.use("/api/register", registerRouter);
};
