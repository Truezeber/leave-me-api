import { ObjectId } from "mongodb";

export type TicketCategory = "Report post" | "Report user" | "Delete account" | "Unban request" | "Data request" | "Other";

export interface TicketMessage {
  _id?: ObjectId;
  author: string;
  createTime: Date;
  content: string;
  isComment: boolean;
}

export interface Ticket {
  _id?: ObjectId;
  ticketId: string;
  author: string;
  createTime: Date;
  category: TicketCategory;
  participants: string[];
  reportedUser?: string;
  reportedPost?: ObjectId[];
  closed: boolean;
  messages?: TicketMessage[];
}
