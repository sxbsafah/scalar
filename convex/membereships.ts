import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createMembership = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), identity.subject)).first();
    if (!user) {
      throw new ConvexError("User not found");
    }
    const isInvited = await ctx.db.query("notifications").filter(q => q.eq(q.field("destination"), user._id)).filter(q => q.eq(q.field("workspace"), workspaceId)).first();

    if (!isInvited) {
      throw new ConvexError("User is not invited");
    }
    await ctx.db.delete(isInvited._id);
    const membership =  await ctx.db.insert("memberships", {
      userId: user._id,
      workspaceId,
    })
    await ctx.db.patch(user._id, {
      workspaces: [...user.workspaces,workspaceId],
    })
    return membership;
  }
})