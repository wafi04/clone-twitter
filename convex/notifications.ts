import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

export const getMyNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const myNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...myNotifications,
      page: myNotifications.page,
      continueCursor: myNotifications.continueCursor,
      isDone: myNotifications.isDone,
    };
  },
});

// Troubleshooting function
export const checkNotificationsExist = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const userNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    if (userNotifications.length === 0) {
      return null;
    }

    return {
      userNotifications: userNotifications.length,
      userId: userId,
    };
  },
});

export const updateNotifications = mutation({
  args: {
    notifId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const getDataNotifications = await ctx.db.get(args.notifId);

    if (!getDataNotifications) {
      return;
    }
    await ctx.db.patch(args.notifId, {
      isRead: true,
    });

    return "Success";
  },
});
