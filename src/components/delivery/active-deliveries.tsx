"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, MessageSquare, Package, Clock, CheckCircle2, Navigation, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"

// Mock data for active deliveries
const deliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-003",
    store: {
      name: "Fresh Grocery Store",
      address: "45 Market Road, Sector 12, Gurgaon",
      phone: "+91 9876543210",
    },
    customer: {
      name: "Rahul Sharma",
      address: "123 Main St, Sector 15, Gurgaon",
      phone: "+91 9876543211",
    },
    items: 5,
    total: 850,
    status: "assigned", // assigned, picked_up
    assignedAt: "12:30 PM",
    estimatedDelivery: "1:15 PM",
    distance: "2.5 km",
    estimatedTime: "15 min",
  },
  {
    id: "DEL-002",
    orderId: "ORD-004",
    store: {
      name: "MediQuick Pharmacy",
      address: "22 Health Avenue, Sector 8, Gurgaon",
      phone: "+91 9876543212",
    },
    customer: {
      name: "Priya Patel",
      address: "45 Park Avenue, Sector 10, Gurgaon",
      phone: "+91 9876543213",
    },
    items: 3,
    total: 450,
    status: "picked_up", // assigned, picked_up
    assignedAt: "11:45 AM",
    estimatedDelivery: "12:30 PM",
    distance: "1.8 km",
    estimatedTime: "10 min",
  },
  {
    id: "DEL-003",
    orderId: "ORD-005",
    store: {
      name: "Organic Basket",
      address: "78 Green Road, Sector 22, Gurgaon",
      phone: "+91 9876543214",
    },
    customer: {
      name: "Amit Kumar",
      address: "78 Green Road, Sector 22, Gurgaon",
      phone: "+91 9876543215",
    },
    items: 7,
    total: 1200,
    status: "assigned", // assigned, picked_up
    assignedAt: "12:15 PM",
    estimatedDelivery: "1:00 PM",
    distance: "3.2 km",
    estimatedTime: "20 min",
  },
]

export function ActiveDeliveries() {
  const { playSound } = useAudio()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filter deliveries based on search query
  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.store.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Deliveries</h1>
        <Badge className="bg-purple-500">{deliveries.length} Active</Badge>
      </div>

      {/* Search */}
      <motion.div className="relative" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search by order ID, customer or store..."
          className="pl-10 h-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Deliveries List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredDeliveries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No active deliveries found</h2>
              <p className="text-gray-500">Try adjusting your search query.</p>
            </CardContent>
          </Card>
        ) : (
          filteredDeliveries.map((delivery, index) => (
            <motion.div
              key={delivery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{delivery.orderId}</span>
                        <Badge
                          className={`ml-2 ${
                            delivery.status === "assigned"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {delivery.status === "assigned" ? "Pickup Pending" : "Out for Delivery"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Assigned at {delivery.assignedAt} • Est. delivery by {delivery.estimatedDelivery}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{delivery.total}</div>
                      <div className="text-sm text-gray-500">{delivery.items} items</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Pickup Information */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start">
                        <div className="mt-1">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">Pickup from</div>
                          <div className="text-sm font-medium">{delivery.store.name}</div>
                          <div className="text-sm text-gray-600">{delivery.store.address}</div>
                          <div className="mt-2 flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => playSound("click")}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => playSound("click")}
                            >
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start">
                        <div className="mt-1">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">Deliver to</div>
                          <div className="text-sm font-medium">{delivery.customer.name}</div>
                          <div className="text-sm text-gray-600">{delivery.customer.address}</div>
                          <div className="mt-2 flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => playSound("click")}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => playSound("click")}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated time: {delivery.estimatedTime}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Distance: {delivery.distance}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {delivery.status === "assigned" ? (
                      <Button className="flex-1" onClick={() => playSound("success")}>
                        <Package className="h-4 w-4 mr-2" />
                        Confirm Pickup
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1" onClick={() => playSound("click")}>
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button className="flex-1" onClick={() => playSound("success")}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Delivered
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
