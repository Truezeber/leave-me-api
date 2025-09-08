import { ObjectId } from "mongodb";

export type TicketCategory = "Report post" | "Report user" | "Delete account" | "Unban request" | "Data request" | "Other";

export interface TicketMessage {
  _id?: ObjectId;
  author: string;
  created_at: Date;
  content: string;
  is_comment: boolean;
}

export interface Ticket {
  _id?: ObjectId;
  ticket_id: string;
  author: string;
  created_at: Date;
  category: TicketCategory;
  participants: string[];
  reported_user?: string;
  reported_post?: ObjectId;
  closed: boolean;
  messages?: TicketMessage[];
}
