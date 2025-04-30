"use client"

import { motion } from "framer-motion"
import { X, ShoppingBag, Bell, TruckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "order" | "offer" | "delivery"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and is being processed.",
    time: "10 minutes ago",
    read: false,
    type: "order",
  },
  {
    id: "2",
    title: "Special Offer",
    message: "Get 20% off on all grocery items this weekend!",
    time: "2 hours ago",
    read: false,
    type: "offer",
  },
  {
    id: "3",
    title: "Delivery Update",
    message: "Your order #12345 is out for delivery and will arrive soon.",
    time: "Just now",
    read: false,
    type: "delivery",
  },
  {
    id: "4",
    title: "Order Delivered",
    message: "Your order #12344 has been delivered. Enjoy!",
    time: "Yesterday",
    read: true,
    type: "delivery",
  },
]

type NotificationsPanelProps = {
  onClose: () => void
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />
      case "offer":
        return <Bell className="h-5 w-5 text-green-500" />
      case "delivery":
        return <TruckIcon className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {mockNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {mockNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className={`p-4 ${notification.read ? "bg-white" : "bg-blue-50"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
