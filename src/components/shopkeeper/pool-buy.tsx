"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Plus,
  Wallet,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAudio } from "@/components/audio-provider"

// Mock data for active pools
const activePools = [
  {
    id: "1",
    product: "Organic Rice (Premium)",
    image: "/placeholder.svg?height=100&width=100",
    targetQuantity: 500,
    unit: "kg",
    currentContributors: 7,
    maxContributors: 10,
    pricePerUnit: 60,
    totalAmount: 30000,
    amountRaised: 21000,
    deadline: "2023-05-30",
    status: "active",
    nearbyShops: 5,
    timeline: [
      { status: "created", completed: true, timestamp: "2023-05-10 10:00 AM" },
      { status: "funding", completed: true, timestamp: "2023-05-10 10:05 AM" },
      { status: "filled", completed: false },
      { status: "ordered", completed: false },
      { status: "shipped", completed: false },
      { status: "delivered", completed: false },
    ],
  },
  {
    id: "2",
    product: "Wheat Flour (Chakki Atta)",
    image: "/placeholder.svg?height=100&width=100",
    targetQuantity: 1000,
    unit: "kg",
    currentContributors: 8,
    maxContributors: 15,
    pricePerUnit: 40,
    totalAmount: 40000,
    amountRaised: 32000,
    deadline: "2023-05-25",
    status: "active",
    nearbyShops: 7,
    timeline: [
      { status: "created", completed: true, timestamp: "2023-05-08 11:30 AM" },
      { status: "funding", completed: true, timestamp: "2023-05-08 11:35 AM" },
      { status: "filled", completed: false },
      { status: "ordered", completed: false },
      { status: "shipped", completed: false },
      { status: "delivered", completed: false },
    ],
  },
  {
    id: "3",
    product: "Sugar (Refined)",
    image: "/placeholder.svg?height=100&width=100",
    targetQuantity: 300,
    unit: "kg",
    currentContributors: 5,
    maxContributors: 8,
    pricePerUnit: 50,
    totalAmount: 15000,
    amountRaised: 9000,
    deadline: "2023-05-28",
    status: "active",
    nearbyShops: 3,
    timeline: [
      { status: "created", completed: true, timestamp: "2023-05-12 09:15 AM" },
      { status: "funding", completed: true, timestamp: "2023-05-12 09:20 AM" },
      { status: "filled", completed: false },
      { status: "ordered", completed: false },
      { status: "shipped", completed: false },
      { status: "delivered", completed: false },
    ],
  },
]

// Mock data for completed pools
const completedPools = [
  {
    id: "4",
    product: "Cooking Oil (Refined)",
    image: "/placeholder.svg?height=100&width=100",
    targetQuantity: 400,
    unit: "L",
    currentContributors: 10,
    maxContributors: 10,
    pricePerUnit: 120,
    totalAmount: 48000,
    amountRaised: 48000,
    deadline: "2023-05-05",
    status: "completed",
    nearbyShops: 10,
    timeline: [
      { status: "created", completed: true, timestamp: "2023-04-20 10:00 AM" },
      { status: "funding", completed: true, timestamp: "2023-04-20 10:05 AM" },
      { status: "filled", completed: true, timestamp: "2023-04-25 11:30 AM" },
      { status: "ordered", completed: true, timestamp: "2023-04-26 09:00 AM" },
      { status: "shipped", completed: true, timestamp: "2023-04-28 02:15 PM" },
      { status: "delivered", completed: true, timestamp: "2023-05-02 10:45 AM" },
    ],
  },
  {
    id: "5",
    product: "Pulses Assortment",
    image: "/placeholder.svg?height=100&width=100",
    targetQuantity: 250,
    unit: "kg",
    currentContributors: 6,
    maxContributors: 6,
    pricePerUnit: 90,
    totalAmount: 22500,
    amountRaised: 22500,
    deadline: "2023-05-01",
    status: "completed",
    nearbyShops: 6,
    timeline: [
      { status: "created", completed: true, timestamp: "2023-04-15 02:00 PM" },
      { status: "funding", completed: true, timestamp: "2023-04-15 02:05 PM" },
      { status: "filled", completed: true, timestamp: "2023-04-20 03:30 PM" },
      { status: "ordered", completed: true, timestamp: "2023-04-21 10:00 AM" },
      { status: "shipped", completed: true, timestamp: "2023-04-24 01:15 PM" },
      { status: "delivered", completed: true, timestamp: "2023-04-28 11:45 AM" },
    ],
  },
]

