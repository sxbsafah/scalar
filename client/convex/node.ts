"use node"

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import cloudinary from "@/lib/cloudinary";
import { ConvexError, v } from "convex/values";
import { checkVideoLimits } from "@/lib/checkVideoLimits";



export const getSignedUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity is Uknown");
    }
    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });
    if (!user) {
      throw new ConvexError("User not found");
    }
    const timestamp = Math.floor(Date.now() / 1000);
    return {
      signature: cloudinary.utils.api_sign_request(
        {
          timestamp,
        },
        process.env.CLOUDINARY_API_KEY_SECRET!
      ),
      timestamp
    };
  },
});


export const createVideo = action({
  args: {
    thumbnailPublicId: v.string(),
    videoPublicId: v.string(),
    title: v.string(),
    workspace: v.id("workspaces"),
    folder: v.id("folders"),
  },
  handler: async (ctx, args): Promise<unknown> => {
    try {
      console.log("Validating video and thumbnail");
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("User identitiy is Unknown");
      }
      console.log("Fetching user data");
      const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId: identity.subject });
      if (!user) {
        throw new ConvexError("User not found");
      }
      console.log("getting video")
      console.log(args.workspace,args.thumbnailPublicId, args.videoPublicId)
      const video = await cloudinary.api.resource(args.videoPublicId, {
        type: "upload",
        resource_type: "video"
      });
      console.log(video);
      const validationResult = checkVideoLimits(video.duration, video.width, video.height, !!user.activeSubscriptionId);
      if (!validationResult.isValid) {
        await cloudinary.uploader.destroy(args.videoPublicId, {
          resource_type: "video", // "image" | "video" | "raw" | "auto"
        },);
        throw new ConvexError(validationResult.error!);
      }
      const thumbnail = await cloudinary.api.resource(args.thumbnailPublicId, {
        type: "upload",
        resource_type: "image"
      })
      console.log(thumbnail)
      if (thumbnail.bytes  > 2 * 1024 * 1024) {
        await cloudinary.uploader.destroy(args.thumbnailPublicId, {
          resource_type: "image",
        });
        throw new ConvexError("Thumbnail size exceeds 2MB");
      }
      return await ctx.runMutation(api.videos.createVideo, {
        clerkId: identity.subject,
        title: args.title,
        folderId: args.folder,
        workspaceId: args.workspace,
        videoUrl: video.secure_url,
        videoPublicId: args.videoPublicId,
        thumbnailUrl: thumbnail.secure_url,
        thumbnailPublicId: args.thumbnailPublicId,
      })
    } catch (error) {
      throw new ConvexError((error as Error).message); 
    }
  }
})
