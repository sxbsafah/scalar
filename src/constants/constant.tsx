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