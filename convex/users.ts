import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await auth.getUserId(ctx);

    if (user === null) {
      return null;
    }
    const currentUser = await ctx.db.get(user);

    if (!currentUser) {
      return;
    }

    const following = await ctx.db
      .query("follow")
      .withIndex("by_following", (q) => q.eq("followingId", user))
      .collect();
    const followers = await ctx.db
      .query("follow")
      .withIndex("by_follower", (q) => q.eq("followerId", user))
      .collect();

    const getUserByFollowingAndFollowers = await Promise.all([
      ...following.map((follow) => ctx.db.get(follow.followerId)),
      ...followers.map((follow) => ctx.db.get(follow.followingId)),
    ]);

    return {
      currentUser,
      following: getUserByFollowingAndFollowers.slice(0, following.length), // Extract followed users
      followers: getUserByFollowingAndFollowers.slice(following.length), // Extract followers
    };
  },
});

export const getUserByname = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();
    return user;
  },
});

export const getallUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("Unauthorzed");
    }

    const results = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), user)) // Filter untuk menghilangkan pengguna yang sedang login
      .order("desc")
      .paginate(args.paginationOpts);

    return results;
  },
});

export const updateUser = mutation({
  args: {
    updateData: v.object({
      image: v.optional(v.string()),
      displayName: v.optional(v.string()),
      bio: v.optional(v.string()),
      backgorundImage: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);

    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    const userToUpdate = await ctx.db.get(currentUserId);
    if (!userToUpdate) {
      throw new Error("User not found");
    }

    let profile;
    let backgorundImage;
    // Perform the partial update
    if (args.updateData.image) {
      profile = (await ctx.storage.getUrl(args.updateData.image)) as string;
    }
    if (args.updateData.backgorundImage) {
      backgorundImage = (await ctx.storage.getUrl(
        args.updateData.backgorundImage
      )) as string;
    }
    const updatedUser = await ctx.db.patch(currentUserId, {
      backgorundImage,
      displayName: args.updateData.displayName,
      image: profile,
      bio: args.updateData.bio,
    });

    return updatedUser;
  },
});
export const serachUser = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.name))
      .collect();
    return user;
  },
});
