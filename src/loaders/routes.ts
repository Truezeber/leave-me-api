import { Application } from "express";
import registerRouter from "../routes/register.route";
import loginRouter from "../routes/login.route";
import logoutRouter from "../routes/logout.route";
import friendsRouter from "../routes/friends.route";
import blockRouter from "../routes/block.route"

export const setupRoutes = (app: Application): void => {
  app.use("/api/register", registerRouter);
  app.use("/api/login", loginRouter);
  app.use("/api/logout", logoutRouter);
  app.use("/api/friends", friendsRouter);
  app.use("/api/block", blockRouter);
};
