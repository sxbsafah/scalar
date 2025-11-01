import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";



export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    username: v.string(),
    stripeCustomerId: v.string(),
    defaultWorkSpace: v.id("workspaces"),
    activeSubscriptionId: v.optional(v.id("subscriptions")),
    workspaces: v.array(v.id("workspaces")),
    profileImageUrl: v.string(),
  }),
  subscriptions: defineTable({
    userId: v.id("users"),
    stripeSubscriptionId: v.string(),
    status: v.boolean(),
    startingDate: v.number(),
    endingDate: v.number(),
    planType: v.union(v.literal("month"), v.literal("year")),
    cancelAtPeriodEnd: v.boolean(),
  }),
  workspaces: defineTable({
    name: v.string(),
    admin: v.optional(v.id("users")),
    defaultFolder: v.id("folders"),
    foldersCount: v.number(),
    membersCount: v.number(),
  }),
  folders: defineTable({
    name: v.string(),
    videosCount: v.number(),
    workspaceId: v.optional(v.id("workspaces")),
  }),
  notifications: defineTable({
    userId: v.id("users"),
    workspace: v.id("workspaces"),
    destination: v.id("users"),
    timestamp: v.number(),
  }),
  videos: defineTable({
    title: v.string(),
    folderId: v.id("folders"),
    thumbnailUrl: v.string(),
    videoUrl: v.string(),
    userId: v.id("users"),
    commentsCount: v.number(),
    watchCount: v.number(),
  }),
  comments: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    body: v.string(),
  }),
  memberships: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
  })
})