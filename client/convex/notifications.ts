import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getUserNotifications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Not Authenticated");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("destination"), user._id))
      .collect();

    return await Promise.all(notifications.map(async (notification) => {
      const sender = await ctx.db.get(notification.userId);
      return {
        ...notification,
        user: sender,
      }
    }));
  },
});


export const createNotification = mutation({
  args: {
    to: v.id("users"),
    workspace: v.id("workspaces"),
  },
  handler: async (ctx, { to, workspace }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Not Authenticated");
    }
    const fromUser = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), identity.subject)).first();
    if (!fromUser) {
      throw new ConvexError("User not Found");
    }
    const isUserInvited = await ctx.db.query("notifications").filter(q => q.eq(q.field("destination"), to)).filter(q => q.eq(q.field("workspace"), workspace)).first();
    if (isUserInvited) {
      throw new ConvexError("User Is Already Invited");
    }
    return await ctx.db.insert("notifications", {
      userId: fromUser._id,
      workspace: workspace,
      destination: to,
      timestamp: Date.now(),
    })
  }
})


export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, { notificationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User is Uknown");
    }
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), identity.subject)).first();
    if (!user) {
      throw new ConvexError("User not found");
    }
    const hasAccess = (await ctx.db.get(notificationId))?.destination;
    if (hasAccess !== user._id) {
      throw new ConvexError("UnAuthorized");
    }
    await ctx.db.delete(notificationId)
  }
})
