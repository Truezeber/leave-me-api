import { io } from "./index";
import { auth } from "./utils/auth.utils";
import { logger } from "./utils/logger.utils";

io.on("connection", (socket) => {
  const token = socket.handshake.auth?.token;

  let payload;
  try {
    payload = auth.verifyJwt(token);
    if (!payload || payload === "expired") throw new Error("Unauthorized");
  } catch (err) {
    socket.emit("error", { message: "Unauthorized" });
    socket.disconnect();
    return;
  }
  const userRoom = payload.leave_me_id;
  socket.join(userRoom);
  logger.info(`User ${userRoom} connected via socket.io`);
});
