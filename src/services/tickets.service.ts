import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { Post } from "../models/posts.models";
import { Ticket, TicketCategory, TicketMessage } from "../models/tickets.model";
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

export const message = async (
  leave_me_id: string,
  ticket_id: string,
  content: string,
  is_comment: boolean
): Promise<TicketMessage> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const usersCollection = mainDb.collection<User>("users");
    const user = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;
    let checkedComment = false;

    const ticketsCollection = mainDb.collection<Ticket>("tickets");
    const ticket = await ticketsCollection.findOne({ ticketId: ticket_id });

    if (!ticket) {
      throw { message: "Ticket not found", statusCode: 404 };
    }

    if (user.is_admin) {
      checkedComment = is_comment;
    } else if (ticket.closed) {
      throw { message: "Ticket is closed", statusCode: 403 };
    }

    const isParticipant = ticket.participants.includes(leave_me_id);

    if (!isParticipant) {
      if (user.is_admin) {
        await ticketsCollection.updateOne({ ticketId: ticket_id }, { $push: { participants: leave_me_id } });
      } else {
        throw { message: "You're not a part of this conversation", statusCode: 403 };
      }
    }

    const newMessage: TicketMessage = {
      author: leave_me_id,
      createTime: new Date(),
      content: content,
      isComment: checkedComment
    }

    await ticketsCollection.updateOne({ ticketId: ticket_id }, { $push: { messages: newMessage } });

    return newMessage;
  } catch (error) {
    logger.error("Error creating ticket:", error);
    throw error;
  }
};
