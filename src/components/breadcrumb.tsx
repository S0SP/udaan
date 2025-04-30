"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { motion } from "framer-motion"
import { useAudio } from "@/components/audio-provider"

export function Breadcrumb() {
  const pathname = usePathname()
  const { playSound } = useAudio()

  // Skip rendering breadcrumbs on the main page
  if (pathname === "/" || pathname === "/customer" || pathname === "/shopkeeper" || pathname === "/delivery") {
    return null
  }

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items with proper paths and labels
  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`

    // Format the label (capitalize first letter, replace hyphens with spaces)
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    label = label.replace(/-/g, " ")

    // If it's an ID (like in /navigation/[id]), show a shorter version
    if (label.length > 20) {
      label = `${label.substring(0, 8)}...`
    }

    return { path, label }
  })

  return (
    <nav className="flex items-center text-sm mb-4">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">
        <Link
          href={`/${segments[0]}`}
          className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
          onClick={() => playSound("click")}
        >
          <Home className="h-4 w-4 mr-1" />
          <span>{segments[0].charAt(0).toUpperCase() + segments[0].slice(1)}</span>
        </Link>

        {breadcrumbItems.slice(1).map((item, index) => (
          <Fragment key={item.path}>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link
              href={item.path}
              className={`hover:text-blue-600 transition-colors ${
                index === breadcrumbItems.length - 2 ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
              onClick={() => playSound("click")}
            >
              {item.label}
            </Link>
          </Fragment>
        ))}
      </motion.div>
    </nav>
  )
}
