import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";
import { JwtPayload } from "../models/auth.models";
import { randomBytes } from "crypto";

export const auth = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
  generateJwt(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwtSecret as string, {
      expiresIn: "1h",
    });
  },
  verifyJwt(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.jwtSecret as string) as JwtPayload;
    } catch {
      return null;
    }
  },
  generateRefreshToken(): string {
    return randomBytes(64).toString("hex");
  },
};
