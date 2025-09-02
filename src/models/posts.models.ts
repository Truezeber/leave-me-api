import { ObjectId } from "mongodb";

export interface Post {
  _id: ObjectId;
  author: string;
  createTime: Date;
  origin: ObjectId | string;
  content: string;
  likes: string[];
  comments: number;
} 
