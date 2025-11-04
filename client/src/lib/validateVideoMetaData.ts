import { type VideoMetadata, type ValidationResult } from "@/types/video";

export function validateVideoMetadata(
  metadata: Partial<VideoMetadata>
): ValidationResult {
  const { duration, width, height, clerkId, folderId, workspaceId } = metadata;

  if (!duration || !width || !height || !folderId || !workspaceId) {
    return {
      isValid: false,
      error: "Invalid metadata: missing required fields",
    };
  }

  if (!clerkId) {
    return {
      isValid: false,
      error: "User identity is unknown",
    };
  }

  return { isValid: true };
}
