"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Pill, ChevronRight, Star, X, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"
import { VoiceInput } from "./voice-input"
import { OrderListUpload } from "./order-list-upload"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/ui/use-toast"

// Use type assertion instead of global declaration to avoid conflicts

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

// Type for SpeechRecognition
interface ISpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating: number
  discount?: number
  quantity?: number
}

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    name: "Fresh Organic Vegetables Pack",
    price: 299,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    rating: 4.5,
    discount: 10,
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    price: 45,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Paracetamol Tablets",
    price: 25,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    rating: 4.8,
  },
  {
    id: "4",
    name: "Vitamin C Supplements",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    rating: 4.6,
    discount: 15,
  },
]

// Mock data for categories
const categories = [
  { id: "groceries", name: "Groceries", icon: ShoppingBag, color: "bg-blue-500" },
  { id: "medicines", name: "Medicines", icon: Pill, color: "bg-green-500" },
]

export function CustomerHome() {
  const { playSound } = useAudio()
  const { addToCart } = useCart()
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const handleVoiceSearch = (text: string) => {
    setSearchQuery(text)
    // Parse the voice command for direct cart addition
    const match = text.match(/add (\d+)\s+(.+)/i)
    if (match) {
      const [, quantity, productName] = match
      // Find the product in the catalog
      const product = featuredProducts.find(p => 
        p.name.toLowerCase().includes(productName.toLowerCase())
      )
      if (product) {
        addToCart({ ...product, quantity: parseInt(quantity) })
        toast({
          title: "Added to Cart",
          description: `Added ${quantity} ${product.name} to your cart.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Product Not Found",
          description: `Could not find "${productName}" in our catalog.`,
          variant: "destructive",
        })
      }
    }
  }

  const toggleListening = () => {
    if (!isListening) {
      try {
        const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          handleVoiceSearch(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error)
          toast({
            title: "Error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive",
          })
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.start()
        setIsListening(true)
      } catch (error) {
        console.error("Speech recognition error:", error)
        toast({
          title: "Error",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        })
      }
    } else {
      const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
      recognition.stop()
      setIsListening(false)
    }
  }

  const handleOrderListProcess = (items: { name: string; quantity: number }[]) => {
    items.forEach(item => {
      const product = featuredProducts.find(p => 
        p.name.toLowerCase().includes(item.name.toLowerCase())
      )
      if (product) {
        addToCart({ ...product, quantity: item.quantity })
      }
    })
  }

  const handleAddToCart = (product: Product, quantity = 1) => {
    playSound("click")
    addToCart({ ...product, quantity })
    toast({
      title: "Added to Cart",
      description: `Added ${quantity} ${product.name} to your cart.`,
      variant: "default",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section
        className="relative rounded-2xl overflow-hidden mb-12 glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-green-500/80 z-10" />

        <div className="relative z-20 flex flex-col md:flex-row items-center p-8 md:p-12">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Fresh Groceries & Medicines
              <br />
              <span className="text-yellow-300">Delivered in Minutes</span>
            </motion.h1>

            <motion.p
              className="text-lg mb-6 text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Shop from your local stores and get everything delivered right to your doorstep.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => playSound("click")}>
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20"
                onClick={() => playSound("click")}
              >
                View Offers
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Grocery and Medicine Delivery"
              width={400}
              height={400}
              className="rounded-xl"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Search Section */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Products</h2>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search products or say 'add 5 kg fortune aata'..." 
                className="pl-10 pr-20 h-12 rounded-xl" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleListening}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5 text-red-500" />
                  ) : (
                    <Mic className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button className="h-12 px-6 rounded-xl" onClick={() => playSound("click")}>
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500">Popular:</span>
            {["Vegetables", "Fruits", "Bread", "Milk", "Paracetamol"].map((term) => (
              <motion.span
                key={term}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playSound("click")}
              >
                {term}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <Button variant="ghost" className="text-blue-600" onClick={() => playSound("click")}>
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Link href={`/customer/products/${category.id}`}>
                <Card
                  className="overflow-hidden h-40 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => playSound("click")}
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex h-full">
                      <div className="w-1/3 flex items-center justify-center p-6">
                        <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center`}>
                          <category.icon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="w-2/3 bg-white p-6 flex flex-col justify-center">
                        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                          {category.id === "groceries"
                            ? "Fresh vegetables, fruits, dairy & more"
                            : "Prescription & OTC medicines"}
                        </p>
                        <div className="mt-4 flex items-center text-blue-600">
                          <span className="text-sm font-medium">Shop Now</span>
                          <ChevronRight size={16} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Button variant="ghost" className="text-blue-600" onClick={() => playSound("click")}>
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAddToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discount}% OFF
                      </div>
                    )}
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {product.category === "groceries" ? "Grocery" : "Medicine"}
                      </span>
                      <div className="ml-auto flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-semibold">₹{product.price}</span>
                        {product.discount && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            ₹{Math.round(product.price * (1 + product.discount / 100))}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <VoiceInput
            onResult={handleVoiceSearch}
            placeholder="Search products or say 'add 5 kg fortune aata'"
          />
          
          <OrderListUpload onProcessOrder={handleOrderListProcess} />
        </div>
      </div>
    </div>
  )
}
