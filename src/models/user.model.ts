import { ObjectId } from "mongodb";
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
  refresh_tokens: string[];
}

export interface UserRegister {
  email: string;
  password: string;
  nickname: string;
  leave_me_id: string;
  avatar_url: string;
  tos_accepted: boolean;
  pp_accepted: boolean;
}
