import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";

export const createQuote = mutation({
  args: {
    content: v.string(),
    statusId: v.id("status"),
  },
  handler: async (ctx, args) => {
    const { content, statusId } = args;
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to create a quote");
    }

    const status = await ctx.db.get(statusId);
    if (!status) {
      throw new Error("Status not found");
    }

    const quoter = await ctx.db.get(userId);
    if (!quoter) {
      throw new Error("Quoter not found");
    }

    const quoteId = await ctx.db.insert("quote", {
      content,
      quoter: userId,
      statusId,
    });
    if (userId !== status.creater) {
      const recepient = await ctx.db.get(status.creater);
      await ctx.db.insert("notifications", {
        actorId: userId,
        isRead: false,
        recipientId: status.creater,
        recepientName: recepient?.name,
        type: "quote",
        content: `${quoter.name || "Someone"} quoted your post`,
        statusId: status._id,
      });
    }

    return { success: true, quoteId };
  },
});
export const getQuoteByPost = query({
  args: {
    status: v.id("status"),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const getCount = await ctx.db
      .query("quote")
      .withIndex("by_status", (q) => q.eq("statusId", args.status))
      .collect();

    return getCount;
  },
});

export const getAllQuoteByUser = query({
  args: {
    name: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);

    if (!currentUser) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const status = await ctx.db
      .query("quote")
      .withIndex("by_quoter", (q) => q.eq("quoter", user._id))
      .order("desc")
      .paginate(args.paginationOpts);

    const dataStatus = await Promise.all(
      status.page.map(async (item) => {
        const [creator, parentStatus] = await Promise.all([
          ctx.db.get(item.quoter),
          ctx.db.get(item.statusId),
        ]);

        if (!creator) {
          throw new Error("Unautohroized");
        }
        if (!parentStatus) {
          throw new Error("Unautohroized");
        }

        return {
          ...item,
          creator,
          replies: {
            ...parentStatus,
            creator,
          },
        };
      })
    );

    return {
      ...status,
      page: dataStatus,
      continueCursor: status.continueCursor,
      isDone: status.isDone,
    };
  },
});

export const deleteQuote = mutation({
  args: {
    quoteId: v.id("quote"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: User must be logged in to delete a quote");
    }

    const quote = await ctx.db.get(args.quoteId);
    if (!quote) {
      throw new Error("Quote not found");
    }

    if (quote.quoter !== userId) {
      throw new Error("Unauthorized: User can only delete their own quotes");
    }

    const notificationToDelete = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_and_type", (q) =>
        q.eq("recipientId", quote.quoter).eq("type", "quote")
      )
      .filter((q) => q.eq(q.field("actorId"), userId))
      .first();

    if (notificationToDelete) {
      await ctx.db.delete(notificationToDelete._id);
    }

    await ctx.db.delete(args.quoteId);

    return {
      success: true,
      message: "Quote and associated notification deleted successfully",
    };
  },
});
