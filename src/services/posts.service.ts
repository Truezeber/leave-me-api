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
      }

      const isBlocked = await relations.isBlocked(leave_me_id, originPost.author);
      const isBlocking = await relations.isBlocked(originPost.author, leave_me_id);

      if (isBlocked || isBlocking) {
        throw { message: "You are blocked or blocking the user", statusCode: 403 };
      }

      await postsCollection.updateOne({ _id: origin }, { $inc: { comments: 1 } });
    } else {
      if (leave_me_id === origin) {
        throw { message: "You can't post on your own profile", statusCode: 403 };
      }

      const friend: User = (await userCollection.findOne({ leave_me_id: origin })) as User;

      if (!friend) {
        throw { message: "Origin not found", statusCode: 404 };
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

export const likePost = async (
  leave_me_id: string,
  post_id: ObjectId
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const postsCollection = mainDb.collection<Post>("posts");

    const post: Post = (await postsCollection.findOne({ _id: post_id })) as Post;

    if (!post) {
      throw { message: "Post not found", statusCode: 404 };
    }

    const isBlocked = await relations.isBlocked(leave_me_id, post.author);

    if (isBlocked) {
      throw { message: "You are blocked by this user", statusCode: 403 };
    }

    const isBlocking = await relations.isBlocked(post.author, leave_me_id);

    if (isBlocking) {
      throw { message: "You are blocking this user", statusCode: 403 };
    }

    if (post.likes.includes(leave_me_id)) {
      throw { message: "You are already liking this post", statusCode: 409 };
    }

    await postsCollection.updateOne(
      { _id: post_id },
      { $addToSet: { likes: leave_me_id } }
    )

    return "Success";
  } catch (error) {
    logger.error("Error likeing the post:", error);
    throw error;
  }
};

export const unlikePost = async (
  leave_me_id: string,
  post_id: ObjectId
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const postsCollection = mainDb.collection<Post>("posts");

    const post: Post = (await postsCollection.findOne({ _id: post_id })) as Post;

    if (!post) {
      throw { message: "Post not found", statusCode: 404 };
    }

    if (!post.likes.includes(leave_me_id)) {
      throw { message: "You are not liking this post", statusCode: 409 };
    }

    await postsCollection.updateOne(
      { _id: post_id },
      { $pull: { likes: leave_me_id } }
    )

    return "Success";
  } catch (error) {
    logger.error("Error unlikeing the post:", error);
    throw error;
  }
};

