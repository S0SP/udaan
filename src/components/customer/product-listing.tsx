"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ShoppingBag, Star, Filter, ChevronDown, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAudio } from "@/components/audio-provider"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image: string
  category: string
  subcategory?: string
  rating?: number
  discount?: number
  inStock?: boolean
  quantity?: number
}

// Mock data for products
const groceryProducts = [
  {
    id: "g1",
    name: "Fresh Organic Vegetables Pack",
    price: 299,
    image: "/placeholder.svg?height=200&width=200",
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
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "bakery",
    rating: 4.2,
    inStock: true,
  },
  {
    id: "g3",
    name: "Organic Milk 1L",
    price: 60,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "dairy",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "g4",
    name: "Fresh Tomatoes 1kg",
    price: 40,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "vegetables",
    rating: 4.3,
    discount: 5,
    inStock: true,
  },
  {
    id: "g5",
    name: "Brown Rice 5kg",
    price: 250,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "grains",
    rating: 4.6,
    inStock: true,
  },
  {
    id: "g6",
    name: "Organic Honey 500g",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "condiments",
    rating: 4.8,
    discount: 15,
    inStock: true,
  },
  {
    id: "g7",
    name: "Mixed Fruit Jam",
    price: 120,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "condiments",
    rating: 4.1,
    inStock: false,
  },
  {
    id: "g8",
    name: "Olive Oil 500ml",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "groceries",
    subcategory: "oils",
    rating: 4.9,
    inStock: true,
  },
]

const medicineProducts = [
  {
    id: "m1",
    name: "Paracetamol Tablets",
    price: 25,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "fever",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "m2",
    name: "Vitamin C Supplements",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "vitamins",
    rating: 4.6,
    discount: 15,
    inStock: true,
  },
  {
    id: "m3",
    name: "First Aid Kit",
    price: 450,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "first-aid",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "m4",
    name: "Cough Syrup 100ml",
    price: 85,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "cough",
    rating: 4.3,
    inStock: true,
  },
  {
    id: "m5",
    name: "Digital Thermometer",
    price: 199,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "devices",
    rating: 4.5,
    discount: 10,
    inStock: true,
  },
  {
    id: "m6",
    name: "Hand Sanitizer 500ml",
    price: 150,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "hygiene",
    rating: 4.4,
    inStock: true,
  },
  {
    id: "m7",
    name: "Multivitamin Tablets",
    price: 280,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "vitamins",
    rating: 4.6,
    inStock: false,
  },
  {
    id: "m8",
    name: "Antiseptic Cream",
    price: 120,
    image: "/placeholder.svg?height=200&width=200",
    category: "medicines",
    subcategory: "first-aid",
    rating: 4.2,
    discount: 5,
    inStock: true,
  },
]

type ProductListingProps = {
  category: "groceries" | "medicines"
}

export function ProductListing({ category }: ProductListingProps) {
  const { addToCart } = useCart()
  const { playSound } = useAudio()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(category === "groceries" ? groceryProducts : medicineProducts)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [discountedOnly, setDiscountedOnly] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Fetch products from API and set based on category
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Start with mock data as fallback
      const mockData = category === "groceries" ? groceryProducts : medicineProducts;
      setProducts(mockData);

      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts = await response.json();
        
        const mappedProducts = allProducts.map((p: any) => ({ 
          ...p, 
          id: p._id, 
          inStock: p.stock && p.stock > 0,
          image: p.image || "/placeholder.svg?height=200&width=200",
          // Add fallback for missing properties to avoid errors
          rating: p.rating || 4.0,
          subcategory: p.subcategory || 'general',
          category: p.category || 'groceries', // Assign a default category
        }));

        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products, using mock data:", error);
        // If API fails, we've already set mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply subcategory filter
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) => selectedSubcategories.includes(product.subcategory))
    }

    // Apply price range filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply in-stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock)
    }

    // Apply discounted filter
    if (discountedOnly) {
      filtered = filtered.filter((product) => product.discount)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default: // popularity (default)
        // No additional sorting needed as the data is already sorted by popularity
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, sortBy, selectedSubcategories, priceRange, inStockOnly, discountedOnly])

  // Get unique subcategories
  const subcategories = [...new Set(products.map((product) => product.subcategory))]

  // Toggle subcategory selection
  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((item) => item !== subcategory) : [...prev, subcategory],
    )
    playSound("click")
  }

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

  const handleAddToCart = (product: Product) => {
    playSound("click")
    addToCart({ ...product, quantity: 1 })
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold">{category === "groceries" ? "Groceries" : "Medicines"}</h1>
          <p className="text-gray-500">{filteredProducts.length} products available</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search products..."
              className="pl-10 h-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => {
              setShowFilters(!showFilters)
              playSound("click")
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <motion.div className="hidden md:block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Categories</h4>
                      <div className="space-y-2">
                        {subcategories.map((subcategory) => (
                          <div key={subcategory} className="flex items-center">
                            <input
                              type="checkbox"
                              id={subcategory}
                              checked={selectedSubcategories.includes(subcategory)}
                              onChange={() => toggleSubcategory(subcategory)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={subcategory} className="ml-2 text-sm text-gray-700 capitalize">
                              {subcategory.replace("-", " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Price Range</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                          className="h-8 w-20"
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          min="0"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 0])}
                          className="h-8 w-20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={inStockOnly}
                          onChange={() => setInStockOnly(!inStockOnly)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                          In Stock Only
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="discounted"
                          checked={discountedOnly}
                          onChange={() => setDiscountedOnly(!discountedOnly)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="discounted" className="ml-2 text-sm text-gray-700">
                          Discounted Only
                        </label>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        // Reset filters
                        setSelectedSubcategories([])
                        setPriceRange([0, 500])
                        setInStockOnly(false)
                        setDiscountedOnly(false)
                        playSound("click")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters - Mobile */}
        {showFilters && (
          <motion.div
            className="md:hidden col-span-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {subcategories.map((subcategory) => (
                        <Button
                          key={subcategory}
                          variant={selectedSubcategories.includes(subcategory) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSubcategory(subcategory)}
                          className="capitalize"
                        >
                          {subcategory.replace("-", " ")}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                        className="h-8 w-20"
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        min="0"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 0])}
                        className="h-8 w-20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inStockMobile"
                        checked={inStockOnly}
                        onChange={() => setInStockOnly(!inStockOnly)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="inStockMobile" className="ml-2 text-sm text-gray-700">
                        In Stock Only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="discountedMobile"
                        checked={discountedOnly}
                        onChange={() => setDiscountedOnly(!discountedOnly)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="discountedMobile" className="ml-2 text-sm text-gray-700">
                        Discounted Only
                      </label>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      // Reset filters
                      setSelectedSubcategories([])
                      setPriceRange([0, 500])
                      setInStockOnly(false)
                      setDiscountedOnly(false)
                      playSound("click")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          className="md:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSubcategories([])
                  setPriceRange([0, 500])
                  setInStockOnly(false)
                  setDiscountedOnly(false)
                  playSound("click")
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
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
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                            <span className="text-white font-medium">Out of Stock</span>
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
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                            {product.subcategory?.replace("-", " ")}
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
                            disabled={!product.inStock}
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
          )}
        </motion.div>
      </div>
    </div>
  )
}
