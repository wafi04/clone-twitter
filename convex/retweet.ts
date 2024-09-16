import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const createRetweet = mutation({
  args: {
    status: v.id("status"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (userId === null) {
      throw new Error("Unauthorized");
    }

    if (!args.status) {
      throw new Error("Either status or comment must be provided");
    }
    const dataStatus = await ctx.db.get(args.status);

    if (!dataStatus) {
      throw new Error("Post not Found");
    }
    const user = await ctx.db.get(dataStatus.creater);

    if (!user) {
      throw new Error("user not Found");
    }

    const existingRetweet = await ctx.db
      .query("retweet")
      .withIndex("by_retweeter_status", (q) =>
        q.eq("retweeter", userId).eq("status", args.status)
      )
      .first();

    if (existingRetweet) {
      // Unlike
      await ctx.db.delete(existingRetweet._id);

      // Delete the corresponding notification
      const notificationToDelete = await ctx.db
        .query("notifications")
        .withIndex("by_recipient_and_type", (q) =>
          q.eq("recipientId", dataStatus.creater).eq("type", "retweet")
        )
        .filter((q) =>
          q.and(
            q.eq(q.field("actorId"), userId),
            q.eq(q.field("statusId"), args.status)
          )
        )
        .first();

      if (notificationToDelete) {
        await ctx.db.delete(notificationToDelete._id);
      }

      return { action: "unRetweet", retwetId: existingRetweet._id };
    } else {
      // Like
      const newLikeId = await ctx.db.insert("retweet", {
        retweeter: userId,
        status: args.status,
        rettweet: true,
      });
      if (userId !== dataStatus.creater) {
        const recepient = await ctx.db.get(dataStatus.creater);
        await ctx.db.insert("notifications", {
          actorId: userId,
          isRead: false,
          recipientId: dataStatus.creater,
          recepientName: recepient?.name,
          statusId: args.status,
          type: "retweet",
          content: `${user.name} retweet your Post`,
        });
        return { action: "retweet", likeId: newLikeId };
      }
    }
  },
});
export const getRetweetStatus = query({
  args: {
    status: v.id("status"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return undefined;
    }

    if (!args.status) {
      throw new Error("Either status or comment must be provided");
    }

    const existingRtweet = await ctx.db
      .query("retweet")
      .withIndex("by_retweeter_status", (q) =>
        q.eq("retweeter", userId).eq("status", args.status)
      )
      .first();

    const getRetweetFromStatus = await ctx.db
      .query("retweet")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
    if (!existingRtweet && getRetweetFromStatus.length === 0) {
      return undefined;
    }
    return {
      getData: existingRtweet !== null,
      getRetweetFromStatus: getRetweetFromStatus ?? [], // Mengembalikan array kosong jika getLikeFromStatus null
    };
  },
});

export const getAllRtweeterByUser = query({
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
      .query("retweet")
      .withIndex("by_retweeter", (q) => q.eq("retweeter", user._id))
      .order("desc")
      .paginate(args.paginationOpts);

    const dataStatus = await Promise.all(
      status.page.map(async (item) => {
        const [creator, parentStatus] = await Promise.all([
          ctx.db.get(item.retweeter),
          ctx.db.get(item.status),
        ]);

        if (!creator || !parentStatus) {
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
