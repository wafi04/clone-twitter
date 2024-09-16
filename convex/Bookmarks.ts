import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const creteBoookmarks = mutation({
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

    let existingBookmarks;
    let targetId: Id<"status">;
    let targetType: "status";

    if (args.status) {
      existingBookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_saver_status", (q) =>
          q.eq("saver", userId).eq("status", args.status)
        )
        .first();
      targetId = args.status;
      targetType = "status";
    }

    if (existingBookmarks) {
      await ctx.db.delete(existingBookmarks._id);
      return { action: "unliked", likeId: existingBookmarks._id };
    }

    const newLikeId = await ctx.db.insert("bookmarks", {
      saver: userId,
      status: args.status,
      save: true,
    });
    return { action: "liked", likeId: newLikeId };
  },
});
export const getBookmarksStatus = query({
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

    const existingBookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_saver_status", (q) =>
        q.eq("saver", userId).eq("status", args.status)
      )
      .first();

    const getBookmarksStatus = await ctx.db
      .query("bookmarks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
    if (!existingBookmarks && getBookmarksStatus.length === 0) {
      return undefined;
    }
    return {
      getData: existingBookmarks !== null,
      getBookmarksStatus: getBookmarksStatus ?? [], // Mengembalikan array kosong jika getLikeFromStatus null
    };
  },
});
export const getAllBookamarksByUser = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);

    if (!currentUser) {
      throw new ConvexError("Unauthorized");
    }

    const status = await ctx.db
      .query("bookmarks")
      .withIndex("by_saver", (q) => q.eq("saver", currentUser))
      .order("desc")
      .paginate(args.paginationOpts);

    const dataStatus = await Promise.all(
      status.page.map(async (item) => {
        const [creator, parentStatus] = await Promise.all([
          ctx.db.get(item.saver),
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
