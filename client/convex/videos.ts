import {  mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";



export const getVideosByFolderId = query({
  args: { folderId: v.id("folders"), clerkId: v.optional(v.string()) },
  handler: async (ctx, { folderId, clerkId }) => {
    const identity =
      (await ctx.auth.getUserIdentity()) ||
      (clerkId ? { subject: clerkId } : null);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("folderId"), folderId))
      .collect();

    // Step 2: Populate user data manually
    const populatedVideos = await Promise.all(
      videos.map(async (video) => {
        const user = await ctx.db.get(video.userId);
        return {
          ...video,
          user, // Add full user document here
        };
      })
    );

    return populatedVideos;
  },
});

export const createVideo = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    folderId: v.id("folders"),
    workspaceId: v.id("workspaces"),
    videoUrl: v.string(),
    videoPublicId: v.string(),
    thumbnailUrl: v.string(),
    thumbnailPublicId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) {
      throw new ConvexError("User Identity is unknown");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    if (!user) {
      throw new ConvexError("User not found");
    }
    return await ctx.db.insert("videos", {
      title: args.title,
      thumbnailPublicId: args.thumbnailPublicId,
      videoPublicId: args.videoPublicId,
      videoUrl: args.videoUrl,
      thumbnailUrl: args.thumbnailUrl,
      folderId: args.folderId,
      workspaceId: args.workspaceId,
      userId: user._id,
      commentsCount: 0,
      watchCount: 0,
    });
  },
});

