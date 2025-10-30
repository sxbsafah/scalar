import { ConvexError, v } from "convex/values";
import stripe from "../src/lib/stripe";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const createPremiumCheckoutSession = action({
  args: {
    plan: v.union(v.literal("month"), v.literal("year")),
  },
  handler: async (ctx, { plan }): Promise<{ checkout_url: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    const userSubscription = await ctx.runQuery(
      api.subscriptions.getSubscriptionById,
      {
        subscriptionId: user.activeSubscriptionId,
      }
    );
    if (userSubscription) {
      throw new ConvexError("User Already Has An Active Subscription");
    }
    const priceId = plan === "month"
      ? process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID
      : process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID;
    const productId = process.env.STRIPE_PREMIUM_PRODUCT_ID;
    if (!priceId || !productId) {
      throw new ConvexError("No PriceId or ProductId");
    }
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.VITE_PUBLIC_URL}/pro/sucess?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.VITE_PUBLIC_URL}`,
      subscription_data: {
        metadata: {
          clerkId: user.clerkId,
        }
      }
    });
    return { checkout_url: session.url };
  },
});
