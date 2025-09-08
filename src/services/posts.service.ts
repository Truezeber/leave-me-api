import { User } from "../models/user.model";
import { Post } from "../models/posts.models";
import { logger } from "../utils/logger.utils";
import { relations } from "../utils/relations.utils";
import { ObjectId, Sort } from "mongodb";
import { Notification } from "../models/notifications.model";
import { sendNotification } from "../sockets";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const createPost = async (
  leave_me_id: string,
  origin: ObjectId | string,
  content: string
): Promise<Post> => {
  try {
    dbFunctions.connectionCheck();

    const userCollection = dbCollections.users;
    const postsCollection = dbCollections.posts;
    const notificationsCollection = dbCollections.notifications;

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
      _id: new ObjectId(),
      author: leave_me_id,
      created_at: new Date(),
      origin: origin,
      content: content,
      likes: [],
      comments: 0
    }

    await postsCollection.insertOne(newPost);

    if (origin instanceof ObjectId) {
      const originPost: Post = await postsCollection.findOne({ _id: origin }) as Post;

      const fullContent = newPost.content;
      const maxLength = 100;
      const shortedContent = fullContent.length > maxLength ? fullContent.slice(0, maxLength) + "..." : fullContent;

      const newNotification: Notification = {
        _id: new ObjectId(),
        type: "comment",
        notification_user: leave_me_id,
        clickable_content: origin,
        content: shortedContent,
        created_at: new Date(),
        isSeen: false
      }

      await notificationsCollection.updateOne({ leave_me_id: originPost.author }, { $push: { notifications: newNotification } });
      sendNotification(originPost.author, newNotification);

    }

    return newPost;
  } catch (error) {
    logger.error("Error posting:", error);
    throw error;
  }
};

export const deletePost = async (
  leave_me_id: string,
  post_id: ObjectId
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const postsCollection = dbCollections.posts;

    const post: Post = (await postsCollection.findOne({ _id: post_id })) as Post;

    if (!post) {
      throw { message: "Post not found", statusCode: 404 };
    }

    if (post.author !== leave_me_id) {
      throw { message: "You can't delete someone else's post", statusCode: 403 };
    }

    await postsCollection.deleteOne({ _id: post_id });

    if (ObjectId.isValid(post.origin)) {
      await postsCollection.updateOne(
        { _id: new ObjectId(post.origin) },
        { $inc: { comments: -1 } }
      );
    }

    return "Success";
  } catch (error) {
    logger.error("Error deleting post:", error);
    throw error;
  }
}

export const likePost = async (
  leave_me_id: string,
  post_id: ObjectId
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const postsCollection = dbCollections.posts;
    const notificationsCollection = dbCollections.notifications;

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

    const originPost: Post = await postsCollection.findOne({ _id: post_id }) as Post;

    const fullContent = originPost.content;
    const maxLength = 100;
    const shortedContent = fullContent.length > maxLength ? fullContent.slice(0, maxLength) + "..." : fullContent;

    const newNotification: Notification = {
      _id: new ObjectId(),
      type: "like",
      notification_user: leave_me_id,
      clickable_content: post_id,
      content: shortedContent,
      created_at: new Date(),
      isSeen: false
    }

    await notificationsCollection.updateOne({ leave_me_id: originPost.author }, { $push: { notifications: newNotification } });
    sendNotification(originPost.author, newNotification);

    return "Success";
  } catch (error) {
    logger.error("Error liking the post:", error);
    throw error;
  }
};

export const unlikePost = async (
  leave_me_id: string,
  post_id: ObjectId
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const postsCollection = dbCollections.posts;

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
    logger.error("Error unliking the post:", error);
    throw error;
  }
};

export const loadPosts = async (
  leave_me_id: string,
  origin: ObjectId | string,
  amount: number,
  sort_by: "date" | "likes"
): Promise<Post[]> => {
  try {
    dbFunctions.connectionCheck();

    if (!(origin instanceof ObjectId)) {
      if (origin !== leave_me_id) {
        const areFriends = await relations.areFriends(leave_me_id, origin);

        if (!areFriends) {
          throw { message: "Origin user not found or is not your friend", statusCode: 403 };
        }
      }
    }

    const postsCollection = dbCollections.posts;

    const sort: Sort = sort_by === "likes" ? { likes: -1 } : { createTime: -1 };
    const posts = await postsCollection
      .find({ origin })
      .sort(sort)
      .limit(amount)
      .toArray();

    return posts;
  } catch (error) {
    logger.error("Error fetching posts:", error);
    throw error;
  }
}
