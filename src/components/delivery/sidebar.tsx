"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MapPin,
  Package,
  Clock,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-provider"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/delivery",
  },
  {
    title: "Active Deliveries",
    icon: Package,
    path: "/delivery/active",
  },
  {
    title: "Navigation",
    icon: MapPin,
    path: "/delivery/navigation",
  },
  {
    title: "Delivery History",
    icon: Clock,
    path: "/delivery/history",
  },
  {
    title: "Earnings",
    icon: BarChart3,
    path: "/delivery/earnings",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/delivery/notifications",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/delivery/settings",
  },
]

export function DeliverySidebar() {
  const pathname = usePathname()
  const { playSound } = useAudio()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    playSound("click")
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed md:sticky top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm"
        initial={{ width: isCollapsed ? 80 : 250 }}
        animate={{ width: isCollapsed ? 80 : 250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200">
            <motion.div className="flex items-center" animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              {!isCollapsed && (
                <motion.span
                  className="ml-3 font-semibold text-lg text-purple-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  KiraanaKloud
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path

                return (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <motion.div
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          isActive ? "bg-purple-50 text-purple-600" : "text-gray-600 hover:bg-gray-100"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => playSound("click")}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-500"}`} />

                        {!isCollapsed && (
                          <motion.span
                            className="ml-3 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.title}
                          </motion.span>
                        )}

                        {isActive && !isCollapsed && (
                          <motion.div
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600"
                            layoutId="activeIndicator"
                          />
                        )}
                      </motion.div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <motion.div
              className={`flex items-center p-2 rounded-lg text-red-600 cursor-pointer hover:bg-red-50`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => playSound("click")}
            >
              <LogOut className="w-5 h-5 text-red-500" />

              {!isCollapsed && (
                <motion.span
                  className="ml-3 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-gray-200 bg-white shadow-sm"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
