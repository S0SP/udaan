"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAudio } from "@/components/audio-provider"
import { Breadcrumb } from "@/components/breadcrumb"
import { VoiceInput } from "./voice-input"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

// Define SpeechRecognition types
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

// Define types without declaring interfaces in global scope
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

// Use type assertion instead of global declaration to avoid conflicts

// Combine grocery and medicine products for search
const allProducts = [
  {
    id: "g1",
    name: "Fresh Organic Vegetables Pack",
    price: 299,
    image: "/placeholder.svg?height=100&width=100",
    category: "groceries",
    subcategory: "vegetables",
    rating: 4.5,
    discount: 10,
    inStock: true,
  },
  {
    id: "g2",
    name: "Whole Wheat Bread",
    price: 45,
    image: "/placeholder.svg?height=100&width=100",
    category: "groceries",
    subcategory: "bakery",
    rating: 4.2,
    inStock: true,
  },
  {
    id: "m1",
    name: "Paracetamol Tablets",
    price: 25,
    image: "/placeholder.svg?height=100&width=100",
    category: "medicines",
    subcategory: "fever",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "m2",
    name: "Vitamin C Supplements",
    price: 350,
    image: "/placeholder.svg?height=100&width=100",
    category: "medicines",
    subcategory: "vitamins",
    rating: 4.6,
    discount: 15,
    inStock: true,
  },
  {
    id: "g3",
    name: "Organic Milk 1L",
    price: 60,
    image: "/placeholder.svg?height=100&width=100",
    category: "groceries",
    subcategory: "dairy",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "g4",
    name: "Fresh Tomatoes 1kg",
    price: 40,
    image: "/placeholder.svg?height=100&width=100",
    category: "groceries",
    subcategory: "vegetables",
    rating: 4.3,
    discount: 5,
    inStock: true,
  },
  {
    id: "m3",
    name: "First Aid Kit",
    price: 450,
    image: "/placeholder.svg?height=100&width=100",
    category: "medicines",
    subcategory: "first-aid",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "m4",
    name: "Cough Syrup 100ml",
    price: 85,
    image: "/placeholder.svg?height=100&width=100",
    category: "medicines",
    subcategory: "cough",
    rating: 4.3,
    inStock: true,
  },
]

// Popular search terms
const popularSearches = [
  "Vegetables",
  "Fruits",
  "Bread",
  "Milk",
  "Paracetamol",
  "Vitamins",
  "Rice",
  "Honey",
  "First Aid",
  "Cough Syrup",
]

export function SearchPage() {
  const { playSound } = useAudio()
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof allProducts>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    // Load recent searches from localStorage in a real app
    setRecentSearches(["Milk", "Bread", "Paracetamol"])
  }, [])
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }
    
    const query = searchQuery.toLowerCase()
    const results = allProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query) || 
      product.subcategory.toLowerCase().includes(query)
    )
    
    setSearchResults(results)
  }, [searchQuery])
  
  const handleSearch = (term: string) => {
    setSearchQuery(term)
    playSound("click")
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(term) && term.trim() !== "") {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)])
    }
  }
  
  const clearSearch = () => {
    setSearchQuery("")
    playSound("click")
  }
  
  const clearRecentSearches = () => {
    setRecentSearches([])
    playSound("click")
  }
  
  const handleVoiceSearch = (text: string) => {
    setSearchQuery(text)
    // Parse the voice command for direct cart addition
    const match = text.match(/add (\d+)\s+(.+)/i)
    if (match) {
      const [, quantity, productName] = match
      // Find the product in the catalog
      const product = allProducts.find(p => 
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center">Search Products</h1>
          <p className="text-center text-gray-600">
            Find what you need quickly and easily
          </p>
        </div>

        <div className="space-y-4">
          <VoiceInput
            onResult={handleVoiceSearch}
            placeholder="Search products or say 'add 5 kg fortune aata'"
          />
          
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <Breadcrumb />
        
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search products or say 'add 5 kg fortune aata'..."
              className="pl-10 pr-20 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clearSearch}
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
        </motion.div>
        
        {!searchQuery && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Recent Searches</h2>
                  <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleSearch(term)}
                      >
                        {term}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-3">Popular Searches</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleSearch(term)}
                    >
                      {term}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
        
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {searchResults.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-lg font-semibold">₹{product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* No Results */}
        {searchQuery && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No results found for "{searchQuery}"</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