export function PoolBuy() {
  const { toast } = useToast()
  const { playSound } = useAudio()
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [contributionAmount, setContributionAmount] = useState("")
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const [isContributing, setIsContributing] = useState(false)
  const [activeTab, setActiveTab] = useState("active")

  const handleSelectPool = (poolId: string) => {
    setSelectedPool(poolId)
    setContributionAmount("")
    playSound("click")
  }

  const handleConnectWallet = () => {
    setIsConnectingWallet(true)
    playSound("click")

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnectingWallet(false)
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      })
      playSound("success")
    }, 1500)
  }

  const handleContribute = () => {
    if (!contributionAmount || Number.parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive",
      })
      playSound("error")
      return
    }

    setIsContributing(true)
    playSound("click")

    // Simulate contribution process
    setTimeout(() => {
      setIsContributing(false)

      // Update the pool data (in a real app, this would be done via API)
      const pool = [...activePools, ...completedPools].find((p) => p.id === selectedPool)
      if (pool) {
        pool.amountRaised = Math.min(pool.totalAmount, pool.amountRaised + Number.parseFloat(contributionAmount))
        pool.currentContributors += 1

        if (pool.amountRaised >= pool.totalAmount) {
          const timelineIndex = pool.timeline.findIndex((t) => t.status === "filled")
          if (timelineIndex >= 0) {
            pool.timeline[timelineIndex].completed = true
            pool.timeline[timelineIndex].timestamp = new Date().toLocaleString()
          }
        }
      }

      toast({
        title: "Contribution Successful",
        description: `You have successfully contributed ₹${contributionAmount} to the pool.`,
      })
      playSound("success")

      // Reset form
      setContributionAmount("")
      setSelectedPool(null)
    }, 2000)
  }

  const getProgressPercentage = (amountRaised: number, totalAmount: number) => {
    return Math.min(100, Math.round((amountRaised / totalAmount) * 100))
  }

  const formatTimelineStatus = (status: string) => {
    switch (status) {
      case "created":
        return "Pool Created"
      case "funding":
        return "Funding Started"
      case "filled":
        return "Funding Complete"
      case "ordered":
        return "Order Placed"
      case "shipped":
        return "Shipment in Transit"
      case "delivered":
        return "Delivered"
      default:
        return status
    }
  }

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case "created":
        return ShoppingBag
      case "funding":
        return Wallet
      case "filled":
        return CheckCircle2
      case "ordered":
        return Package
      case "shipped":
        return Truck
      case "delivered":
        return CheckCircle2
      default:
        return Clock
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pool Buy</h1>
        <Button onClick={() => playSound("click")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Pool
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold mb-2">Collective Purchasing Power</h2>
                <p className="text-gray-600 mb-4">
                  Join forces with other local shopkeepers to buy inventory in bulk at wholesale prices. Pool Buy helps
                  you reduce costs, increase margins, and build community.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Save 15-25%</div>
                      <div className="text-sm text-gray-500">on bulk purchases</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">25+ Shops</div>
                      <div className="text-sm text-gray-500">in your local network</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Truck className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Free Delivery</div>
                      <div className="text-sm text-gray-500">on all pool orders</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Pool Buy Illustration"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          playSound("click")
        }}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active Pools</TabsTrigger>
          <TabsTrigger value="completed">Completed Pools</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activePools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={selectedPool === pool.id ? "border-blue-300 shadow-md" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={pool.image || "/placeholder.svg"}
                          alt={pool.product}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{pool.product}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Package className="h-4 w-4 mr-1" />
                            Target: {pool.targetQuantity} {pool.unit}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            {pool.currentContributors}/{pool.maxContributors} shops participating
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {pool.nearbyShops} shops in your area (2km radius)
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-2xl font-bold">
                            ₹{pool.pricePerUnit}/{pool.unit}
                          </div>
                          <div className="text-sm text-gray-500">
                            Market price: ₹{Math.round(pool.pricePerUnit * 1.2)}/{pool.unit}
                          </div>
                          <Badge className="mt-2 bg-green-500">
                            Save {Math.round((1 - pool.pricePerUnit / (pool.pricePerUnit * 1.2)) * 100)}%
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress: {getProgressPercentage(pool.amountRaised, pool.totalAmount)}%</span>
                          <span>
                            ₹{pool.amountRaised.toLocaleString()} of ₹{pool.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(pool.amountRaised, pool.totalAmount)} className="h-2" />
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2">
                          <h4 className="font-medium mb-2">Order Timeline</h4>
                          <div className="relative pl-6 border-l border-gray-200 space-y-2">
                            {pool.timeline.map((item, i) => (
                              <div key={i} className="relative">
                                <div
                                  className={`absolute -left-[25px] w-5 h-5 rounded-full ${item.completed ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center`}
                                >
                                  {React.createElement(getTimelineIcon(item.status), {
                                    className: `h-3 w-3 ${item.completed ? "text-green-600" : "text-gray-400"}`,
                                  })}
                                </div>
                                <div className={`text-sm ${item.completed ? "text-gray-800" : "text-gray-400"}`}>
                                  {formatTimelineStatus(item.status)}
                                  {item.timestamp && (
                                    <span className="text-xs text-gray-500 ml-2">{item.timestamp}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:w-1/2">
                          <h4 className="font-medium mb-2">Contribute to Pool</h4>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Enter amount (₹)"
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(e.target.value)}
                                disabled={selectedPool !== pool.id}
                              />
                              {selectedPool !== pool.id ? (
                                <Button onClick={() => handleSelectPool(pool.id)}>Select</Button>
                              ) : (
                                <Button variant="outline" onClick={() => setSelectedPool(null)}>
                                  Cancel
                                </Button>
                              )}
                            </div>
                            {selectedPool === pool.id && (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                  <p>Minimum contribution: ₹1,000</p>
                                  <p>Expected delivery: {new Date(pool.deadline).toLocaleDateString()}</p>
                                </div>
                                <Button className="w-full" onClick={handleConnectWallet} disabled={isConnectingWallet}>
                                  {isConnectingWallet ? (
                                    <>
                                      <Wallet className="h-4 w-4 mr-2 animate-spin" />
                                      Connecting Wallet...
                                    </>
                                  ) : (
                                    <>
                                      <Wallet className="h-4 w-4 mr-2" />
                                      Connect Wallet
                                    </>
                                  )}
                                </Button>
                                <Button
                                  className="w-full"
                                  onClick={handleContribute}
                                  disabled={isContributing || !contributionAmount}
                                >
                                  {isContributing ? (
                                    <>
                                      <Wallet className="h-4 w-4 mr-2 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>Join Pool (Stake ₹{contributionAmount || "0"})</>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={pool.image || "/placeholder.svg"}
                          alt={pool.product}
                          fill
                          className="object-contain p-2"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500">Completed</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{pool.product}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Package className="h-4 w-4 mr-1" />
                            Purchased: {pool.targetQuantity} {pool.unit}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            {pool.currentContributors} shops participated
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-2xl font-bold">
                            ₹{pool.pricePerUnit}/{pool.unit}
                          </div>
                          <div className="text-sm text-gray-500">
                            Market price: ₹{Math.round(pool.pricePerUnit * 1.2)}/{pool.unit}
                          </div>
                          <Badge className="mt-2 bg-green-500">
                            Saved {Math.round((1 - pool.pricePerUnit / (pool.pricePerUnit * 1.2)) * 100)}%
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Final Amount: ₹{pool.totalAmount.toLocaleString()}</span>
                          <span>Completed on {pool.timeline[5].timestamp}</span>
                        </div>
                        <Progress value={100} className="h-2 bg-green-100" />
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2">
                          <h4 className="font-medium mb-2">Order Timeline</h4>
                          <div className="relative pl-6 border-l border-gray-200 space-y-2">
                            {pool.timeline.map((item, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                  {React.createElement(getTimelineIcon(item.status), {
                                    className: "h-3 w-3 text-green-600",
                                  })}
                                </div>
                                <div className="text-sm text-gray-800">
                                  {formatTimelineStatus(item.status)}
                                  {item.timestamp && (
                                    <span className="text-xs text-gray-500 ml-2">{item.timestamp}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:w-1/2">
                          <h4 className="font-medium mb-2">Pool Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Quantity:</span>
                              <span>
                                {pool.targetQuantity} {pool.unit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price Per Unit:</span>
                              <span>₹{pool.pricePerUnit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Amount:</span>
                              <span>₹{pool.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Participants:</span>
                              <span>{pool.currentContributors} shops</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery Date:</span>
                              <span>{pool.timeline[5].timestamp}</span>
                            </div>
                            <div className="mt-4">
                              <Button variant="outline" className="w-full" onClick={() => playSound("click")}>
                                View Details
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
