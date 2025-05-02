"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Download, TrendingUp, Wallet, CreditCard, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAudio } from "@/components/audio-provider"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// Mock data for earnings
const earningsData = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Earnings",
        data: [450, 520, 380, 600, 520, 750, 680],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        tension: 0.3,
      },
    ],
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Earnings",
        data: [2800, 3200, 2900, 3500],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        tension: 0.3,
      },
    ],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Earnings",
        data: [12000, 13500, 11800, 14200, 15500, 16800],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        tension: 0.3,
      },
    ],
  },
}

// Mock data for deliveries
const deliveriesData = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Deliveries",
        data: [5, 6, 4, 8, 7, 10, 9],
        backgroundColor: "rgba(147, 51, 234, 0.7)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
      },
    ],
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Deliveries",
        data: [32, 38, 35, 42],
        backgroundColor: "rgba(147, 51, 234, 0.7)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
      },
    ],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Deliveries",
        data: [145, 160, 138, 172, 185, 198],
        backgroundColor: "rgba(147, 51, 234, 0.7)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
      },
    ],
  },
}

// Mock data for recent payments
const recentPayments = [
  {
    id: "PAY-001",
    date: "May 15, 2023",
    amount: 3250,
    deliveries: 42,
    status: "completed",
  },
  {
    id: "PAY-002",
    date: "May 1, 2023",
    amount: 2850,
    deliveries: 38,
    status: "completed",
  },
  {
    id: "PAY-003",
    date: "Apr 15, 2023",
    amount: 3100,
    deliveries: 40,
    status: "completed",
  },
]

export function EarningsPage() {
  const { playSound } = useAudio()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => playSound("click")}>
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button onClick={() => playSound("click")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-purple-500" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹16,800</div>
              <div className="flex items-center mt-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+8.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-500" />
                Total Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">198</div>
              <div className="flex items-center mt-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+7.0% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                Next Payout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹3,450</div>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Expected on May 31, 2023</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <Tabs
        defaultValue="daily"
        onValueChange={(value) => {
          playSound("click")
        }}
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {["daily", "weekly", "monthly"].map((period) => (
          <TabsContent key={period} value={period} className="space-y-6">
            {/* Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
                    Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line options={chartOptions} data={earningsData[period as keyof typeof earningsData]} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Deliveries Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-500" />
                    Deliveries Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar options={chartOptions} data={deliveriesData[period as keyof typeof deliveriesData]} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                    Recent Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium">{payment.id}</div>
                          <div className="text-sm text-gray-500">{payment.date}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Deliveries</div>
                          <div className="font-medium">{payment.deliveries}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{payment.amount}</div>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            {payment.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
