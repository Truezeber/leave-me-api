import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { Post } from "../models/posts.models";
import { Ticket, TicketCategory, TicketMessage } from "../models/tickets.model";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { randomInt } from "crypto";
import { Notifier, Notification } from "../models/notifications.model";
import { sendNotification } from "../sockets";

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

    if (reported_post) {
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

export const closeTicket = async (
  leave_me_id: string,
  ticket_id: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const usersCollection = mainDb.collection<User>("users");
    const ticketsCollection = mainDb.collection<Ticket>("tickets");

    const user = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!user.is_admin) {
      throw { message: "Only admins can close tickets", statusCode: 403 };
    }

    const ticket = await ticketsCollection.findOne({ ticketId: ticket_id });

    if (!ticket) {
      throw { message: "Ticket not found", statusCode: 404 };
    }

    await ticketsCollection.updateOne({ ticketId: ticket_id }, { $set: { closed: true } });

    return "Success";
  } catch (error) {
    logger.error("Error closing a ticket:", error);
    throw error;
  }
}

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
    const ticketsCollection = mainDb.collection<Ticket>("tickets");
    const notificationsCollection = mainDb.collection<Notifier>("notifications");

    const user = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;
    const ticket = await ticketsCollection.findOne({ ticketId: ticket_id });

    let checkedComment = false;


    if (!ticket) {
      throw { message: "Ticket not found", statusCode: 404 };
    }

    if (user.is_admin) {
      checkedComment = is_comment;
    } else if (ticket.closed) {
      throw { message: "Ticket is closed or you're not a part of it", statusCode: 403 };
    }

    const isParticipant = ticket.participants.includes(leave_me_id);

    if (!isParticipant) {
      if (user.is_admin) {
        await ticketsCollection.updateOne({ ticketId: ticket_id }, { $push: { participants: leave_me_id } });
      } else {
        throw { message: "Ticket is closed or you're not a part of it", statusCode: 403 };
      }
    }

    const newMessage: TicketMessage = {
      author: leave_me_id,
      createTime: new Date(),
      content: content,
      isComment: checkedComment
    }

    await ticketsCollection.updateOne({ ticketId: ticket_id }, { $push: { messages: newMessage } });

    const longContent = content;
    const maxLength = 100;
    const shortedContent = longContent.length > maxLength ? longContent.slice(0, maxLength) + "..." : longContent;

    for (const ticketParticipant of ticket.participants) {
      if (ticketParticipant !== leave_me_id) {
        const newNotification: Notification = {
          _id: new ObjectId(),
          type: "ticket",
          notification_user: ticketParticipant,
          clickable_content: ticket_id,
          content: shortedContent,
          createdAt: new Date(),
          isSeen: false
        }

        await notificationsCollection.updateOne({ leave_me_id: ticketParticipant }, { $push: { notifications: newNotification } });
        sendNotification(ticketParticipant, newNotification);
      }
    }

    return newMessage;
  } catch (error) {
    logger.error("Error creating ticket:", error);
    throw error;
  }
};

export const loadTicket = async (
  leave_me_id: string,
  ticket_id: string
): Promise<Ticket> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const ticketsCollection = mainDb.collection<Ticket>("tickets");
    const usersCollection = mainDb.collection<User>("users");

    const user = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;
    const ticket = await ticketsCollection.findOne({ ticketId: ticket_id });

    if (!ticket) {
      throw { message: "Ticket not found or you're not a part of it", statusCode: 404 };
    }

    const isParticipant = ticket.participants.includes(leave_me_id);

    if (!user.is_admin && !isParticipant) {
      throw { message: "Ticket not found or you're not a part of it", statusCode: 403 };
    }

    return ticket;
  } catch (error) {
    logger.error("Error fetching ticket:", error);
    throw error;
  }
}

export const loadTickets = async (
  leave_me_id: string,
  amount: number,
  sort_by: "newest" | "oldest"
): Promise<Ticket[]> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const ticketsCollection = mainDb.collection<Ticket>("tickets");
    const usersCollection = mainDb.collection<User>("users");

    const user = await usersCollection.findOne({ leave_me_id }) as User;

    const sortDirection = sort_by === "newest" ? -1 : 1;

    const tickets = await ticketsCollection.aggregate([
      {
        $match: user.is_admin
          ? {}
          : { participants: leave_me_id }
      },
      {
        $addFields: {
          lastMessageDate: { $max: "$messages.createTime" }
        }
      },
      { $sort: { lastMessageDate: sortDirection } },
      { $limit: amount }
    ]).toArray() as unknown as Ticket[];

    return tickets;
  } catch (error) {
    logger.error("Error fetching tickets:", error);
    throw error;
  }
}

