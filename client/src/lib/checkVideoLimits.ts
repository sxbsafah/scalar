import { VIDEO_LIMITS } from "@/constants/constant";
import { ValidationResult } from "@/types/video";


export function checkVideoLimits(
  duration: number,
  width: number,
  height: number,
  isPremium: boolean
): ValidationResult {
  const limits = isPremium ? VIDEO_LIMITS.PREMIUM : VIDEO_LIMITS.FREE;
  const pixels = width * height;

  if (duration > limits.MAX_DURATION) {
    const maxMinutes = limits.MAX_DURATION / 60;
    return {
      isValid: false,
      error: `Video duration must not exceed ${maxMinutes} minutes`,
    };
  }

  if (pixels > limits.MAX_PIXELS) {
    return {
      isValid: false,
      error: `Video resolution must not exceed ${limits.MAX_WIDTH}x${limits.MAX_HEIGHT}`,
    };
  }

  return { isValid: true };
}
