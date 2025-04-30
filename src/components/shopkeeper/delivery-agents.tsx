"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Truck, Phone, MessageSquare, Star, Filter, Search, Plus, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAudio } from "@/components/audio-provider"

// Mock data for delivery agents
const deliveryAgents = [
  {
    id: "1",
    name: "Rahul Kumar",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+91 9876543210",
    type: "gig",
    status: "active",
    rating: 4.8,
    totalDeliveries: 156,
    area: "Sector 15, Gurgaon",
    onlineStatus: "online",
    currentlyAssigned: 2,
    maxCapacity: 5,
  },
  {
    id: "2",
    name: "Priya Singh",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+91 9876543211",
    type: "full-time",
    status: "active",
    rating: 4.9,
    totalDeliveries: 243,
    area: "Sector 14, Gurgaon",
    onlineStatus: "online",
    currentlyAssigned: 3,
    maxCapacity: 5,
  },
  {
    id: "3",
    name: "Amit Sharma",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+91 9876543212",
    type: "gig",
    status: "active",
    rating: 4.5,
    totalDeliveries: 87,
    area: "Sector 17, Gurgaon",
    onlineStatus: "offline",
    currentlyAssigned: 0,
    maxCapacity: 4,
  },
  {
    id: "4",
    name: "Neha Patel",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+91 9876543213",
    type: "3rd-party",
    status: "active",
    rating: 4.7,
    totalDeliveries: 112,
    area: "Sector 18, Gurgaon",
    onlineStatus: "online",
    currentlyAssigned: 1,
    maxCapacity: 3,
  },
  {
    id: "5",
    name: "Vikram Joshi",
    image: "/placeholder.svg?height=100&width=100",
    phone: "+91 9876543214",
    type: "full-time",
    status: "inactive",
    rating: 4.2,
    totalDeliveries: 65,
    area: "Sector 16, Gurgaon",
    onlineStatus: "offline",
    currentlyAssigned: 0,
    maxCapacity: 5,
  },
]

// Mock data for delivery history
const deliveryHistory = [
  {
    id: "DEL-001",
    agentId: "1",
    agentName: "Rahul Kumar",
    agentType: "gig",
    orderId: "ORD-001",
    date: "2023-05-15",
    shop: "Fresh Grocery Store",
    status: "delivered",
    rating: 5,
  },
  {
    id: "DEL-002",
    agentId: "2",
    agentName: "Priya Singh",
    agentType: "full-time",
    orderId: "ORD-002",
    date: "2023-05-15",
    shop: "MediQuick Pharmacy",
    status: "delivered",
    rating: 5,
  },
  {
    id: "DEL-003",
    agentId: "1",
    agentName: "Rahul Kumar",
    agentType: "gig",
    orderId: "ORD-003",
    date: "2023-05-14",
    shop: "Organic Basket",
    status: "delivered",
    rating: 4,
  },
  {
    id: "DEL-004",
    agentId: "3",
    agentName: "Amit Sharma",
    agentType: "gig",
    orderId: "ORD-004",
    date: "2023-05-14",
    shop: "Fresh Grocery Store",
    status: "cancelled",
    rating: 0,
  },
  {
    id: "DEL-005",
    agentId: "4",
    agentName: "Neha Patel",
    agentType: "3rd-party",
    orderId: "ORD-005",
    date: "2023-05-13",
    shop: "MediQuick Pharmacy",
    status: "delivered",
    rating: 5,
  },
  {
    id: "DEL-006",
    agentId: "2",
    agentName: "Priya Singh",
    agentType: "full-time",
    orderId: "ORD-006",
    date: "2023-05-13",
    shop: "Organic Basket",
    status: "delivered",
    rating: 5,
  },
  {
    id: "DEL-007",
    agentId: "1",
    agentName: "Rahul Kumar",
    agentType: "gig",
    orderId: "ORD-007",
    date: "2023-05-12",
    shop: "Fresh Grocery Store",
    status: "delivered",
    rating: 5,
  },
  {
    id: "DEL-008",
    agentId: "5",
    agentName: "Vikram Joshi",
    agentType: "full-time",
    orderId: "ORD-008",
    date: "2023-05-12",
    shop: "MediQuick Pharmacy",
    status: "delivered",
    rating: 4,
  },
]

