import { Id } from "../../convex/_generated/dataModel";

export type VideoMetadata = {
  duration: number;
  width: number;
  height: number;
  clerkId: string;
  folderId: Id<"folders">;
  workspaceId: Id<"workspaces">;
  title: string,
};


export type ValidationResult = {
  isValid: boolean;
  error?: string;
}

