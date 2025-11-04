import { BookOpen, CreditCard, Bell, Settings } from "lucide-react"



export const navigationItems = [
  {
    title: "Library",
    to: "/",
    icon: <BookOpen />,
  },
  {
    title: "Billing",
    to: "/billing",
    icon: <CreditCard />,
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
  }
]

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
