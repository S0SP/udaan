"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { BarcodeScanner } from "@/components/barcode-scanner"

interface Product {
  id: string
  name: string
  barcode: string
  price: number
  category: string
  subcategory: string
  unit: string
  defaultQuantity: number
  inStock: boolean
  reorderPoint: number
}

export function InventorySync() {
  const [showScanner, setShowScanner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleBarcodeScan = async (barcode: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/barcode/${barcode}`)
      
      if (!response.ok) {
        throw new Error("Product not found")
      }

      const product = await response.json()
      setScannedProduct(product)
      toast({
        title: "Product Found",
        description: `Found ${product.name} in the database.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Could not find product with this barcode.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowScanner(false)
    }
  }

  const handleSync = async () => {
    if (!scannedProduct) return

    try {
      setIsLoading(true)
      // In a real application, you would make an API call to update inventory here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      
      toast({
        title: "Inventory Updated",
        description: "Product inventory has been synchronized successfully.",
        variant: "default",
      })
      setScannedProduct(null)
    } catch (error) {
      console.error("Error syncing inventory:", error)
      toast({
        title: "Error",
        description: "Failed to sync inventory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Sync</h2>
        <Button onClick={() => setShowScanner(true)}>
          <Camera className="h-4 w-4 mr-2" />
          Scan Barcode
        </Button>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {scannedProduct && (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Scanned Product</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={scannedProduct.name} readOnly />
            </div>
            <div>
              <Label>Barcode</Label>
              <Input value={scannedProduct.barcode} readOnly />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={scannedProduct.category} readOnly />
            </div>
            <div>
              <Label>Subcategory</Label>
              <Input value={scannedProduct.subcategory} readOnly />
            </div>
            <div>
              <Label>Price</Label>
              <Input value={`₹${scannedProduct.price}`} readOnly />
            </div>
            <div>
              <Label>Unit</Label>
              <Input value={scannedProduct.unit} readOnly />
            </div>
            <div>
              <Label>Default Quantity</Label>
              <Input value={scannedProduct.defaultQuantity} readOnly />
            </div>
            <div>
              <Label>Reorder Point</Label>
              <Input value={scannedProduct.reorderPoint} readOnly />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSync}
              disabled={isLoading}
            >
              {isLoading ? "Syncing..." : "Sync Inventory"}
            </Button>
          </div>
        </div>
      )}

      {!scannedProduct && !showScanner && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Product Scanned
          </h3>
          <p className="text-gray-500 mb-4">
            Click the "Scan Barcode" button to scan a product barcode
          </p>
        </div>
      )}
    </div>
  )
} 