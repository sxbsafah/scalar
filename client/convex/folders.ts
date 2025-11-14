import { mutation, query } from "./_generated/server.js";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api.js";
import { Doc, Id } from "./_generated/dataModel.js";
import { folderSchema } from "@/components/FolderForm";

export const getFoldersByWorkspaceId = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
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
    const hasAccess = user.workspaces.includes(workspaceId as Id<"workspaces">);
    if (!hasAccess) {
      throw new ConvexError("User Does Not Have Access To This Workspace");
    }
    const folders = (await ctx.db
      .query("folders")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect()) as Doc<"folders">[];
    return folders;
  },
});

export const upsertFolder = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    folderName: v.string(),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, { workspaceId, folderName, folderId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const workspace = (await ctx.db.get(workspaceId)) as Doc<"workspaces">;
    if (!workspace) {
      throw new ConvexError("Workspace Not Found");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    if (!user.workspaces.includes(workspace._id)) {
      throw new ConvexError("User Does Not Have Access To This Workspace");
    }

    const validatedData = folderSchema.safeParse({ name: folderName });

    if (!validatedData.success) {
      return { errors: validatedData.error.message };
    }
    const folders = await ctx.runQuery(api.folders.getFoldersByWorkspaceId, {
      workspaceId,
    });
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].name === folderName) {
        return { errors: ["&#x2022; Folder Already Exist With this Name"] };
      }
    }
    if (!folderId) {
      await ctx.db.patch(workspace._id, {
        foldersCount: workspace.foldersCount + 1,
      });
      return await ctx.db.insert("folders", {
        workspaceId,
        name: folderName,
        videosCount: 0,
      });
    } else {
      const folder = await ctx.db.get(folderId);
      if (!folder) {
        throw new ConvexError("Folder Does Not Exist");
      }
      await ctx.db.patch(folder._id, {
        ...folder,
        name: folderName,
      });
      return folder._id;
    }
  },
});

export const getFolderByIdandWorkspaceId = query({
  args: {
    folderId: v.id("folders"),
    workspaceId: v.id("workspaces"),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, { folderId, workspaceId, clerkId }) => {
    const identity =
      (await ctx.auth.getUserIdentity()) ||
      (clerkId ? { subject: clerkId } : null);
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const workspace = (await ctx.db.get(workspaceId)) as Doc<"workspaces">;
    if (!workspace) {
      throw new ConvexError("Workspace Not Found");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    if (!user.workspaces.includes(workspace._id)) {
      throw new ConvexError("User Does Not Have Access To This Workspace");
    }
    return await ctx.db.get(folderId);
  },
});

export const deleteFolderById = mutation({
  args: {
    id: v.id("folders"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity is Unknown");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    const folder = await ctx.db.get(id);
    if (!folder) {
      throw new ConvexError("Folder Not Found");
    }
    const isDefault = !!(await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("defaultFolder"), folder._id))
      .first());
    if (isDefault) {
      throw new ConvexError("Cannot Delete Default Folder");
    }
    const memberships = await ctx.db
      .query("memberships")
      .filter((q) => q.eq(q.field("workspaceId"), folder.workspaceId))
      .collect();
    if (
      memberships.some(
        (membership) => membership.userId.toString() === user._id.toString()
      ) === false
    ) {
      throw new ConvexError(
        "User Does Not Have Permission To Delete This Folder"
      );
    }
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("folderId"), folder._id))
      .collect();
    videos.forEach(async (video) => {
      await ctx.db.delete(video._id);
    });
    await ctx.db.delete(id);
  },
});

export const duplicateFolder = mutation({
  args: {
    id: v.id("folders"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { id, workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const workspace = (await ctx.db.get(workspaceId)) as Doc<"workspaces">;
    if (!workspace) {
      throw new ConvexError("Workspace Not Found");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    if (!user.workspaces.includes(workspace._id)) {
      throw new ConvexError("User Does Not Have Access To This Workspace");
    }
    const folderToDuplicate = await ctx.db.get(id);
    if (!folderToDuplicate) {
      throw new ConvexError("Folder Not Found");
    }
    const newFolder = await ctx.db.insert("folders", {
      workspaceId: folderToDuplicate.workspaceId,
      name: `${folderToDuplicate.name} Copy`,
      videosCount: folderToDuplicate.videosCount,
    });
    const videosToDuplicate = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("folderId"), id))
      .collect();
    videosToDuplicate.forEach(async (video) => {
      await ctx.db.insert("videos", {
        title: video.title,
        folderId: newFolder,
        thumbnailPublicId: video.thumbnailPublicId,
        thumbnailUrl: video.thumbnailUrl,
        videoPublicId: video.videoPublicId,
        videoUrl: video.videoUrl,
        workspaceId,
        userId: video.userId,
        commentsCount: video.commentsCount,
        watchCount: video.watchCount,
      });
    });
  },
});
