import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v, VLiteral } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    backgorundImage: v.optional(v.string()),
  })
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["name"],
    })
    .index("by_email_name", ["email", "name"]),
  status: defineTable({
    content: v.string(),
    creater: v.id("users"),
    parentStatus: v.optional(v.id("status")),
    depth: v.number(),
  })
    .index("by_creater", ["creater"])
    .index("by_parent", ["parentStatus"])
    .index("by_creater_and_depth", ["creater", "depth"])
    .index("by_depth", ["depth"]),
  media: defineTable({
    status: v.id("status"),
    mediaId: v.id("_storage"),
    url: v.string(),
  }).index("by_status", ["status"]),
  like: defineTable({
    statusId: v.id("status"),
    like: v.boolean(),
    liker: v.id("users"),
  })
    .index("by_liker", ["liker"])
    .index("by_status", ["statusId"])
    .index("by_liker_status", ["liker", "statusId"]),
  quote: defineTable({
    statusId: v.id("status"),
    content: v.string(),
    quoter: v.id("users"),
  })
    .index("by_quoter", ["quoter"])
    .index("by_status", ["statusId"])
    .index("by_quoter_status", ["quoter", "statusId"]),
  retweet: defineTable({
    rettweet: v.boolean(),
    status: v.id("status"),
    retweeter: v.id("users"),
  })
    .index("by_retweeter_status", ["retweeter", "status"])
    .index("by_status", ["status"])
    .index("by_retweeter", ["retweeter"]),
  bookmarks: defineTable({
    save: v.boolean(),
    status: v.id("status"),
    saver: v.id("users"),
  })
    .index("by_saver_status", ["saver", "status"])
    .index("by_status", ["status"])
    .index("by_saver", ["saver"]),
  follow: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("unique_relation", ["followerId", "followingId"]),
  notifications: defineTable({
    recipientId: v.id("users"),
    actorId: v.id("users"),
    type: v.union(
      v.literal("like"),
      v.literal("quote"),
      v.literal("retweet"),
      v.literal("follow"),
      v.literal("reply")
    ),
    statusId: v.optional(v.id("status")),
    recepientName: v.optional(v.string()),
    content: v.optional(v.string()),
    isRead: v.boolean(),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_recipient_and_type", ["recipientId", "type"])
    .index("by_recipient_and_read", ["recipientId", "isRead"]),
  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    members: v.array(v.id("users")),
  })
    .index("by_owner", ["ownerId"])
    .index("by_member", ["members"]),
  conversations: defineTable({
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
    admin: v.optional(v.id("users")),
  }).index("by_participant", ["participants"]),
  messages: defineTable({
    conversationId: v.id("conversations"),
    body: v.string(),
    isRead: v.boolean(),
    imageId: v.optional(v.id("_storage")),
    image: v.optional(v.string()),
    sender: v.id("users"),
    parentmessageId: v.optional(v.id("messages")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["sender"]),
});
