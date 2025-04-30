"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin, ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAudio } from "@/components/audio-provider"

// Mock data for orders
const orders = [
  {
    id: "ORD-001",
    date: "May 15, 2023",
    status: "delivered",
    total: 850,
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
        quantity: 2,
      },
      {
        id: "3",
        name: "Paracetamol Tablets",
        price: 25,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
      },
    ],
    deliveryAddress: "123 Main St, Sector 15, Gurgaon",
    paymentMethod: "Credit Card",
    rated: true,
  },
  {
    id: "ORD-002",
    date: "May 10, 2023",
    status: "delivered",
    total: 1250,
    items: [
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
    deliveryAddress: "123 Main St, Sector 15, Gurgaon",
    paymentMethod: "UPI",
    rated: false,
  },
  {
    id: "ORD-003",
    date: "May 18, 2023",
    status: "in_transit",
    total: 560,
    items: [
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
    deliveryAddress: "123 Main St, Sector 15, Gurgaon",
    paymentMethod: "Cash on Delivery",
    rated: false,
  },
  {
    id: "ORD-004",
    date: "May 20, 2023",
    status: "processing",
    total: 780,
    items: [
      {
        id: "8",
        name: "Organic Milk 1L",
        price: 60,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 5,
      },
      {
        id: "9",
        name: "Fresh Tomatoes 1kg",
        price: 40,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 2,
      },
    ],
    deliveryAddress: "123 Main St, Sector 15, Gurgaon",
    paymentMethod: "Credit Card",
    rated: false,
  },
  {
    id: "ORD-005",
    date: "May 5, 2023",
    status: "cancelled",
    total: 450,
    items: [
      {
        id: "10",
        name: "Hand Sanitizer 500ml",
        price: 150,
        image: "/placeholder.svg?height=80&width=80",
        quantity: 3,
      },
    ],
    deliveryAddress: "123 Main St, Sector 15, Gurgaon",
    paymentMethod: "UPI",
    rated: false,
  },
]

export function OrdersPage() {
  const { playSound } = useAudio()
  const [isLoaded, setIsLoaded] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [ratingOrder, setRatingOrder] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId))
    playSound("click")
  }

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "active") {
            return ["processing", "in_transit"].includes(order.status)
          } else if (activeTab === "delivered") {
            return order.status === "delivered"
          } else if (activeTab === "cancelled") {
            return order.status === "cancelled"
          }
          return true
        })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "in_transit":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Processing"
      case "in_transit":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRateOrder = (orderId: string) => {
    setRatingOrder(orderId)
    setRating(0)
    playSound("click")
  }

  const submitRating = () => {
    if (rating === 0) return

    playSound("success")
    // In a real app, this would submit the rating to the backend
    console.log(`Submitting rating ${rating} for order ${ratingOrder}`)

    // Close the rating modal
    setRatingOrder(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1 className="text-2xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        My Orders
      </motion.h1>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => {
          setActiveTab(value)
          playSound("click")
        }}
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredOrders.length === 0 ? (
            <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-500 mb-6">
                You don't have any {activeTab !== "all" ? activeTab : ""} orders yet.
              </p>
              <Link href="/customer/products/groceries">
                <Button onClick={() => playSound("click")}>Start Shopping</Button>
              </Link>
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{order.id}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm text-gray-500">{order.date}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {getStatusIcon(order.status)}
                            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="font-semibold">₹{order.total}</div>
                            <div className="text-sm text-gray-500">{order.items.length} items</div>
                          </div>
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t"
                      >
                        <div className="p-4 space-y-4">
                          {/* Order Items */}
                          <div>
                            <h3 className="font-medium mb-2">Order Items</h3>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center">
                                  <div className="flex-shrink-0 mr-3">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      width={50}
                                      height={50}
                                      className="rounded-md"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-500">
                                      Qty: {item.quantity} × ₹{item.price}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">₹{item.price * item.quantity}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h3 className="font-medium mb-1">Delivery Address</h3>
                              <p className="text-gray-600">{order.deliveryAddress}</p>
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">Payment Method</h3>
                              <p className="text-gray-600">{order.paymentMethod}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {order.status === "in_transit" && (
                              <Link href={`/customer/navigation/${order.id}`}>
                                <Button variant="outline" onClick={() => playSound("click")}>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Track Order
                                </Button>
                              </Link>
                            )}

                            {order.status === "delivered" && !order.rated && (
                              <Button variant="outline" onClick={() => handleRateOrder(order.id)}>
                                <Star className="h-4 w-4 mr-2" />
                                Rate Order
                              </Button>
                            )}

                            {order.status === "delivered" && (
                              <Button variant="outline" onClick={() => playSound("click")}>
                                Reorder
                              </Button>
                            )}

                            <Button variant="outline" onClick={() => playSound("click")}>
                              Need Help
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      {ratingOrder && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setRatingOrder(null)}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Rate Your Order</h2>
            <p className="text-gray-600 mb-6">How was your experience with this order?</p>

            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  className="p-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setRating(star)
                    playSound("click")
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRatingOrder(null)}>
                Cancel
              </Button>
              <Button onClick={submitRating} disabled={rating === 0}>
                Submit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
