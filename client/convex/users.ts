import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    stripeCustomerId: v.string(),
    username: v.string(),
    profileImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("clerkId"), args.clerkId),
          q.eq(q.field("email"), args.email),
          q.eq(q.field("username"), args.username)
        )
      )
      .first();
    if (user) {
      throw new ConvexError("User already exists");
    }
    const folderId = await ctx.db.insert("folders", {
      name: "Default Folder",
      videosCount: 0,
    });
    const workspaceId = await ctx.db.insert("workspaces", {
      name: `${args.username}`,
      defaultFolder: folderId,
      foldersCount: 1,
      membersCount: 1,
    });
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      stripeCustomerId: args.stripeCustomerId,
      username: args.username,
      defaultWorkSpace: workspaceId,
      workspaces: [workspaceId],
      profileImageUrl: args.profileImageUrl,
    });
    await ctx.db.patch(folderId, { workspaceId: workspaceId });
    await ctx.db.patch(workspaceId, { admin: userId });
    await ctx.db.insert("memberships", {
      userId: userId,
      workspaceId: workspaceId,
    });
    return userId;
  },
});
export const updateUserProfile = mutation({
  args: {
    name: v.string(),
    username: v.string(),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, { name, username, email, clerkId }) => {
    const user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: clerkId,
    })) as Doc<"users">;
    if (!user) {
      throw new ConvexError("User not found");
    }
    await ctx.db.patch(user._id, {
      name,
      username,
      email,
    });
    const userAfterUpdate = (await ctx.db.get(user._id)) as Doc<"users">;
    await ctx.db.patch(user.defaultWorkSpace, {
      name: `${userAfterUpdate.name}`,
    });
    return user._id;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .first();
    if (!user) {
      throw new ConvexError(`User not found for clerkId: ${clerkId}`);
    }
    return user;
  },
});

export const deleteUserByClerkId = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .first();
    if (!user) {
      throw new ConvexError("User not found");
    }
    await ctx.db.delete(user._id);
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const getAllUsers = query({
  args: {
    workspace: v.id("workspaces"),
  },
  handler: async (ctx, { workspace }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Is Uknown");
    }
    const filteredUsers = (await ctx.db.query("users").collect()).filter(
      (user) => user.clerkId !== identity.subject
    );
    return await Promise.all(
      filteredUsers.map(async (user) => ({
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        plan: user.activeSubscriptionId ? "pro" : ("free" as "free" | "pro"),
        userId: user._id,
        isInvited: (await ctx.db
          .query("notifications")
          .filter((q) => q.eq(q.field("destination"), user._id))
          .filter((q) => q.eq(q.field("workspace"), workspace))
          .first())
          ? true
          : false,
      }))
    );
  },
});


