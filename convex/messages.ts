import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const sendTextMessage = mutation({
  args: {
    content: v.string(),
    conversation: v.id("conversations"),
    image: v.optional(v.id("_storage")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversation))
      .first();

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    if (!conversation.participants.includes(user._id)) {
      throw new ConvexError("You are not part of this conversation");
    }

    let image;

    if (args.image) {
      image = (await ctx.storage.getUrl(args.image)) as string;
    }
    await ctx.db.insert("messages", {
      sender: user._id,
      body: args.content,
      conversationId: args.conversation,
      imageId: args.image,
      image: image,
      isRead: false,
      parentmessageId: args.parentMessageId,
    });
  },
});
export const getAllMessages = query({
  args: {
    conversationId: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    // Fetch conversation to get participants
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    // Check if the user is a participant
    if (!conversation.participants.includes(userId)) {
      throw new ConvexError("You are not a participant in this conversation");
    }

    // Fetch all messages for the conversation with pagination
    const messagesQuery = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .paginate(args.paginationOpts);

    const userProfileCache = new Map();

    // Process messages to include sender and reply information
    const results = await Promise.all(
      messagesQuery.page.map(async (message) => {
        let sender = userProfileCache.get(message.sender);
        if (!sender) {
          sender = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), message.sender))
            .unique();
          if (sender) {
            userProfileCache.set(message.sender, sender);
          }
        }

        let parrentMessages = null;
        if (message.parentmessageId) {
          parrentMessages = await ctx.db.get(message.parentmessageId);
        }

        return { ...message, sender, parrentMessages };
      })
    );

    // Fetch participant profiles
    const participantProfiles = await Promise.all(
      conversation.participants.map(async (participantId) => {
        const profile = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), participantId))
          .unique();
        return profile;
      })
    );

    return {
      ...results,
      page: results,
      isDone: messagesQuery.isDone,
      continueCursor: messagesQuery.continueCursor,
      participants: participantProfiles.filter(Boolean),
    };
  },
});

export const deleteMessages = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("UNAUTHORIZED");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message || user !== message.sender) {
      throw new Error("Something Went Wrong");
    }

    await ctx.db.delete(message._id);

    if (message.imageId) {
      await ctx.storage.delete(message.imageId);
    }

    return "Delete Success";
  },
});

export const editMessages = mutation({
  args: {
    messages: v.object({
      messageId: v.optional(v.id("messages")),
      body: v.optional(v.string()),
      image: v.optional(v.id("_storage")),
    }),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);
    if (!user) {
      return;
    }
    let image;

    if (args.messages.image) {
      image = (await ctx.storage.getUrl(args.messages.image)) as string;
    }

    if (args.messages.messageId) {
      await ctx.db.patch(args.messages.messageId, {
        body: args.messages.body,
        image,
        imageId: args.messages.image,
      });
    }

    return "Success To edit ";
  },
});

export const getAllMessagesUnread = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const unreadCount = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(q.eq(q.field("isRead"), false), q.neq(q.field("sender"), user))
      )
      .collect();

    if (unreadCount.length === 0) {
      return null;
    }

    return { count: unreadCount };
  },
});
export const getAllMessageCountUnread = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const unreadCount = await ctx.db
      .query("messages")

      .filter((q) =>
        q.and(q.eq(q.field("isRead"), false), q.neq(q.field("sender"), user))
      )
      .collect();

    if (unreadCount.length === 0) {
      return null;
    }

    return { count: unreadCount };
  },
});

export const updateMessagesInConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // Fetch all unread messages in the conversation not sent by the current user
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("isRead"), false),
          q.neq(q.field("sender"), currentUser)
        )
      )
      .collect();

    // Update all fetched messages to read
    await Promise.all(
      unreadMessages.map(async (message) => {
        await ctx.db.patch(message._id, {
          isRead: true,
        });
      })
    );

    return `Updated ${unreadMessages.length} messages to read in conversation ${args.conversationId}`;
  },
});
