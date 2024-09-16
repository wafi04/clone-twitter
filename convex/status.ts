import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";
import { CommentWithReplies, UserData } from "./types";
import { Id } from "./_generated/dataModel";
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
export const addComment = mutation({
  args: {
    content: v.string(),
    image: v.optional(v.id("_storage")),
    parentStatus: v.optional(v.id("status")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (userId === null) {
      throw new Error("User not authenticated");
    }

    let depth = 0;
    if (args.parentStatus) {
      const parentComment = await ctx.db.get(args.parentStatus);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
      depth = parentComment.depth + 1;
    }

    const statusId = await ctx.db.insert("status", {
      parentStatus: args.parentStatus,
      content: args.content,
      creater: userId,
      depth: depth,
    });

    if (args.image) {
      const content = (await ctx.storage.getUrl(args.image)) as string;
      await ctx.db.insert("media", {
        status: statusId,
        url: content,
        mediaId: args.image,
      });
    }
    return statusId;
  },
});

export const getStatusAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;
    const currentUser = await auth.getUserId(ctx);

    if (!currentUser) {
      throw new ConvexError("Unauthorized");
    }

    const [allStatus, allUsers] = await Promise.all([
      ctx.db.query("status").collect(),
      ctx.db.query("users").collect(),
    ]);

    const userMap = new Map(allUsers.map((user) => [user._id, user]));
    const statusMap = new Map<Id<"status">, CommentWithReplies>();

    // First pass: create CommentWithReplies objects
    allStatus.forEach((status) => {
      const user = userMap.get(status.creater);
      if (!user) return;

      statusMap.set(status._id, {
        ...status,
        creator: user,
        replies: [],
      });
    });

    const topLevelComments: CommentWithReplies[] = [];
    statusMap.forEach((comment) => {
      if (comment.depth === 0) {
        topLevelComments.push(comment);
      } else if (comment.parentStatus && statusMap.has(comment.parentStatus)) {
        let parent = statusMap.get(comment.parentStatus)!;
        if (comment.depth === parent.depth + 1) {
          // Only add the latest reply (sorted by _creationTime)
          if (parent.replies.length === 0) {
            parent.replies.push(comment);
          } else if (comment._creationTime > parent.replies[0]._creationTime) {
            parent.replies[0] = comment;
          }
        } else {
          while (
            parent.depth < comment.depth - 1 &&
            parent.replies.length > 0
          ) {
            parent = parent.replies[parent.replies.length - 1];
          }
          // Ensure only the latest reply at each depth
          if (parent.replies.length === 0) {
            parent.replies.push(comment);
          } else if (comment._creationTime > parent.replies[0]._creationTime) {
            parent.replies[0] = comment;
          }
        }
      }
    });

    const sortComments = (comments: CommentWithReplies[]) => {
      comments.sort((a, b) => b._creationTime - a._creationTime);
      comments.forEach((comment) => sortComments(comment.replies));
    };
    sortComments(topLevelComments);

    const cursorIndex = paginationOpts.cursor
      ? parseInt(paginationOpts.cursor, 10)
      : 0;
    const paginatedComments = topLevelComments.slice(
      paginationOpts.numItems * cursorIndex,
      paginationOpts.numItems * (cursorIndex + 1)
    );

    const nextCursor =
      paginatedComments.length === paginationOpts.numItems
        ? (cursorIndex + 1).toString()
        : "";

    return {
      page: paginatedComments,
      continueCursor: nextCursor,
      isDone: paginatedComments.length < paginationOpts.numItems,
    };
  },
});

export const getCountReplies = query({
  args: {
    statusId: v.id("status"),
  },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);

    if (!currentUser) {
      throw new ConvexError("Unauthorized");
    }

    const status = await ctx.db
      .query("status")
      .withIndex("by_parent", (q) => q.eq("parentStatus", args.statusId))
      .collect();

    return status;
  },
});

interface Status {
  _id: Id<"status">;
  content: string;
  creater: Id<"users">;
  parentStatus?: Id<"status">;
  depth: number;
  _creationTime: number;
}

interface StatusWithCreator extends Status {
  creator: UserData;
}

interface StatusWithCreatorAndChildren extends StatusWithCreator {
  children?: StatusWithCreatorAndChildren[];
}

export const getStatusWithParents = query({
  args: { statusId: v.id("status") },
  handler: async (ctx, args) => {
    const result: StatusWithCreatorAndChildren[] = [];
    let currentStatusId: Id<"status"> | undefined = args.statusId;

    // Function to get a single child status
    async function getChild(
      parentId: Id<"status">
    ): Promise<StatusWithCreatorAndChildren[]> {
      const childStatus = await ctx.db
        .query("status")
        .withIndex("by_parent", (q) => q.eq("parentStatus", parentId))
        .first();

      if (!childStatus) return [];

      const creator = await ctx.db.get(childStatus.creater);
      if (!creator) return [];

      const childWithCreator: StatusWithCreatorAndChildren = {
        ...childStatus,
        creator,
      };

      // Recursively get the child of this child
      childWithCreator.children = await getChild(childStatus._id);

      return [childWithCreator];
    }

    while (currentStatusId) {
      const status: Status | null = await ctx.db.get(currentStatusId);
      if (!status) break;

      const creator: UserData | null = await ctx.db.get(status.creater);
      if (!creator) {
        throw new Error(`Creator not found for status ${currentStatusId}`);
      }

      const statusWithCreator: StatusWithCreatorAndChildren = {
        ...status,
        creator,
      };

      // Get a single child for the current status
      statusWithCreator.children = await getChild(status._id);

      result.push(statusWithCreator);
      currentStatusId = status.parentStatus;
    }

    return result.reverse();
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
      .query("status")
      .withIndex("by_creater", (q) => q.eq("creater", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
    const dataStatus = await Promise.all(
      status.page.map(async (item) => {
        const [creator, parentStatus] = await Promise.all([
          ctx.db.get(item.creater),
          item.parentStatus ? ctx.db.get(item.parentStatus) : null,
        ]);

        if (!creator) {
          throw new Error("Unautohroized");
        }

        return {
          ...item,
          creator,
          replies: parentStatus
            ? {
                ...parentStatus,
                creator,
              }
            : null,
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

export const getMediaForStatus = query({
  args: { statusId: v.id("status") },
  handler: async (ctx, args) => {
    const media = await ctx.db
      .query("media")
      .withIndex("by_status", (q) => q.eq("status", args.statusId))
      .collect();

    return media;
  },
});
