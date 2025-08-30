import { Application } from "express";
import registerRouter from "../routes/register.route";
import loginRouter from "../routes/login.route";
import logoutRouter from "../routes/logout.route";
import friendsRouter from "../routes/friends.route";
import blockRouter from "../routes/block.route";
import verifyRouter from "../routes/verify.route";

export const setupRoutes = (app: Application): void => {
  app.use("/api/v1/register", registerRouter);
  app.use("/api/v1/login", loginRouter);
  app.use("/api/v1/logout", logoutRouter);
  app.use("/api/v1/friends", friendsRouter);
  app.use("/api/v1/block", blockRouter);
  app.use("/api/v1/auth", verifyRouter);
};
