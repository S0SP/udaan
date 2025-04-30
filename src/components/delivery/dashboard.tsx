"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, TrendingUp, Clock, CheckCircle2, MapPin, ArrowUpRight, ArrowDownRight, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"

// Mock data for stats
const statsData = [
  {
    title: "Today's Deliveries",
    value: 0,
    targetValue: 8,
    icon: Package,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    change: "+2",
    changeType: "positive",
  },
  {
    title: "Today's Earnings",
    value: 0,
    targetValue: 1250,
    prefix: "₹",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-100",
    change: "+15%",
    changeType: "positive",
  },
  {
    title: "Avg. Delivery Time",
    value: 0,
    targetValue: 22,
    suffix: "min",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    change: "-3min",
    changeType: "positive",
  },
  {
    title: "Completion Rate",
    value: 0,
    targetValue: 98,
    suffix: "%",
    icon: CheckCircle2,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    change: "+2%",
    changeType: "positive",
  },
]

// Mock data for assigned deliveries
const assignedDeliveries = [
  {
    id: "DEL-001",
    store: "Fresh Grocery Store",
    customer: "Rahul Sharma",
    address: "123 Main St, Sector 15, Gurgaon",
    items: 5,
    status: "assigned",
    time: "10 minutes ago",
    distance: "2.5 km",
    estimatedTime: "15 min",
  },
  {
    id: "DEL-002",
    store: "MediQuick Pharmacy",
    customer: "Priya Patel",
    address: "45 Park Avenue, Sector 10, Gurgaon",
    items: 3,
    status: "picked_up",
    time: "25 minutes ago",
    distance: "1.8 km",
    estimatedTime: "10 min",
  },
  {
    id: "DEL-003",
    store: "Organic Basket",
    customer: "Amit Kumar",
    address: "78 Green Road, Sector 22, Gurgaon",
    items: 7,
    status: "assigned",
    time: "5 minutes ago",
    distance: "3.2 km",
    estimatedTime: "20 min",
  },
]

export function DeliveryDashboard() {
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
      case "assigned":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "picked_up":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "assigned":
        return "Assigned"
      case "picked_up":
        return "Picked Up"
      case "delivered":
        return "Delivered"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800"
      case "picked_up":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => playSound("click")}>
            Go Offline
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
                  {stat.suffix && stat.suffix}
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

      {/* Assigned Deliveries */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Assigned Deliveries</CardTitle>
              <Badge className="bg-purple-500">{assignedDeliveries.length} Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedDeliveries.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{delivery.store}</h3>
                        <p className="text-sm text-gray-500">{delivery.id}</p>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(delivery.status)}
                        <span className={`ml-1 text-xs px-2 py-1 rounded-full ${getStatusClass(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{delivery.customer}</p>
                        <p className="text-sm text-gray-600">{delivery.address}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {delivery.distance}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {delivery.estimatedTime}
                          </span>
                          <span className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            {delivery.items} items
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {delivery.status === "assigned" ? (
                        <Button className="flex-1" onClick={() => playSound("success")}>
                          Pick Up Order
                        </Button>
                      ) : delivery.status === "picked_up" ? (
                        <>
                          <Button variant="outline" className="flex-1" onClick={() => playSound("click")}>
                            <MapPin className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                          <Button className="flex-1" onClick={() => playSound("success")}>
                            Mark Delivered
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" className="flex-1" onClick={() => playSound("click")}>
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delivery Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Map view will be displayed here</p>
                <Button variant="outline" className="mt-4" onClick={() => playSound("click")}>
                  Open Navigation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
