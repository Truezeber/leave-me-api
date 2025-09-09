import { User } from "../models/user.model";
import { Ticket, TicketCategory, TicketMessage } from "../models/tickets.model";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { randomInt } from "crypto";
import { Notification } from "../models/notifications.model";
import { sendNotification } from "../sockets";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const createTicket = async (
  leave_me_id: string,
  category: TicketCategory,
  reported_user?: string,
  reported_post?: ObjectId
): Promise<Ticket> => {
  try {
    dbFunctions.connectionCheck();

    const userCollection = dbCollections.users;
    const postsCollection = dbCollections.posts;
    const ticketsCollection = dbCollections.tickets;

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
      ticket_id: ticketId,
      author: leave_me_id,
      created_at: new Date(),
      category: category,
      participants: [leave_me_id],
      reported_user: reported_user,
      reported_post: reported_post,
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
    dbFunctions.connectionCheck();

    const usersCollection = dbCollections.users;
    const ticketsCollection = dbCollections.tickets;

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
    dbFunctions.connectionCheck();

    const usersCollection = dbCollections.users;
    const ticketsCollection = dbCollections.tickets;
    const notificationsCollection = dbCollections.notifications;

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
      created_at: new Date(),
      content: content,
      is_comment: checkedComment
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
          created_at: new Date(),
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
    dbFunctions.connectionCheck();

    const ticketsCollection = dbCollections.tickets;
    const usersCollection = dbCollections.users;

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
    dbFunctions.connectionCheck();

    const ticketsCollection = dbCollections.tickets;
    const usersCollection = dbCollections.users;

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
          last_message_date: { $max: "$messages.created_at" }
        }
      },
      { $sort: { last_message_date: sortDirection } },
      { $limit: amount }
    ]).toArray() as unknown as Ticket[];

    return tickets;
  } catch (error) {
    logger.error("Error fetching tickets:", error);
    throw error;
  }
}

