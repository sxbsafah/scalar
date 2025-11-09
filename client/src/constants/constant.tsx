import Settings  from "@/components/Settings";
import  Home  from "@/components/Home";
import Billing  from "@/components/Billing";
import Bell  from "@/components/Bell";



export const navigationItems = [
  {
    title: "Library",
    to: "/",
    icon: (
      <Home />
    ),
  },
  {
    title: "Billing",
    to: "/billing",
    icon: <Billing />,
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: <Bell />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings />,
  },
];

export const VIDEO_LIMITS = {
  FREE: {
    MAX_DURATION: 300, // 5 minutes
    MAX_WIDTH: 1280,
    MAX_HEIGHT: 720,
    MAX_PIXELS: 1280 * 720,
  },
  PREMIUM: {
    MAX_DURATION: 600, // 10 minutes
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    MAX_PIXELS: 1920 * 1080,
  },
} as const;

export const ALLOWED_VIDEO_EXTENSIONS = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "webm",
  "flv",
  "wmv",
  "mpeg",
  "mpg",
  "3gp",
  "m4v",
];

export const ALLOWED_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "tiff",
  "svg",
  "heic",
];
