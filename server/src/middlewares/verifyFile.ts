import { type Request, type Response, type NextFunction } from "express";
import { getVideoInformations } from "@/lib/getVideoInformation.js";

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const verifyFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, folderId, workspaceId } = req.body as {
    title: string;
    folderId: string;
    workspaceId: string;
  };
  if (!req.files) {
    return res.status(400).json({
      error: " No files uploaded",
      code: "VliadationError",
    });
  }
  if (!("videos" in req.files) || !req.files["videos"][0]) {
    return res.status(400).json({
      error: "No Video file uploaded",
      code: "ValidationError",
    });
  }
  if (!("thumbnail" in req.files)) {
    return res.status(400).json({
      error: "No Thumbnail file uploaded",
      code: "ValidationError",
    });
  }
  if (!title) {
    return res.status(400).json({
      error: "No Title For Video Provided",
      code: "ValidationError",
    });
  }
  if (!folderId) {
    return res.status(400).json({
      error: "No FolderId Provided",
      code: "ValidationError",
    });
  }
  if (!workspaceId) {
    return res.status(400).json({
      error: "No WorkspaceId Provided",
      code: "ValidationError",
    });
  }
  try {
    const { width, height, duration } = await getVideoInformations(
      req.files["videos"][0].buffer
    );
    const permission = await fetch(
      "https://honorable-mastiff-751.convex.site/get-user-video-upload-permission",
      {
        method: "POST",
        body: JSON.stringify({
          duration,
          width,
          height,
          clerkId: req.body.clerkId,
          title: title,
          folderId: folderId,
          workspaceId,
        }),
      }
    );
    const permissionResult = await permission.json();
    if (permissionResult.error) {
      throw Error(permissionResult.error);
    }
    if (!permissionResult.isPermissionGranted) {
      throw Error("User does not have permission to upload video");
    }
  } catch (error) {
    return res.status(400).json({
      code: "ValidationError",
      error: (error as Error).message,
    });
  }
  next();
};
