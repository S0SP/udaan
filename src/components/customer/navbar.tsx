"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Bell, User, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"
import { NotificationsPanel } from "@/components/customer/notifications-panel"

export function CustomerNavbar() {
  const pathname = usePathname()
  const { playSound } = useAudio()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Mock cart count for demo
  useEffect(() => {
    setCartCount(3)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    playSound("click")
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleNotifications = () => {
    playSound("click")
    setIsNotificationsOpen(!isNotificationsOpen)
  }

  const navLinks = [
    { name: "Home", path: "/customer" },
    { name: "Groceries", path: "/customer/products/groceries" },
    { name: "Medicines", path: "/customer/products/medicines" },
    { name: "Monthly Basket", path: "/customer/monthly-basket" },
    { name: "Orders", path: "/customer/orders" },
  ]

  return (
    <>
      <motion.header
        className={`sticky top-0 z-40 w-full ${
          isScrolled ? "glass shadow-md" : "bg-transparent"
        } transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/customer">
                <motion.div
                  className="text-2xl font-bold text-blue-600 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playSound("click")}
                >
                  KiraanaKloud
                </motion.div>
              </Link>

              <nav className="ml-10 hidden md:flex space-x-6">
                {navLinks.map((link) => (
                  <Link key={link.path} href={link.path} onClick={() => playSound("click")}>
                    <motion.span
                      className={`text-sm font-medium ${
                        pathname === link.path ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                      } transition-colors`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/customer/search">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => playSound("click")}>
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="rounded-full relative" onClick={toggleNotifications}>
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-500">
                  2
                </Badge>
              </Button>

              <Link href="/customer/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                  onClick={() => playSound("click")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/customer/profile">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => playSound("click")}>
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={toggleMobileMenu}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-end mb-8">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMobileMenu}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => {
                      playSound("click")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <motion.div
                      className={`text-xl font-medium ${pathname === link.path ? "text-blue-600" : "text-gray-600"}`}
                      whileHover={{ x: 10 }}
                      whileTap={{ x: 0 }}
                    >
                      {link.name}
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>{isNotificationsOpen && <NotificationsPanel onClose={toggleNotifications} />}</AnimatePresence>
    </>
  )
}
