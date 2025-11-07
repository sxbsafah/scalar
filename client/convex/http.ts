import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/backend";
import stripe from "../src/lib/stripe";
import { api } from "./_generated/api";
import { ConvexError } from "convex/values";
import { VIDEO_LIMITS } from "@/constants/constant";
import { type VideoMetadata, type ValidationResult } from "@/types/video";
import { validateVideoMetadata } from "@/lib/validateVideoMetaData";
import { checkVideoLimits } from "@/lib/checkVideoLimits";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!clerkWebhookSecret) {
      return new Response("CLERK_WEBHOOK_SECRET not configured", {
        status: 500,
      });
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
        const {
          email_addresses,
          primary_email_address_id,
          username,
          id,
          first_name,
          last_name,
          image_url,
        } = event.data;
        const primaryEmailAddress = email_addresses.find(
          (email) => email.id === primary_email_address_id
        )?.email_address;
        if (event.type === "user.created") {
          const customer = await stripe.customers.create({
            name: `${first_name} ${last_name}`.trim(),
            email: primaryEmailAddress,
            metadata: {
              clerkId: id,
            },
          });
          await ctx.runMutation(api.users.createUser, {
            clerkId: id,
            email: primaryEmailAddress as string,
            name: `${first_name} ${last_name ? last_name : ""}`.trim(),
            stripeCustomerId: customer.id,
            username: username as string,
            profileImageUrl: image_url,
          });
        } else {
          await ctx.runMutation(api.users.updateUserProfile, {
            email: primaryEmailAddress as string,
            name: `${first_name} ${last_name ? last_name : ""}`.trim(),
            username: username as string,
            clerkId: id,
          });
        }
      } else if (event.type === "user.deleted") {
        await ctx.runMutation(api.users.deleteUserByClerkId, {
          clerkId: event.data.id as string,
        });
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
    return new Response("Success", { status: 200 });
  }),
});

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeWebhookSecret) {
      return new Response("Stripe Web Hook Secret", {
        status: 500,
      });
    }
    const stripeSignature = request.headers.get("stripe-signature");
    if (!stripeSignature) {
      return new Response("Stripe Signature Header is absent", {
        status: 400,
      });
    }
    const payload = await request.text();
    try {
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        stripeSignature,
        stripeWebhookSecret
      );
      if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated"
      ) {
        if (
          !event.data.object.latest_invoice ||
          event.data.object.status !== "active"
        ) {
          return new Response("Payment Failed");
        }
        await ctx.runMutation(api.subscriptions.upsertSubscription, {
          clerkId: event.data.object.metadata.clerkId,
          stripeSubscriptionId: event.data.object.id,
          status: event.data.object.status,
          startingDate: event.data.object.items.data[0]
            .current_period_start as number,
          endingDate: event.data.object.items.data[0]
            .current_period_end as number,
          planType: event.data.object.items.data[0].price.recurring
            ?.interval as "month" | "year",
          cancelAtPeriodEnd: event.data.object.cancel_at ? true : false,
        });
      } else if (event.type === "customer.subscription.deleted") {
        await ctx.runMutation(api.subscriptions.deleteSubscription, {
          stripeSubscriptionId: event.data.object.id,
        });
      }
    } catch (error) {
      throw new ConvexError((error as Error).message);
    }
    return new Response("Route Handeld Succefuly", {
      status: 200,
    });
  }),
});

http.route({
  path: "/get-user-video-upload-permission",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const metadata = (await req.json()) as Partial<VideoMetadata>;
    const metadataValidation: ValidationResult =
      validateVideoMetadata(metadata);
    if (!metadataValidation.isValid) {
      return new Response(
        JSON.stringify({
          error: metadataValidation.error,
        }),
        { status: 400 }
      );
    }
    const { duration, width, height, clerkId } = metadata as VideoMetadata;
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    const folder = await ctx.runQuery(api.folders.getFolderByIdandWorkspaceId, {
      workspaceId: metadata.workspaceId as Id<"workspaces">,
      folderId: metadata.folderId as Id<"folders">,
      clerkId,
    });
    if (!folder) {
      return new Response(JSON.stringify({ error: "Folder not found" }), {
        status: 404,
      });
    }
    const videos = await ctx.runQuery(api.videos.getVideosByFolderId, {
      folderId: folder._id,
      clerkId,
    });
    if (!videos) {
      return new Response(JSON.stringify({ error: "Failed Chekcing Videos" }), {
        status: 404,
      });
    }
    if (videos.some((video) => video.title === metadata.title)) {
      return new Response(
        JSON.stringify({ error: "Video with this title already exist" }),
        { status: 400 }
      );
    }
    const isPremium = !!user.activeSubscriptionId;
    const limitCheck = checkVideoLimits(duration, width, height, isPremium);
    if (!limitCheck.isValid) {
      return new Response(
        JSON.stringify({
          error: limitCheck.error,
          isPremium,
          limits: isPremium ? VIDEO_LIMITS.PREMIUM : VIDEO_LIMITS.FREE,
        }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({
        isPermissionGranted: true,
        isPremium,
        limits: isPremium ? VIDEO_LIMITS.PREMIUM : VIDEO_LIMITS.FREE,
      }),
      { status: 200 }
    );
  }),
});

http.route({
  path: "/create-video",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const videoData = (await request.json()) as {
      clerkId?: string;
      title?: string;
      folderId?: Id<"folders">;
      workspaceId?: Id<"workspaces">;
      videoUrl?: string;
      videoPublicId?: string;
      thumbnailUrl?: string;
      thumbnailPublicId?: string;
    };
    if (
      videoData.clerkId &&
      videoData.title &&
      videoData.folderId &&
      videoData.workspaceId &&
      videoData.videoUrl &&
      videoData.videoPublicId &&
      videoData.thumbnailUrl &&
      videoData.thumbnailPublicId
    ) {
      try {
        await ctx.runMutation(api.videos.createVideo, {
          clerkId: videoData.clerkId,
          title: videoData.title,
          folderId: videoData.folderId,
          workspaceId: videoData.workspaceId,
          videoUrl: videoData.videoUrl,
          videoPublicId: videoData.videoPublicId,
          thumbnailUrl: videoData.thumbnailUrl,
          thumbnailPublicId: videoData.thumbnailPublicId,
        });
      } catch (err) {
        return new Response((err as Error).message, {
          status: 400,
        });
      }
      return new Response("Video Created Successfuly", {
        status: 200,
      })
    } else {
      return new Response("Video Informations Are missing", {
        status: 400,
      })
    }
  }),
});

export default http;
