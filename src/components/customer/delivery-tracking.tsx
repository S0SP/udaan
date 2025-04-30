"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Truck, Package, Store, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"
import { Breadcrumb } from "@/components/breadcrumb"

type DeliveryTrackingProps = {
  orderId: string
}

export function DeliveryTracking({ orderId }: DeliveryTrackingProps) {
  const { playSound } = useAudio()
  const [currentStep, setCurrentStep] = useState(2)
  const [deliveryProgress, setDeliveryProgress] = useState(45)
  const [estimatedTime, setEstimatedTime] = useState(15)

  // Simulate delivery progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setCurrentStep(4)
          playSound("success")
          return 100
        }
        return prev + 1
      })

      setEstimatedTime((prev) => {
        if (prev <= 0) return 0
        return prev - 0.25
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [playSound])

  // Update step based on progress
  useEffect(() => {
    if (deliveryProgress >= 100) {
      setCurrentStep(4)
    } else if (deliveryProgress >= 75) {
      setCurrentStep(3)
    } else if (deliveryProgress >= 25) {
      setCurrentStep(2)
    } else {
      setCurrentStep(1)
    }
  }, [deliveryProgress])

  const steps = [
    { id: 1, title: "Order Assigned", icon: Package, time: "12:30 PM" },
    { id: 2, title: "Picked Up", icon: Store, time: "12:45 PM" },
    { id: 3, title: "On the Way", icon: Truck, time: "1:00 PM" },
    { id: 4, title: "Delivered", icon: CheckCircle2, time: "1:15 PM" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order #{orderId} Tracking</span>
              {estimatedTime > 0 && (
                <span className="text-sm font-normal bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Arriving in {Math.ceil(estimatedTime)} mins
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Progress bar */}
            <div className="relative h-2 bg-gray-200 rounded-full mb-8">
              <motion.div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${deliveryProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Steps */}
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 ml-6" />

              <div className="space-y-8">
                {steps.map((step) => {
                  const isActive = step.id === currentStep
                  const isCompleted = step.id < currentStep

                  return (
                    <motion.div
                      key={step.id}
                      className="flex items-start relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.id * 0.1 }}
                    >
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          isCompleted
                            ? "bg-green-100 border-green-500"
                            : isActive
                              ? "bg-blue-100 border-blue-500"
                              : "bg-white border-gray-300"
                        }`}
                      >
                        <step.icon
                          className={`h-6 w-6 ${
                            isCompleted ? "text-green-500" : isActive ? "text-blue-500" : "text-gray-400"
                          }`}
                        />
                      </div>

                      <div className="ml-4">
                        <h3
                          className={`font-medium ${
                            isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isCompleted
                            ? `Completed at ${step.time}`
                            : isActive
                              ? "In progress"
                              : step.id === currentStep + 1
                                ? `Estimated: ${step.time}`
                                : "Pending"}
                        </p>

                        {isActive && step.id === 3 && (
                          <div className="mt-3 space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="font-medium mb-1">Delivery Agent</div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Rahul Kumar</div>
                                    <div className="text-sm text-gray-500">ID: DL-12345</div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
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

                            <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-gray-500 mb-2">Live location map will be displayed here</p>
                                <Button variant="outline" size="sm" onClick={() => playSound("click")}>
                                  Open in Maps
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {isCompleted && step.id === 4 && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm" onClick={() => playSound("click")}>
                              View Order Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              playSound("click")
              window.history.back()
            }}
          >
            Back to Orders
          </Button>

          <Button onClick={() => playSound("click")}>Need Help</Button>
        </div>
      </motion.div>
    </div>
  )
}
