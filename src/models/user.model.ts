import { z } from 'zod/v4'
import { ObjectId } from "mongodb";

export const userRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  nickname: z.string().min(3).max(20),
  leave_me_id: z.string().min(3).max(10).startsWith('@'),
  avatar_url: z.url(),
  tos_accepted: z.boolean(),
  pp_accepted: z.boolean(),
})

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  nickname: string;
  leave_me_id: string;
  status: string;
  avatar_url: string;
  background_url: string;
  friends: string[];
  invites_get: string[];
  invites_sent: string[];
  blocked: string[];
  visibility: string;
  badges: string[];
  points: number;
  is_banned: boolean;
  is_admin: boolean;
  tos_accepted: boolean;
  pp_accepted: boolean;
  join_date: Date;
}

export type UserRegister = z.infer<typeof userRegisterSchema>;
