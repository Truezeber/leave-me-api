import { Application } from "express";
import registerRouter from "../routes/register.route";
import loginRouter from "../routes/login.route";

export const setupRoutes = (app: Application): void => {
  app.use("/api/register", registerRouter);
  app.use("/api/login", loginRouter);
};
