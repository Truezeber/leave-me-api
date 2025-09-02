import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { Post } from "../models/posts.models";
import { logger } from "../utils/logger.utils";
import { relations } from "../utils/relations.utils";
import { ObjectId } from "mongodb";

export const createPost = async (
  leave_me_id: string,
  origin: ObjectId | string,
  content: string
): Promise<Post> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const userCollection = mainDb.collection<User>("users");
    const postsCollection = mainDb.collection<Post>("posts");

    if (origin instanceof ObjectId) {
      const originPost: Post = (await postsCollection.findOne({ _id: origin })) as Post;

      if (!originPost) {
        throw { message: "Origin not found", statusCode: 404 };
      } else {
        await postsCollection.updateOne({ _id: origin }, { $inc: { comments: 1 } });
      }
    } else {
      if (leave_me_id === origin) {
        throw { message: "You can't post on your own profile", statusCode: 403 };
      }

      const friend: User = (await userCollection.findOne({ leave_me_id: origin })) as User;

      if (!friend) {
        throw { message: "Origin not found", statusCode: 404 };
      }

      const userBlocked = await relations.isBlocked(origin, leave_me_id);

      if (userBlocked) {
        throw { message: "User blocked you", statusCode: 403 };
      }

      const originBlocked = await relations.isBlocked(leave_me_id, origin);

      if (originBlocked) {
        throw { message: "You blocked the user", statusCode: 403 };
      }

      const areFriends = await relations.areFriends(leave_me_id, origin);

      if (!areFriends) {
        throw { message: "You are not a friend of the user", statusCode: 403 };
      }
    }

    const newPost: Post = {
      author: leave_me_id,
      createTime: new Date(),
      origin: origin,
      content: content,
      likes: [],
      comments: 0
    }

    await postsCollection.insertOne(newPost);

    return newPost;
  } catch (error) {
    logger.error("Error posting:", error);
    throw error;
  }
};


