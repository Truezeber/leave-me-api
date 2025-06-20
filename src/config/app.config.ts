import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoURI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/leave-me-api",
  dbName: process.env.DB_NAME || "leave-me-api",
  jwtSecret: process.env.JWT_SECRET || "NO_JWT",
};
