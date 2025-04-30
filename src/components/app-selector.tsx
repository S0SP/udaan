"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ShoppingBag, Store, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"

export function AppSelector() {
  const router = useRouter()
  const { playSound } = useAudio()

  const handleAppSelect = (app: string) => {
    playSound("click")
    router.push(`/${app}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      className="text-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-blue-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        Welcome to KiraanaKloud
      </motion.h1>

      <motion.p
        className="text-xl mb-12 text-gray-600"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        Select your app experience
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-blue-100 hover:border-blue-300"
            onClick={() => handleAppSelect("customer")}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex justify-center">
                <ShoppingBag className="h-12 w-12 text-blue-500" />
              </CardTitle>
              <CardTitle>Customer App</CardTitle>
              <CardDescription>Shop groceries and medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">Enter</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-blue-100 hover:border-blue-300"
            onClick={() => handleAppSelect("shopkeeper")}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex justify-center">
                <Store className="h-12 w-12 text-green-500" />
              </CardTitle>
              <CardTitle>Shopkeeper App</CardTitle>
              <CardDescription>Manage your store and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-500 hover:bg-green-600">Enter</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm border-blue-100 hover:border-blue-300"
            onClick={() => handleAppSelect("delivery")}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex justify-center">
                <Truck className="h-12 w-12 text-purple-500" />
              </CardTitle>
              <CardTitle>Delivery App</CardTitle>
              <CardDescription>Manage deliveries and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">Enter</Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
