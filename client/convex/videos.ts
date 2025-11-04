import { query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const getVideosByFolderId = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, { folderId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const videos = await ctx.db
      .query("videos")
      .filter(q => q.eq(q.field("folderId"), folderId))
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


