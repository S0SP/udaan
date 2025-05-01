"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Scan, Camera, CheckCircle2, XCircle, Loader2, Search, Plus, Minus, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"
import { BarcodeScanner } from "@/components/barcode-scanner"

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Whole Wheat Bread",
    barcode: "8901234567890",
    price: 45,
    stock: 12,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Organic Milk 1L",
    barcode: "8901234567891",
    price: 60,
    stock: 8,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Fresh Tomatoes 1kg",
    barcode: "8901234567892",
    price: 40,
    stock: 15,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "Paracetamol Tablets",
    barcode: "8901234567893",
    price: 25,
    stock: 30,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function InventorySyncPage() {
  const { playSound } = useAudio()
  const [scanMode, setScanMode] = useState<"barcode" | "camera" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null)
  const [scannedProduct, setScannedProduct] = useState<(typeof mockProducts)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [showParticles, setShowParticles] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>(
    [],
  )
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanAreaRef = useRef<HTMLDivElement>(null)

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.barcode.includes(searchQuery),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(mockProducts)
    }
  }, [searchQuery])

  // Handle camera access
  useEffect(() => {
    if (scanMode === "camera" && !isScanning) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error("Error accessing camera:", err)
        }
      }

      startCamera()

      return () => {
        const stream = videoRef.current?.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [scanMode])

  // Generate particles for success animation
  useEffect(() => {
    if (showParticles) {
      const newParticles = []
      const colors = ["#00aaff", "#7ed957", "#ffcc00", "#ff6b6b"]

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      setParticles(newParticles)

      const timeout = setTimeout(() => {
        setShowParticles(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [showParticles])

  const startScanning = () => {
    setIsScanning(true)
    playSound("click")

    // Simulate scanning process
    setTimeout(() => {
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]
      setScannedProduct(randomProduct)
      setScanResult("success")
      setIsScanning(false)
      playSound("success")
      setShowParticles(true)
    }, 2000)
  }

  const resetScan = () => {
    setScanResult(null)
    setScannedProduct(null)
    setIsScanning(false)
    playSound("click")
  }

  const updateStock = (productId: string, change: number) => {
    setFilteredProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock + change) } : product,
      ),
    )
    playSound("click")
  }

  // Handle barcode scan result
  const handleBarcodeScan = (barcode: string) => {
    setScannedBarcode(barcode)
    setShowBarcodeScanner(false)
    
    // Find product by barcode
    const product = mockProducts.find(p => p.barcode === barcode)
    
    if (product) {
      setScannedProduct(product)
      setScanResult("success")
      playSound("success")
      setShowParticles(true)
    } else {
      setScanResult("error")
      playSound("error")
    }
  }

  const renderScanArea = () => {
    if (scanMode === "barcode") {
      return (
        <div
          ref={scanAreaRef}
          className="relative w-full max-w-md h-64 mx-auto bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
        >
          {isScanning ? (
            <div className="text-center">
              <motion.div
                animate={{
                  y: [-50, 50, -50],
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "linear",
                }}
                className="h-0.5 w-full bg-blue-500 absolute left-0"
              />
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Scanning barcode...</p>
            </div>
          ) : scanResult ? (
            <div className="text-center p-4">
              {scanResult === "success" ? (
                <div className="space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <p className="text-green-600 font-medium text-lg">Scan Successful!</p>
                  {scannedProduct && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={scannedProduct.image || "/placeholder.svg"}
                          alt={scannedProduct.name}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div className="text-left">
                          <h3 className="font-medium">{scannedProduct.name}</h3>
                          <p className="text-sm text-gray-500">Barcode: {scannedProduct.barcode}</p>
                          <p className="text-sm">Price: ₹{scannedProduct.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => updateStock(scannedProduct.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{scannedProduct.stock}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => updateStock(scannedProduct.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={resetScan}>
                      Scan Again
                    </Button>
                    <Button
                      onClick={() => {
                        playSound("success")
                        resetScan()
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <p className="text-red-600 font-medium text-lg">Scan Failed</p>
                  <p className="text-gray-600">Please try again</p>
                  <Button variant="outline" onClick={resetScan}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-4">
              <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Position barcode in the scan area</p>
              <Button onClick={startScanning}>Start Scanning</Button>
            </div>
          )}
        </div>
      )
    } else if (scanMode === "camera") {
      return (
        <div className="relative w-full max-w-md mx-auto">
          {showBarcodeScanner ? (
            <BarcodeScanner 
              onScan={handleBarcodeScan}
              onClose={() => setShowBarcodeScanner(false)}
            />
          ) : (
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-white/70 mx-auto mb-4" />
                <p className="text-white/70 mb-4">Use camera to scan product barcodes</p>
                <Button onClick={() => setShowBarcodeScanner(true)}>
                  Open Camera Scanner
                </Button>
              </div>
            </div>
          )}

          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white rounded-lg shadow-md"
            >
              {scanResult === "success" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-green-600 font-medium">Scan Successful!</p>
                  </div>

                  {scannedProduct && (
                    <div className="flex items-center gap-4">
                      <Image
                        src={scannedProduct.image || "/placeholder.svg"}
                        alt={scannedProduct.name}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{scannedProduct.name}</h3>
                        <p className="text-sm text-gray-500">Barcode: {scannedProduct.barcode}</p>
                        <p className="text-sm">Price: ₹{scannedProduct.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => updateStock(scannedProduct.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium">{scannedProduct.stock}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => updateStock(scannedProduct.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetScan} className="flex-1">
                      Scan Again
                    </Button>
                    <Button
                      onClick={() => {
                        playSound("success")
                        resetScan()
                      }}
                      className="flex-1"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-600 font-medium">Scan Failed</p>
                  </div>
                  <p className="text-gray-600">Please try again</p>
                  <Button variant="outline" onClick={resetScan} className="w-full">
                    Try Again
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Display the scanned barcode in text format */}
          {scannedBarcode && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Scanned Barcode:</h3>
              <div className="bg-white p-3 rounded border text-center font-mono">
                {scannedBarcode}
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Sync</h1>
        <Button
          variant="outline"
          onClick={() => {
            playSound("click")
            setScanMode(null)
            resetScan()
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Scan Mode Selection */}
      {!scanMode && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setScanMode("barcode")
              playSound("click")
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Scan className="h-8 w-8 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Barcode Scanner</h3>
              <p className="text-gray-600">Scan product barcodes to update inventory quickly</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setScanMode("camera")
              playSound("click")
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera className="h-8 w-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Camera Scanner</h3>
              <p className="text-gray-600">Use your device camera to scan product barcodes</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scan Area */}
      {scanMode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{scanMode === "barcode" ? "Barcode Scanner" : "Camera Scanner"}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderScanArea()}

              {/* Success particles animation */}
              {showParticles && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {particles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className="absolute rounded-full"
                      initial={{
                        x: "50%",
                        y: "50%",
                        opacity: 1,
                        scale: 0,
                      }}
                      animate={{
                        x: `${particle.x}%`,
                        y: `${particle.y}%`,
                        opacity: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 1 + Math.random(),
                        ease: "easeOut",
                      }}
                      style={{
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setScanMode(null)
              resetScan()
              playSound("click")
            }}
          >
            Back to Scan Options
          </Button>
        </motion.div>
      )}

      {/* Inventory List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Current Inventory</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search products..."
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Barcode</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md mr-3"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.barcode}</td>
                      <td className="px-4 py-3 text-sm font-medium">₹{product.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => updateStock(product.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{product.stock}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => updateStock(product.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-blue-600"
                          onClick={() => {
                            playSound("click")
                          }}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