export function DeliveryAgents() {
  const { playSound } = useAudio()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("agents")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [filteredAgents, setFilteredAgents] = useState(deliveryAgents)
  const [filteredHistory, setFilteredHistory] = useState(deliveryHistory)

  // Filter agents based on search and filters
  useEffect(() => {
    let filtered = deliveryAgents

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (agent) => agent.name.toLowerCase().includes(query) || agent.area.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((agent) => agent.type === filterType)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((agent) =>
        filterStatus === "online" ? agent.onlineStatus === "online" : agent.status === filterStatus,
      )
    }

    setFilteredAgents(filtered)
  }, [searchQuery, filterType, filterStatus])

  // Filter history based on selected agent
  useEffect(() => {
    if (selectedAgent) {
      setFilteredHistory(deliveryHistory.filter((history) => history.agentId === selectedAgent))
    } else {
      setFilteredHistory(deliveryHistory)
    }
  }, [selectedAgent])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getAgentTypeBadge = (type: string) => {
    switch (type) {
      case "gig":
        return <Badge className="bg-blue-500">Gig Worker</Badge>
      case "full-time":
        return <Badge className="bg-green-500">Full-Time</Badge>
      case "3rd-party":
        return <Badge className="bg-purple-500">3rd Party</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Agents</h1>
        <Button onClick={() => playSound("click")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Agent
        </Button>
      </div>

      <Tabs
        defaultValue="agents"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          setSelectedAgent(null)
          playSound("click")
        }}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="agents">Delivery Agents</TabsTrigger>
          <TabsTrigger value="history">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search by name or area..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-40">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="gig">Gig Worker</SelectItem>
                          <SelectItem value="full-time">Full-Time</SelectItem>
                          <SelectItem value="3rd-party">3rd Party</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setFilterType("all")
                        setFilterStatus("all")
                        playSound("click")
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Agents List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgents.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 text-center py-12">
                <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No agents found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setFilterType("all")
                    setFilterStatus("all")
                    playSound("click")
                  }}
                >
                  Reset Filters
                </Button>
              </motion.div>
            ) : (
              filteredAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedAgent(selectedAgent === agent.id ? null : agent.id)
                    setActiveTab("history")
                    playSound("click")
                  }}
                >
                  <Card
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedAgent === agent.id ? "border-blue-300 shadow-md" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                            <Image
                              src={agent.image || "/placeholder.svg"}
                              alt={agent.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${agent.onlineStatus === "online" ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {agent.area}
                              </div>
                              <div className="mt-1">
                                {getAgentTypeBadge(agent.type)}
                                <Badge className={`ml-2 ${agent.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
                                  {agent.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Rating</div>
                              {renderStarRating(agent.rating)}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-gray-500">Total Deliveries:</span> {agent.totalDeliveries}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Assigned:</span> {agent.currentlyAssigned}/
                              {agent.maxCapacity}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  playSound("click")
                                }}
                              >
                                <Phone className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  playSound("click")
                                }}
                              >
                                <MessageSquare className="h-4 w-4 text-green-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* History Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Delivery History</h3>
                    {selectedAgent && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Filtered by agent:</span>
                        <Badge className="bg-blue-500">
                          {deliveryAgents.find((a) => a.id === selectedAgent)?.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-7 text-gray-500"
                          onClick={() => {
                            setSelectedAgent(null)
                            playSound("click")
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* History Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Delivery ID</th>
                        <th className="px-4 py-3">Agent</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Shop</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            No delivery history found
                          </td>
                        </tr>
                      ) : (
                        filteredHistory.map((delivery, index) => (
                          <motion.tr
                            key={delivery.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm font-medium">{delivery.id}</td>
                            <td className="px-4 py-3 text-sm">{delivery.agentName}</td>
                            <td className="px-4 py-3 text-sm">{getAgentTypeBadge(delivery.agentType)}</td>
                            <td className="px-4 py-3 text-sm">{delivery.orderId}</td>
                            <td className="px-4 py-3 text-sm">{delivery.date}</td>
                            <td className="px-4 py-3 text-sm">{delivery.shop}</td>
                            <td className="px-4 py-3 text-sm">{getStatusBadge(delivery.status)}</td>
                            <td className="px-4 py-3 text-sm">
                              {delivery.status === "cancelled" ? (
                                <span className="text-gray-500">N/A</span>
                              ) : (
                                renderStarRating(delivery.rating)
                              )}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
