import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server"
import { v } from "convex/values";

export const getSubscriptionById = query({
  args: {
    subscriptionId: v.optional(v.id("subscriptions")),
  },
  handler: async (ctx, { subscriptionId }) => {
    if (!subscriptionId) {
      return undefined;
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity is Uknown");
    }
    return await ctx.db.get(subscriptionId);
  }
})

export const upsertSubscription = mutation({
  args: {
    clerkId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    startingDate: v.number(),
    endingDate: v.number(),
    planType: v.union(v.literal("month"),v.literal("year")),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), args.clerkId)).first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    const existingSubscription = await ctx.db.query("subscriptions").filter(q => q.eq(q.field("_id"), user.activeSubscriptionId)).first();
    if (existingSubscription) {
      await ctx.db.patch(existingSubscription._id, {
        stripeSubscriptionId: args.stripeSubscriptionId,
        status: args.status === "active",
        startingDate: args.startingDate,
        endingDate: args.endingDate,
        planType: args.planType,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        userId: user._id,
      })
    } else {
      const id = await ctx.db.insert("subscriptions", {
        stripeSubscriptionId: args.stripeSubscriptionId,
        status: args.status === "active",
        startingDate: args.startingDate,
        endingDate: args.endingDate,
        planType: args.planType,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        userId: user._id
      })
      await ctx.db.patch(user._id, {
        activeSubscriptionId: id,
      })
    }
    return;
  }
})


export const deleteSubscription = mutation({
  args: {
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, { stripeSubscriptionId }) => {
    const subscription = await ctx.db.query("subscriptions").filter(q => q.eq(q.field("stripeSubscriptionId"), stripeSubscriptionId)).first();
    if (!subscription) {
      throw new ConvexError("Subsription not found")
    }
    await ctx.db.patch(subscription.userId, {
      activeSubscriptionId: undefined,
    })
    return;
  }
})


export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity is Uknown");
    }
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), identity.subject)).first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    return { subscription: user.activeSubscriptionId ? await ctx.db.get(user.activeSubscriptionId) : undefined };
  }
})