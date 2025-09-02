import { Application } from "express";
import registerRouter from "../routes/register.route";
import loginRouter from "../routes/login.route";
import logoutRouter from "../routes/logout.route";
import friendsRouter from "../routes/friends.route";
import blockRouter from "../routes/block.route";
import verifyRouter from "../routes/verify.route";
import settingsRouter from "../routes/settings.route"

export const setupRoutes = (app: Application): void => {
  app.use("/api/v1/auth", registerRouter);
  app.use("/api/v1/auth", loginRouter);
  app.use("/api/v1/auth", logoutRouter);
  app.use("/api/v1/friends", friendsRouter);
  app.use("/api/v1/block", blockRouter);
  app.use("/api/v1/auth", verifyRouter);
  app.use("/api/v1/settings", settingsRouter);
};
