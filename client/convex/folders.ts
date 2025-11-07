import { mutation, query } from "./_generated/server.js";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api.js"
import { Doc, Id } from "./_generated/dataModel.js";
import { folderSchema } from "@/pages/Library.js";



export const getFoldersByWorkspaceId = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId: identity.subject });
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    const hasAccess = user.workspaces.includes(workspaceId as Id<"workspaces">) ;
    if (!hasAccess) {
      throw new ConvexError("User Does Not Have Access To This Workspace");
    }
    const folders = await ctx.db.query("folders").filter(q => q.eq(q.field("workspaceId"), workspaceId)).collect()  as Doc<"folders">[];
    return folders;
  }
})

export const createFolder = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    folderName: v.string(),
  },
  handler: async (ctx, { workspaceId, folderName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const workspace = await ctx.db.get(workspaceId) as Doc<"workspaces">;
    if (!workspace) {
      throw new ConvexError("Workspace Not Found");
    }
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), identity.subject)).first();
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
    })
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].name === folderName) {
        return { errors: ["&#x2022; Folder Already Exist With this Name"] }
      }
    }
    await ctx.db.patch(workspace._id, {
      foldersCount: workspace.foldersCount + 1,
    })
    return await ctx.db.insert("folders", {
      workspaceId,
      name: folderName,
      videosCount: 0,
    })
  }
})

export const getFolderByIdandWorkspaceId = query({
  args: {
    folderId: v.id("folders"),
    workspaceId: v.id("workspaces"),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx,{ folderId, workspaceId, clerkId }) => {
    const identity = await ctx.auth.getUserIdentity() || (clerkId ? { subject: clerkId } : null);
    if (!identity) {
      throw new ConvexError("User Identity Is Uknown");
    }
    const workspace = await ctx.db.get(workspaceId) as Doc<"workspaces">;
    if (!workspace) {
      throw new ConvexError("Workspace Not Found");
    }
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("clerkId"), identity.subject)).first();
    if (!user) {
      throw new ConvexError("User Not Found");
    }
    if (!user.workspaces.includes(workspace._id)) {
      throw new ConvexError("User Does Not Have Access To This Workspace");
    }
    return await ctx.db.get(folderId);
  }
})

