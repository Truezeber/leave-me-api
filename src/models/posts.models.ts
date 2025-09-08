import { ObjectId } from "mongodb";

export interface Post {
  _id?: ObjectId;
  author: string;
  created_at: Date;
  origin: ObjectId | string;
  content: string;
  likes: string[];
  comments: number;
} 
