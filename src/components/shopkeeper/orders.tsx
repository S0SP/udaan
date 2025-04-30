"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"

// Mock data for orders
const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      address: "123 Main St, Sector 15, Gurgaon",
    },
    date: "May 15, 2023",
    time: "10:30 AM",
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
    paymentMethod: "Credit Card",
    deliveryAgent: "Amit Kumar",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Priya Patel",
      phone: "+91 9876543211",
      address: "45 Park Avenue, Sector 10, Gurgaon",
    },
    date: "May 10, 2023",
    time: "11:45 AM",
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
    paymentMethod: "UPI",
    deliveryAgent: "Rajesh Singh",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Amit Kumar",
      phone: "+91 9876543212",
      address: "78 Green Road, Sector 22, Gurgaon",
    },
    date: "May 18, 2023",
    time: "09:15 AM",
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
    paymentMethod: "Cash on Delivery",
    deliveryAgent: "Vikram Joshi",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Neha Singh",
      phone: "+91 9876543213",
      address: "32 Lake View, Sector 30, Gurgaon",
    },
    date: "May 20, 2023",
    time: "02:30 PM",
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
    paymentMethod: "Credit Card",
    deliveryAgent: "Pending Assignment",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Vikram Joshi",
      phone: "+91 9876543214",
      address: "15 Market Road, Sector 5, Gurgaon",
    },
    date: "May 5, 2023",
    time: "04:45 PM",
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
    paymentMethod: "UPI",
    deliveryAgent: "N/A",
  },
]

export function ShopkeeperOrders() {
  const { playSound } = useAudio()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId))
    playSound("click")
  }

  // Filter orders based on search query, status, and date
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    // In a real app, you would have proper date filtering
    const matchesDate = dateFilter === "all" || true

    return matchesSearch && matchesStatus && matchesDate
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => playSound("click")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => playSound("click")}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by order ID or customer name..."
            className="pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="in_transit">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => {
              setShowFilters(!showFilters)
              playSound("click")
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {order.date} at {order.time}
                          </div>
                        </div>

                        <div className="flex items-center mt-2 md:mt-0">
                          {getStatusIcon(order.status)}
                          <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0 gap-4">
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">₹{order.total}</div>
                          <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                        </div>

                        <div className="ml-2">
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Customer Information */}
                          <div>
                            <h3 className="font-medium mb-2">Customer Information</h3>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-gray-600">{order.customer.phone}</div>
                              <div className="text-sm text-gray-600 mt-1">{order.customer.address}</div>
                            </div>
                          </div>

                          {/* Delivery Information */}
                          <div>
                            <h3 className="font-medium mb-2">Delivery Information</h3>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="font-medium">
                                {order.status === "processing" ? "Pending Assignment" : order.deliveryAgent}
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.status === "in_transit"
                                  ? "Out for delivery"
                                  : order.status === "delivered"
                                    ? `Delivered on ${order.date}`
                                    : order.status === "cancelled"
                                      ? "Order cancelled"
                                      : "Preparing order"}
                              </div>
                              <div className="mt-2">
                                <Badge
                                  className={`${
                                    order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {order.paymentMethod}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h3 className="font-medium mb-2">Order Items</h3>
                          <div className="bg-gray-50 p-3 rounded-md">
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

                            <div className="border-t mt-3 pt-3 flex justify-between">
                              <span className="font-medium">Total</span>
                              <span className="font-semibold">₹{order.total}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {order.status === "processing" && (
                            <>
                              <Button onClick={() => playSound("click")}>Assign Delivery Agent</Button>
                              <Button variant="outline" onClick={() => playSound("click")}>
                                Print Invoice
                              </Button>
                            </>
                          )}

                          {order.status === "in_transit" && (
                            <Button onClick={() => playSound("click")}>Track Delivery</Button>
                          )}

                          <Button variant="outline" onClick={() => playSound("click")}>
                            View Details
                          </Button>

                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <Button variant="outline" className="text-red-600" onClick={() => playSound("click")}>
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
