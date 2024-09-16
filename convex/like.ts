import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { UserData } from "./types";

export const createLike = mutation({
  args: {
    statusId: v.id("status"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error(
        "Unauthorized: User must be logged in to like/unlike a status"
      );
    }

    const status = await ctx.db.get(args.statusId);
    if (!status) {
      throw new Error("Status not found");
    }

    const liker = await ctx.db.get(userId);
    if (!liker) {
      throw new Error("User not found");
    }

    const existingLike = await ctx.db
      .query("like")
      .withIndex("by_liker_status", (q) =>
        q.eq("liker", userId).eq("statusId", args.statusId)
      )
      .first();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);

      // Delete the corresponding notification only if the liker is not the status creator
      const notificationToDelete = await ctx.db
        .query("notifications")
        .withIndex("by_recipient_and_type", (q) =>
          q.eq("recipientId", status.creater).eq("type", "like")
        )
        .filter((q) =>
          q.and(
            q.eq(q.field("actorId"), userId),
            q.eq(q.field("statusId"), args.statusId)
          )
        )
        .first();

      if (notificationToDelete) {
        await ctx.db.delete(notificationToDelete._id);
      }

      return { action: "unliked", likeId: existingLike._id };
    } else {
      // Like
      const newLikeId = await ctx.db.insert("like", {
        liker: userId,
        statusId: args.statusId,
        like: true,
      });

      if (userId !== status.creater) {
        const recepient = await ctx.db.get(status.creater);
        await ctx.db.insert("notifications", {
          actorId: userId,
          isRead: false,
          recipientId: status.creater,
          recepientName: recepient?.name,
          statusId: args.statusId,
          type: "like",
          content: `${liker.name || "Someone"} liked your post`,
        });
      }

      return { action: "liked", likeId: newLikeId };
    }
  },
});
export const getLikeStatus = query({
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

    const existingLike = await ctx.db
      .query("like")
      .withIndex("by_liker_status", (q) =>
        q.eq("liker", userId).eq("statusId", args.status)
      )
      .first();

    const getLikeFromStatus = await ctx.db
      .query("like")
      .withIndex("by_status", (q) => q.eq("statusId", args.status))
      .collect();
    if (!existingLike && getLikeFromStatus.length === 0) {
      return undefined;
    }
    return {
      getData: existingLike !== null,
      getLikeFromStatus: getLikeFromStatus ?? [], // Mengembalikan array kosong jika getLikeFromStatus null
    };
  },
});

export const getAllStatusByUser = query({
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
      .query("like")
      .withIndex("by_liker", (q) => q.eq("liker", user._id))
      .order("desc")
      .paginate(args.paginationOpts);

    const dataStatus = await Promise.all(
      status.page.map(async (item) => {
        const [creator, parentStatus] = await Promise.all([
          ctx.db.get(item.liker),
          ctx.db.get(item.statusId),
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
