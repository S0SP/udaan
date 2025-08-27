"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Tag,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"

// Mock data for products
const products = [
  {
    id: "1",
    name: "Fresh Organic Vegetables Pack",
    sku: "GRO-VEG-001",
    category: "Groceries",
    subcategory: "Vegetables",
    price: 299,
    costPrice: 220,
    stock: 45,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: true,
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    sku: "GRO-BAK-002",
    category: "Groceries",
    subcategory: "Bakery",
    price: 45,
    costPrice: 32,
    stock: 78,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: false,
  },
  {
    id: "3",
    name: "Organic Milk 1L",
    sku: "GRO-DAI-003",
    category: "Groceries",
    subcategory: "Dairy",
    price: 60,
    costPrice: 45,
    stock: 120,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: true,
  },
  {
    id: "4",
    name: "Fresh Tomatoes 1kg",
    sku: "GRO-VEG-004",
    category: "Groceries",
    subcategory: "Vegetables",
    price: 40,
    costPrice: 28,
    stock: 65,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: false,
  },
  {
    id: "5",
    name: "Brown Rice 5kg",
    sku: "GRO-GRA-005",
    category: "Groceries",
    subcategory: "Grains",
    price: 250,
    costPrice: 190,
    stock: 32,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: false,
  },
  {
    id: "6",
    name: "Paracetamol Tablets",
    sku: "MED-FEV-001",
    category: "Medicines",
    subcategory: "Fever",
    price: 25,
    costPrice: 18,
    stock: 150,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: false,
  },
  {
    id: "7",
    name: "Vitamin C Supplements",
    sku: "MED-VIT-002",
    category: "Medicines",
    subcategory: "Vitamins",
    price: 350,
    costPrice: 280,
    stock: 45,
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
    featured: true,
  },
  {
    id: "8",
    name: "Hand Sanitizer 500ml",
    sku: "MED-HYG-003",
    category: "Medicines",
    subcategory: "Hygiene",
    price: 150,
    costPrice: 110,
    stock: 0,
    image: "/placeholder.svg?height=100&width=100",
    status: "out_of_stock",
    featured: false,
  },
]

export function ProductsPage() {
  const { playSound } = useAudio()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    setIsLoaded(true)
    
    // Load products from MongoDB
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/barcode')
        if (response.ok) {
          const data = await response.json()
          const mongoProducts = data.products.map((p: any) => ({
            id: p.barcode,
            name: p.name,
            sku: p.barcode,
            category: "Products",
            subcategory: "Inventory",
            price: p.price,
            costPrice: p.price * 0.8,
            stock: p.quantity,
            image: p.imageUrl,
            status: p.quantity > 0 ? "active" : "out_of_stock",
            featured: false
          }))
          
          // Check if there are new products from the new-stock page
          const newStockProducts = localStorage.getItem('newStockProducts')
          if (newStockProducts) {
            try {
              const parsedProducts = JSON.parse(newStockProducts)
              // Combine MongoDB products with new stock products
              const combinedProducts = [...mongoProducts, ...parsedProducts]
              setFilteredProducts(combinedProducts)
              
              // Clear the localStorage after loading the products
              localStorage.removeItem('newStockProducts')
              
              // Show success notification
              toast({
                title: "Inventory Updated",
                description: `${parsedProducts.length} new products added to inventory.`,
                variant: "default",
              })
            } catch (error) {
              console.error('Error parsing new stock products:', error)
              setFilteredProducts(mongoProducts)
            }
          } else {
            setFilteredProducts(mongoProducts)
          }
        }
      } catch (error) {
        console.error('Error loading products from MongoDB:', error)
        // Fallback to mock data if MongoDB fails
        setFilteredProducts(products)
      }
    }

    loadProducts()
  }, [])

  // Update filtered products whenever search criteria change
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()

      const matchesStatus = statusFilter === "all" || product.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
    
    setFilteredProducts(filtered)
  }, [searchQuery, categoryFilter, statusFilter])

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "price":
        comparison = a.price - b.price
        break
      case "stock":
        comparison = a.stock - b.stock
        break
      default:
        comparison = 0
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    playSound("click")
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => playSound("click")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by product name or SKU..."
            className="pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="medicines">Medicines</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">In Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
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

      {/* Products Table */}
      <motion.div
        className="bg-white rounded-lg border shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                    Product {getSortIcon("name")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                    Price {getSortIcon("price")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("stock")}>
                    Stock {getSortIcon("stock")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No products found. Try adjusting your filters or search query.
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      <div className="text-xs text-gray-500">{product.subcategory}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                      <div className="text-xs text-gray-500">Cost: ₹{product.costPrice}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.stock}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${
                          product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "active" ? "In Stock" : "Out of Stock"}
                      </Badge>
                      {product.featured && <Badge className="ml-2 bg-blue-100 text-blue-800">Featured</Badge>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playSound("click")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => playSound("click")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-500" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {products.filter((p) => p.status === "active").length} active,{" "}
                {products.filter((p) => p.status === "out_of_stock").length} out of stock
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Tag className="h-4 w-4 mr-2 text-green-500" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{products.reduce((total, product) => total + product.price * product.stock, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on current stock levels</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-purple-500" />
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter((p) => p.featured).length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((products.filter((p) => p.featured).length / products.length) * 100).toFixed(1)}% of total products
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
