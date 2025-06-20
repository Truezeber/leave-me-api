import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

export const auth = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
