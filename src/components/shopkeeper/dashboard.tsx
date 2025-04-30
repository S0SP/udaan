"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Scan,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-provider"

// Mock data for stats
const statsData = [
  {
    title: "Today's Orders",
    value: 0,
    targetValue: 24,
    icon: ShoppingCart,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    change: "+12%",
    changeType: "positive",
  },
  {
    title: "Today's Revenue",
    value: 0,
    targetValue: 12580,
    prefix: "₹",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-100",
    change: "+18%",
    changeType: "positive",
  },
  {
    title: "New Customers",
    value: 0,
    targetValue: 8,
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    change: "-3%",
    changeType: "negative",
  },
  {
    title: "Low Stock Items",
    value: 0,
    targetValue: 12,
    icon: Package,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    change: "+4",
    changeType: "neutral",
  },
]

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: "Rahul Sharma",
    items: 5,
    total: 450,
    status: "pending",
    time: "10 minutes ago",
  },
  {
    id: "ORD-002",
    customer: "Priya Patel",
    items: 3,
    total: 280,
    status: "processing",
    time: "25 minutes ago",
  },
  {
    id: "ORD-003",
    customer: "Amit Kumar",
    items: 7,
    total: 890,
    status: "completed",
    time: "1 hour ago",
  },
  {
    id: "ORD-004",
    customer: "Neha Singh",
    items: 2,
    total: 150,
    status: "cancelled",
    time: "2 hours ago",
  },
  {
    id: "ORD-005",
    customer: "Vikram Joshi",
    items: 4,
    total: 320,
    status: "out_for_delivery",
    time: "45 minutes ago",
  },
]

export function ShopkeeperDashboard() {
  const { playSound } = useAudio()
  const [animatedStats, setAnimatedStats] = useState(statsData.map((stat) => ({ ...stat, value: 0 })))

  // Animate stats on load
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats((prev) =>
        prev.map((stat, index) => {
          if (stat.value >= statsData[index].targetValue) {
            clearInterval(interval)
            return stat
          }

          const step = Math.ceil(statsData[index].targetValue / 50)
          const newValue = Math.min(stat.value + step, statsData[index].targetValue)

          if (newValue === statsData[index].targetValue && index === 0) {
            playSound("success")
          }

          return { ...stat, value: newValue }
        }),
      )
    }, 30)

    return () => clearInterval(interval)
  }, [playSound])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "out_for_delivery":
        return <Truck className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      case "out_for_delivery":
        return "Out for Delivery"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => playSound("click")}>
            Export
          </Button>
          <Button onClick={() => playSound("click")}>Refresh</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {animatedStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.prefix && stat.prefix}
                  {stat.value.toLocaleString()}
                </div>
                <div className="flex items-center mt-1">
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : stat.changeType === "negative" ? (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  ) : null}
                  <p
                    className={`text-xs ${
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : stat.changeType === "negative"
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  >
                    {stat.change} from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" className="text-blue-600" onClick={() => playSound("click")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                      <td className="px-4 py-3 text-sm">{order.customer}</td>
                      <td className="px-4 py-3 text-sm">{order.items}</td>
                      <td className="px-4 py-3 text-sm font-medium">₹{order.total}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`ml-1 text-xs px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{order.time}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-blue-600"
                          onClick={() => playSound("click")}
                        >
                          Details
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => playSound("click")}
              >
                <Scan className="h-5 w-5" />
                <span>Scan Inventory</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => playSound("click")}
              >
                <Package className="h-5 w-5" />
                <span>Add Product</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => playSound("click")}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>New Order</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => playSound("click")}
              >
                <TrendingUp className="h-5 w-5" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
