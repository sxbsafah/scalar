import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";


export const getUserWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User Not Found")
    }
    const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId: identity.subject }) as Doc<"users">;
    return await Promise.all(user?.workspaces.map(workspaceId => ctx.db.get(workspaceId)) || []);
  }
})


