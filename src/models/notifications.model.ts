import { ObjectId } from "mongodb";

export interface Notification {
  _id?: ObjectId;
  type: "like" | "comment" | "invite" | "ban" | "ticket";
  content: string;
  createdAt: Date;
  isSeen: boolean;
}

export interface Notifier {
  _id?: ObjectId;
  leave_me_id: string,
  notifications: Notification[];
}
