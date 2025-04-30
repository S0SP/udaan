"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react"

export function CustomerFooter() {
  return (
    <motion.footer
      className="bg-white border-t border-gray-200 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">KiraanaKloud</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your one-stop solution for groceries and medicines delivered right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <motion.a href="#" className="text-gray-500 hover:text-blue-600" whileHover={{ y: -3 }}>
                <Facebook size={20} />
              </motion.a>
              <motion.a href="#" className="text-gray-500 hover:text-blue-600" whileHover={{ y: -3 }}>
                <Twitter size={20} />
              </motion.a>
              <motion.a href="#" className="text-gray-500 hover:text-blue-600" whileHover={{ y: -3 }}>
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/customer" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/customer/products/groceries" className="text-gray-600 hover:text-blue-600">
                  Groceries
                </Link>
              </li>
              <li>
                <Link href="/customer/products/medicines" className="text-gray-600 hover:text-blue-600">
                  Medicines
                </Link>
              </li>
              <li>
                <Link href="/customer/monthly-basket" className="text-gray-600 hover:text-blue-600">
                  Monthly Basket
                </Link>
              </li>
              <li>
                <Link href="/customer/orders" className="text-gray-600 hover:text-blue-600">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600" />
                <span className="text-gray-600">+91 9876543210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                <span className="text-gray-600">support@kiraanakloud.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} KiraanaKloud. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
