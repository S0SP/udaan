"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-provider"
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, BarChart3, LineChart, PieChart } from "lucide-react"
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
  ArcElement,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

// Mock data for competitive analysis
const topPerformers = [
  { id: 1, name: "Organic Milk 1L", sales: 120, growth: 15, category: "Dairy" },
  { id: 2, name: "Whole Wheat Bread", sales: 95, growth: 8, category: "Bakery" },
  { id: 3, name: "Fresh Tomatoes 1kg", sales: 85, growth: 5, category: "Vegetables" },
  { id: 4, name: "Vitamin C Supplements", sales: 75, growth: 12, category: "Medicines" },
  { id: 5, name: "Brown Rice 5kg", sales: 65, growth: 3, category: "Grains" },
]

const underperformers = [
  { id: 1, name: "Canned Tuna", sales: 15, growth: -12, category: "Canned Goods" },
  { id: 2, name: "White Bread", sales: 25, growth: -8, category: "Bakery" },
  { id: 3, name: "Potato Chips", sales: 30, growth: -5, category: "Snacks" },
  { id: 4, name: "Cough Syrup", sales: 18, growth: -10, category: "Medicines" },
  { id: 5, name: "Instant Noodles", sales: 22, growth: -7, category: "Ready Meals" },
]

const supplyShortages = [
  { id: 1, name: "Fresh Apples", daysUntilShortage: 5, category: "Fruits", severity: "high" },
  { id: 2, name: "Chicken Breast", daysUntilShortage: 7, category: "Meat", severity: "medium" },
  { id: 3, name: "Paracetamol", daysUntilShortage: 10, category: "Medicines", severity: "medium" },
  { id: 4, name: "Toilet Paper", daysUntilShortage: 12, category: "Household", severity: "low" },
  { id: 5, name: "Hand Sanitizer", daysUntilShortage: 8, category: "Hygiene", severity: "medium" },
]

export function CompetitiveAnalysis() {
  const { playSound } = useAudio()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Sales trend data
  const salesTrendData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Your Store",
          data: [12500, 13200, 12800, 14500, 15200, 16800, 15500],
          borderColor: "rgb(0, 170, 255)",
          backgroundColor: "rgba(0, 170, 255, 0.5)",
          tension: 0.3,
        },
        {
          label: "Competitor Avg",
          data: [11800, 12500, 12200, 13800, 14500, 15200, 14800],
          borderColor: "rgb(126, 217, 87)",
          backgroundColor: "rgba(126, 217, 87, 0.5)",
          tension: 0.3,
        },
      ],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Your Store",
          data: [85000, 92000, 98000, 105000],
          borderColor: "rgb(0, 170, 255)",
          backgroundColor: "rgba(0, 170, 255, 0.5)",
          tension: 0.3,
        },
        {
          label: "Competitor Avg",
          data: [82000, 88000, 93000, 97000],
          borderColor: "rgb(126, 217, 87)",
          backgroundColor: "rgba(126, 217, 87, 0.5)",
          tension: 0.3,
        },
      ],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Your Store",
          data: [320000, 350000, 380000, 410000, 450000, 480000],
          borderColor: "rgb(0, 170, 255)",
          backgroundColor: "rgba(0, 170, 255, 0.5)",
          tension: 0.3,
        },
        {
          label: "Competitor Avg",
          data: [310000, 330000, 360000, 385000, 420000, 450000],
          borderColor: "rgb(126, 217, 87)",
          backgroundColor: "rgba(126, 217, 87, 0.5)",
          tension: 0.3,
        },
      ],
    },
  }

  // Category performance data
  const categoryPerformanceData = {
    labels: ["Groceries", "Dairy", "Bakery", "Fruits", "Vegetables", "Medicines", "Household"],
    datasets: [
      {
        label: "Sales",
        data: [25000, 18000, 15000, 12000, 22000, 16000, 14000],
        backgroundColor: [
          "rgba(0, 170, 255, 0.7)",
          "rgba(126, 217, 87, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
        borderColor: [
          "rgb(0, 170, 255)",
          "rgb(126, 217, 87)",
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(75, 192, 192)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Forecast data
  const forecastData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        type: "line" as const,
        label: "Demand Forecast",
        borderColor: "rgb(0, 170, 255)",
        borderWidth: 2,
        fill: false,
        data: [12000, 13500, 15000, 14000, 16500, 18000],
        tension: 0.3,
      },
      {
        type: "line" as const,
        label: "Supply Forecast",
        borderColor: "rgb(126, 217, 87)",
        borderWidth: 2,
        fill: false,
        data: [13000, 14000, 14500, 13500, 15000, 16000],
        tension: 0.3,
      },
      {
        type: "bar" as const,
        label: "Potential Shortage",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: [0, 0, 500, 500, 1500, 2000],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Competitive Analysis</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => playSound("click")}>
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button onClick={() => playSound("click")}>Export Report</Button>
        </div>
      </div>

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
            {/* Sales Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-blue-500" />
                    Sales Trend Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line options={chartOptions} data={salesTrendData[period as keyof typeof salesTrendData]} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top and Bottom Performers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformers.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{product.sales.toLocaleString()}</div>
                            <div className="text-sm text-green-500 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {product.growth}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                      Underperformers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {underperformers.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{product.sales.toLocaleString()}</div>
                            <div className="text-sm text-red-500 flex items-center">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {product.growth}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Category Performance and Forecast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                      Category Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Pie options={pieChartOptions} data={categoryPerformanceData} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                      Demand & Supply Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar options={chartOptions} data={forecastData} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Supply Shortage Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Potential Supply Shortages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supplyShortages.map((item) => (
                      <Card
                        key={item.id}
                        className={`border-l-4 ${
                          item.severity === "high"
                            ? "border-l-red-500"
                            : item.severity === "medium"
                              ? "border-l-yellow-500"
                              : "border-l-blue-500"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                          <div
                            className={`text-sm mt-2 font-medium ${
                              item.severity === "high"
                                ? "text-red-500"
                                : item.severity === "medium"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          >
                            Shortage in {item.daysUntilShortage} days
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => playSound("click")}
                          >
                            Order Now
                          </Button>
                        </CardContent>
                      </Card>
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
