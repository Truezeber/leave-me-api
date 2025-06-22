import { Application } from "express";
import registerRouter from "../routes/register.route";
import loginRouter from "../routes/login.route";
import logoutRouter from "../routes/logout.route";

export const setupRoutes = (app: Application): void => {
  app.use("/api/register", registerRouter);
  app.use("/api/login", loginRouter);
  app.use("/api/logout", logoutRouter);
};
