
import { Server, Socket } from "socket.io";
import { parse } from "cookie";
import { logger } from "./utils/logger.utils";
import { auth } from "./utils/auth.utils";
import { io } from "./index";

export const initSockets = () => {
  io.use((socket: Socket, next) => {
    try {
      const rawCookie = socket.request.headers.cookie;
      if (!rawCookie) return next(new Error("No cookie"));

      const cookies = parse(rawCookie);
      const token = cookies.access_token;

      if (!token || token.trim() === "") {
        return next(new Error("No access token"));
      }

      const verifiedToken = auth.verifyJwt(token) as any;

      const leave_me_id = verifiedToken.leave_me_id;

      socket.data.leave_me_id = leave_me_id;

      next();
    } catch (err) {
      next(new Error("Auth failed"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const leave_me_id = socket.data.leave_me_id;

    if (!leave_me_id) {
      logger.warn("! Socket conneted without leave me id !");
      socket.disconnect();
      return;
    }

    socket.join(leave_me_id);
    logger.info("User connected and room created:", leave_me_id);

    socket.on("disconnect", () => {
      logger.info("User disconnected", leave_me_id);
    });
  });
};

export const sentNotification = (leave_me_id: string, notification: any): void => {
  io.to(leave_me_id).emit("notification", notification);
}
