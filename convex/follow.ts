import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";
import { currentUser } from "./users";

export const getFollowing = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);

    if (!currentUser) {
      return;
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();

    if (!user) {
      return;
    }
    const followers = await ctx.db
      .query("follow")
      .withIndex("by_following", (q) => q.eq("followingId", user._id))
      .collect();

    return Promise.all(
      followers.map(async (relation) => ctx.db.get(relation.followerId))
    );
  },
});

export const getFollowers = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await auth.getUserId(ctx);

    if (!currentUser) {
      return;
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();

    if (!user) {
      return;
    }
    const followers = await ctx.db
      .query("follow")
      .withIndex("by_follower", (q) => q.eq("followerId", user._id))
      .collect();

    return Promise.all(
      followers.map(async (relation) => ctx.db.get(relation.followingId))
    );
  },
});

export const toggleFollow = mutation({
  args: { followerId: v.id("users") },
  handler: async (ctx, args) => {
    const followingId = await auth.getUserId(ctx);
    if (!followingId) throw new Error("Unauthenticated");

    const existingRelation = await ctx.db
      .query("follow")
      .withIndex("unique_relation", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", followingId)
      )
      .first();

    const follower = await ctx.db.get(args.followerId);
    const following = await ctx.db.get(followingId);

    if (!following) {
      throw new Error("User to follow not found");
    }

    if (existingRelation) {
      await ctx.db.delete(existingRelation._id);
      const notificationToDelete = await ctx.db
        .query("notifications")
        .withIndex("by_recipient_and_type", (q) =>
          q.eq("recipientId", args.followerId).eq("type", "follow")
        )
        .filter((q) => q.eq(q.field("actorId"), followingId))
        .first();

      if (notificationToDelete) {
        await ctx.db.delete(notificationToDelete._id);
      }
      return { action: "unfollowed", isFollowing: false };
    } else {
      await ctx.db.insert("follow", {
        followerId: args.followerId,
        followingId: followingId,
      });
      await ctx.db.insert("notifications", {
        actorId: followingId,
        isRead: false,
        recipientId: args.followerId,
        type: "follow",
        recepientName: follower?.name,
        content: `${follower?.name || "Someone"} followed you`,
      });
      return { action: "followed", isFollowing: true };
    }
  },
});

export const checkFollowStatus = query({
  args: { followerId: v.id("users") },
  handler: async (ctx, args) => {
    const followingId = await auth.getUserId(ctx);
    if (!followingId) throw new Error("Unauthenticated");

    const existingRelation = await ctx.db
      .query("follow")
      .withIndex("unique_relation", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", followingId)
      )
      .unique();

    return { isFollowing: !!existingRelation };
  },
});
export const getUsersToFollow = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthenticated");

    const [followingRelations, usersToFollowPaginated] = await Promise.all([
      ctx.db
        .query("follow")
        .withIndex("by_follower", (q) => q.eq("followerId", currentUserId))
        .collect(),

      ctx.db.query("users").order("desc").paginate(args.paginationOpts),
    ]);

    const alreadyFollowingIds = new Set(
      followingRelations.map((r) => r.followingId)
    );
    alreadyFollowingIds.add(currentUserId);

    const filteredUsers = usersToFollowPaginated.page.filter(
      (user) => !alreadyFollowingIds.has(user._id)
    );
    const isDone = !usersToFollowPaginated.continueCursor;

    const results = {
      page: filteredUsers,
      continueCursor: usersToFollowPaginated.continueCursor ?? "",
      isDone: isDone,
    };

    return results;
  },
});
export const getUsersToFollows = query({
  handler: async (ctx) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthenticated");

    const [followingRelations, usersToFollowPaginated] = await Promise.all([
      ctx.db
        .query("follow")
        .withIndex("by_following", (q) => q.eq("followingId", currentUserId))
        .collect(),

      ctx.db.query("users").order("desc").take(5),
    ]);

    const alreadyFollowingIds = new Set(
      followingRelations.map((r) => r.followerId)
    );
    alreadyFollowingIds.add(currentUserId);

    const filteredUsers = usersToFollowPaginated.filter(
      (user) => !alreadyFollowingIds.has(user._id)
    );

    return filteredUsers;
  },
});

export const getFollowersUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      return null; // Not authenticated
    }

    // Get all followers for the given user
    const followers = await ctx.db
      .query("follow")
      .withIndex("by_following", (q) => q.eq("followingId", userId))
      .collect();

    // Get the users that the current user is following
    const currentUserFollowing = await ctx.db
      .query("follow")
      .withIndex("by_follower", (q) => q.eq("followerId", currentUserId))
      .collect();

    const currentUserFollowingIds = new Set(
      currentUserFollowing.map((r) => r.followingId)
    );

    // Get user details for each follower
    const followerDetails = await Promise.all(
      followers.map(async (relation) => {
        const user = await ctx.db.get(relation.followerId);
        return user
          ? {
              ...user,
              isFollowedByCurrentUser: currentUserFollowingIds.has(
                relation.followerId
              ),
            }
          : null;
      })
    );

    // Filter out any null values and ensure name and image exist
    const validFollowers = followerDetails.filter(
      (
        user
      ): user is NonNullable<typeof user> & {
        name: string;
        image: string;
        isFollowedByCurrentUser: boolean;
      } =>
        user !== null &&
        typeof user.name === "string" &&
        typeof user.image === "string"
    );

    // Return the follower details including name, image URL, and follow status
    return validFollowers.map((f) => ({
      ...f,
      isFollowedByCurrentUser: f.isFollowedByCurrentUser,
    }));
  },
});
