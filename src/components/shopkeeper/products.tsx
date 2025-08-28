"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
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
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAudio } from "@/components/audio-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Product {
  _id: string
  name: string
  sku?: string
  category: string
  subcategory?: string
  price: number
  costPrice?: number
  quantity: number
  imageUrl?: string
  status?: "active" | "out_of_stock"
  featured?: boolean
  barcode?: string
  createdAt: string
  updatedAt: string
}

export function ProductsPage() {
  const { playSound } = useAudio()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error('Error loading products from MongoDB:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        toast({
          title: "Error",
          description: "Could not load products from the database.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()

      const stockStatus = product.quantity > 0 ? "active" : "out_of_stock"
      const matchesStatus = statusFilter === "all" || stockStatus === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })

    return filtered.sort((a, b) => {
      let comparison = 0

      if (sortField === 'name' || sortField === 'category') {
        comparison = a[sortField].localeCompare(b[sortField]);
      } else if (sortField === 'price' || sortField === 'quantity') {
        comparison = a[sortField] - b[sortField];
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [products, searchQuery, categoryFilter, statusFilter, sortField, sortDirection])

  const handleSort = (field: 'name' | 'price' | 'quantity' | 'category') => {
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

  const allCategories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))], [products]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load products. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
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
            placeholder="Search by product name, SKU, or barcode..."
            className="pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">In Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        className="bg-white rounded-lg border shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                    Category {getSortIcon("category")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                    Price {getSortIcon("price")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("quantity")}>
                    Stock {getSortIcon("quantity")}
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
              {filteredAndSortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No products found. Try adjusting your filters or search query.
                  </td>
                </tr>
              ) : (
                filteredAndSortedProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.barcode || product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.quantity}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={product.quantity > 0 ? "default" : "destructive"}
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
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
                {products.filter((p) => p.quantity > 0).length} active,{" "}
                {products.filter((p) => p.quantity === 0).length} out of stock
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
                ₹{products.reduce((total, product) => total + product.price * product.quantity, 0).toLocaleString()}
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
                Total Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCategories.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Across all products
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
