import { ObjectId } from "mongodb";

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
  category: "Report post" | "Report user" | "Delete account" | "Unban request" | "Data request" | "Other";
  participants: string;
  reportedUser?: string;
  reportedPost?: string;
  closed: boolean;
  messages: TicketMessage[];
}
