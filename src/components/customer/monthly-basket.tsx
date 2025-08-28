"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ShoppingBag, Calendar, ArrowRight, Plus, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"

// Mock data for monthly baskets
const monthlyBaskets = [
  {
    id: "1",
    name: "April Essentials",
    date: "April 2023",
    items: [
      {
        id: "1",
        name: "Fresh Organic Vegetables Pack",
        price: 299,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
      {
        id: "2",
        name: "Whole Wheat Bread",
        price: 45,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 4,
      },
      {
        id: "3",
        name: "Organic Milk 1L",
        price: 60,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 8,
      },
      {
        id: "4",
        name: "Brown Rice 5kg",
        price: 250,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
      {
        id: "5",
        name: "Vitamin C Supplements",
        price: 350,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    totalItems: 5,
    totalQuantity: 15,
    totalPrice: 1234,
  },
  {
    id: "2",
    name: "March Essentials",
    date: "March 2023",
    items: [
      {
        id: "1",
        name: "Fresh Organic Vegetables Pack",
        price: 299,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
      {
        id: "2",
        name: "Whole Wheat Bread",
        price: 45,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 4,
      },
      {
        id: "6",
        name: "Olive Oil 500ml",
        price: 350,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
      {
        id: "7",
        name: "Mixed Fruit Jam",
        price: 120,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    totalItems: 4,
    totalQuantity: 7,
    totalPrice: 1029,
  },
  {
    id: "3",
    name: "February Essentials",
    date: "February 2023",
    items: [
      {
        id: "3",
        name: "Organic Milk 1L",
        price: 60,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 8,
      },
      {
        id: "4",
        name: "Brown Rice 5kg",
        price: 250,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
      {
        id: "8",
        name: "Paracetamol Tablets",
        price: 25,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 2,
      },
    ],
    totalItems: 3,
    totalQuantity: 11,
    totalPrice: 830,
  },
]

export function MonthlyBasket() {
  const { playSound } = useAudio()
  const [activeBasketIndex, setActiveBasketIndex] = useState(0)
  const [expandedBasket, setExpandedBasket] = useState<string | null>(null)

  const handlePrevBasket = () => {
    setActiveBasketIndex((prev) => (prev === 0 ? monthlyBaskets.length - 1 : prev - 1))
    playSound("click")
  }

  const handleNextBasket = () => {
    setActiveBasketIndex((prev) => (prev === monthlyBaskets.length - 1 ? 0 : prev + 1))
    playSound("click")
  }

  const toggleExpandBasket = (basketId: string) => {
    setExpandedBasket((prev) => (prev === basketId ? null : basketId))
    playSound("click")
  }

  const addToCart = (basketId: string) => {
    playSound("success")
    // In a real app, this would add all items to the cart
      }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1 className="text-2xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Monthly Basket
      </motion.h1>

      <motion.p
        className="text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Reorder your regular items in one click. We've saved your previous orders for easy reordering.
      </motion.p>

      {/* Carousel */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Previous Baskets</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevBasket}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextBasket}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeBasketIndex * 100}%)` }}
          >
            {monthlyBaskets.map((basket) => (
              <div key={basket.id} className="w-full flex-shrink-0 px-1">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{basket.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {basket.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{basket.totalItems} items</div>
                        <div className="font-semibold text-blue-600">₹{basket.totalPrice}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {basket.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md border border-gray-200"
                          />
                          {item.quantity > 1 && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                      {basket.items.length > 3 && (
                        <div className="relative bg-gray-100 w-[50px] h-[50px] rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{basket.items.length - 3}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => toggleExpandBasket(basket.id)}>
                        View Details
                      </Button>
                      <Button className="flex-1" onClick={() => addToCart(basket.id)}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex justify-center mt-4">
          {monthlyBaskets.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${index === activeBasketIndex ? "bg-blue-600" : "bg-gray-300"}`}
              onClick={() => {
                setActiveBasketIndex(index)
                playSound("click")
              }}
            />
          ))}
        </div>
      </div>

      {/* Basket Details */}
      {monthlyBaskets.map((basket) => (
        <motion.div
          key={basket.id}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: expandedBasket === basket.id ? "auto" : 0,
            opacity: expandedBasket === basket.id ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{basket.name} - Detailed View</h3>
                <Button variant="outline" size="sm" onClick={() => toggleExpandBasket(basket.id)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                {basket.items.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b">
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                    </div>

                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                      <div className="text-sm text-gray-500">₹{item.price} each</div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4 font-semibold">
                  <span>Total ({basket.totalQuantity} items):</span>
                  <span className="text-blue-600">₹{basket.totalPrice}</span>
                </div>

                <Button className="w-full" onClick={() => addToCart(basket.id)}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add All Items to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Create New Basket */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-dashed border-2 border-blue-200">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create a New Monthly Basket</h3>
            <p className="text-gray-600 mb-6">
              Build a custom basket with your regular items for easy reordering every month.
            </p>
            <Button onClick={() => playSound("click")}>
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
