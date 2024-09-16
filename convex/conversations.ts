import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

export const createConversation = mutation({
  args: {
    participants: v.array(v.id("users")),
    isGroup: v.optional(v.boolean()),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    let groupImage;
    if (args.groupImage) {
      groupImage = (await ctx.storage.getUrl(args.groupImage)) as string;
    }
    const conversationId = await ctx.db.insert("conversations", {
      participants: args.participants,
      isGroup: args.isGroup ?? false,
      groupName: args.groupName,
      groupImage,
      admin: args.isGroup ? userId : undefined,
    });

    return conversationId;
  },
});

export const getMyConversations = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", identity))
      .unique();

    if (!user) throw new ConvexError("User not found");

    const conversations = await ctx.db.query("conversations").collect();

    const myConversations = conversations.filter((conversation) => {
      return conversation.participants.includes(user._id);
    });

    const conversationsWithDetails = await Promise.all(
      myConversations.map(async (conversation) => {
        let userDetails = {};

        if (!conversation.isGroup) {
          const otherUserId = conversation.participants.find(
            (id) => id !== user._id
          );
          const userProfile = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), otherUserId))
            .take(1);

          userDetails = userProfile[0];
        }

        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .take(1);

        return {
          ...userDetails,
          ...conversation,
          lastMessage: lastMessage[0] || null,
        };
      })
    );

    return conversationsWithDetails;
  },
});

export const getConversationById = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    if (!conversation.participants.includes(userId)) {
      throw new ConvexError("You are not a participant in this conversation");
    }

    let participantProfiles: any[] = [];
    let adminProfile;

    // Fetch admin profile if conversation is a group
    if (conversation.isGroup && conversation.admin) {
      adminProfile = await ctx.db.get(conversation.admin as Id<"users">);
    }

    if (!conversation.isGroup) {
      // Get the other participant (non-admin)
      const otherUserId = conversation.participants.find((id) => id !== userId);
      const otherUserProfile = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), otherUserId))
        .unique();

      participantProfiles = [otherUserProfile];
    } else {
      // Fetch profiles for all participants
      participantProfiles = await Promise.all(
        conversation.participants.map(async (participantId) => {
          const userProfile = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), participantId))
            .unique();
          return userProfile;
        })
      );
    }

    // Flatten participant profiles array if needed
    participantProfiles = participantProfiles.flat();

    // Return the conversation with admin and participant profiles
    return {
      ...conversation,
      participants: participantProfiles,
      adminProfile,
    };
  },
});

export const deleteMember = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);

    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (conversation.admin !== currentUserId) {
      throw new Error("Only the admin can remove members");
    }

    if (!conversation.participants.includes(args.userId)) {
      throw new Error("User is not a member of this conversation");
    }

    // Remove the user from the participants array
    const updatedParticipants = conversation.participants.filter(
      (id) => id !== args.userId
    );

    // Update the conversation
    await ctx.db.patch(args.conversationId, {
      participants: updatedParticipants,
    });

    // Delete all messages from this user in this conversation
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), args.conversationId),
          q.eq(q.field("sender"), args.userId)
        )
      )
      .collect();

    // Delete messages in batches
    const batchSize = 100;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      await Promise.all(batch.map((message) => ctx.db.delete(message._id)));
    }

    return { success: true, removedMessagesCount: messages.length };
  },
});

export const getConversationsWithUnreadCount = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Fetch all conversations for the user
    const conversations = await ctx.db.query("conversations").collect();

    const myConversations = conversations.filter((conversation) => {
      return conversation.participants.includes(userId);
    });

    // Check for unread messages in each conversation
    const conversationsWithUnreadStatus = await Promise.all(
      myConversations.map(async (conversation) => {
        const hasUnreadMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .filter((q) =>
            q.and(
              q.eq(q.field("isRead"), false),
              q.neq(q.field("sender"), userId)
            )
          )
          .take(1); // We only need to check if there's at least one unread message

        return {
          conversation: conversation,
          hasUnread: hasUnreadMessages.length > 0 ? 1 : 0,
        };
      })
    );

    // Count the number of conversations with unread messages
    const unreadCount = conversationsWithUnreadStatus.reduce(
      (count, conv) => count + conv.hasUnread,
      0
    );

    if (unreadCount === 0) {
      return null;
    }

    return { unreadCount };
  },
});
