"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"

// Mock cart data
const initialCartItems = [
  {
    id: "1",
    name: "Fresh Organic Vegetables Pack",
    price: 299,
    image: "/placeholder.svg?height=100&width=100",
    quantity: 1,
    category: "groceries",
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    price: 45,
    image: "/placeholder.svg?height=100&width=100",
    quantity: 2,
    category: "groceries",
  },
  {
    id: "3",
    name: "Paracetamol Tablets",
    price: 25,
    image: "/placeholder.svg?height=100&width=100",
    quantity: 1,
    category: "medicines",
  },
]

export function CartPage() {
  const { playSound } = useAudio()
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
    playSound("click")
  }

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
    playSound("error")
  }

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = 40
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1 className="text-2xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Your Cart
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to see them here.</p>
          <Link href="/customer/products/groceries">
            <Button onClick={() => playSound("click")}>Continue Shopping</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="md:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-gray-500 pb-2 border-b">
                    <span>Product</span>
                    <span>Total</span>
                  </div>

                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center py-4 border-b"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex-shrink-0 mr-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.category === "groceries" ? "Grocery" : "Medicine"}
                          </p>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3 font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end ml-4">
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                          <span className="text-sm text-gray-500">₹{item.price} each</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 mt-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">₹{total}</span>
                  </div>
                </div>

                <Link href="/customer/checkout">
                  <Button className="w-full" size="lg" onClick={() => playSound("click")}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="mt-4">
                  <Link href="/customer/products/groceries">
                    <Button variant="outline" className="w-full" onClick={() => playSound("click")}>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}
