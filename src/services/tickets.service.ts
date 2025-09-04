import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { Post } from "../models/posts.models";
import { Ticket, TicketCategory } from "../models/tickets.model";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { randomInt } from "crypto";

export const createTicket = async (
  leave_me_id: string,
  category: TicketCategory,
  reported_user?: string,
  reported_post?: ObjectId
): Promise<Ticket> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const userCollection = mainDb.collection<User>("users");
    const postsCollection = mainDb.collection<Post>("posts");
    const ticketsCollection = mainDb.collection<Ticket>("tickets");

    if (reported_user) {
      const user = await userCollection.findOne({ leave_me_id: reported_user });

      if (!user) {
        throw { message: "User not found", statusCode: 404 };
      }
    }

    if (reported_user) {
      const post = await postsCollection.findOne({ _id: reported_post });

      if (!post) {
        throw { message: "Post not found", statusCode: 404 };
      }
    }

    const ticketId = `#${String(randomInt(0, 10000)).padStart(4, "0")}-${String(randomInt(0, 10000)).padStart(4, "0")}`;

    const newTicket: Ticket = {
      ticketId: ticketId,
      author: leave_me_id,
      createTime: new Date(),
      category: category,
      participants: [leave_me_id],
      reportedUser: reported_user,
      reportedPost: reported_post,
      closed: false,
      messages: []
    };

    await ticketsCollection.insertOne(newTicket);

    return newTicket;
  } catch (error) {
    logger.error("Error creating ticket:", error);
    throw error;
  }
};
