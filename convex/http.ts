import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/backend";
import stripe from "../src/lib/stripe";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!clerkWebhookSecret) {
      return new Response("CLERK_WEBHOOK_SECRET not configured", { status: 500 });
    }
    const svix_id = request.headers.get("svix-id")!;
    const svix_timestamp = request.headers.get("svix-timestamp")!;
    const svix_signature = request.headers.get("svix-signature")!;
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing Svix headers", { status: 400 });
    }
    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(clerkWebhookSecret);
    try {
      const event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
      if (event.type === "user.created" || event.type === "user.updated") {
        const { email_addresses, primary_email_address_id, username, id, first_name, last_name } = event.data;
        const primaryEmailAddress = email_addresses.find(email => email.id === primary_email_address_id)?.email_address
        if (event.type === "user.created") {
          const customer = await stripe.customers.create({
            name: `${first_name} ${last_name}`.trim(),
            email: primaryEmailAddress,
          });
          await ctx.runMutation(api.users.createUser, {
            clerkId: id,
            email: primaryEmailAddress as string,
            name: `${first_name} ${last_name}`.trim(),
            stripeCustomerId: customer.id,
            username: username as string,
          });
        } else {
          await ctx.runMutation(api.users.updateUserProfile, {
            email: primaryEmailAddress as string,
            name: `${first_name} ${last_name}`.trim(),
            username: username as string,
            clerkId: id,
          })
        }
      } else if (event.type === "user.deleted") {
        await ctx.runMutation(api.users.deleteUserByClerkId, {
          clerkId: event.data.id as string,
        })
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
    return new Response("Success", { status: 200 });
  }),
});

export default http;
