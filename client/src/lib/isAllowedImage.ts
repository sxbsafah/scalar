import { ALLOWED_IMAGE_EXTENSIONS } from "@/constants/constant";

export function isAllowedImage(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? ALLOWED_IMAGE_EXTENSIONS.includes(ext) : false;
}
