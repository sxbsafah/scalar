import { ALLOWED_VIDEO_EXTENSIONS } from "@/constants/constant";

export function isAllowedVideo(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? ALLOWED_VIDEO_EXTENSIONS.includes(ext) : false;
}
