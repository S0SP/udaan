"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Scan, Camera, CheckCircle2, XCircle, Loader2, Search, Plus, Minus, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"
import { BrowserMultiFormatReader, Result, BarcodeFormat, DecodeHintType } from "@zxing/library"

// Product interface
interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  image: string;
}

export function InventorySyncPage() {
  const { playSound } = useAudio()
  const [scanMode, setScanMode] = useState<"barcode" | "camera" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null)
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showParticles, setShowParticles] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>(
    [],
  )
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tempProductCard, setTempProductCard] = useState<Product | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const scanAreaRef = useRef<HTMLDivElement>(null)
  const barcodeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  const handleBarcodeScan = useCallback(async (barcode: string) => {
    setScannedBarcode(barcode);
    setIsScanning(false);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${barcode}`);

      if (response.ok) {
        const productData = await response.json();
        const product: Product = {
          id: productData.barcode,
          name: productData.name,
          barcode: productData.barcode,
          price: productData.price,
          stock: productData.quantity,
          image: productData.imageUrl,
        };

        setScannedProduct(product);
        setTempProductCard(product); // Show the temp card
        setScanResult("success");
        playSound("success");
        setShowParticles(true);

        // Hide the card after 3 seconds
        setTimeout(() => {
          setTempProductCard(null);
        }, 3000);

      } else {
        setScannedProduct(null);
        setScanResult("error");
        playSound("error");
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setScannedProduct(null);
      setScanResult("error");
      playSound("error");
    } finally {
      setIsLoading(false);
    }
  }, [playSound]);

  // Load products from MongoDB and filter based on search query
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/barcode')
        if (response.ok) {
          const data = await response.json()
          const products: Product[] = data.products.map((p: any) => ({
            id: p.barcode,
            name: p.name,
            barcode: p.barcode,
            price: p.price,
            stock: p.quantity,
            image: p.imageUrl
          }))
          
          if (searchQuery) {
            const filtered = products.filter(
              (product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.barcode.includes(searchQuery),
            )
            setFilteredProducts(filtered)
          } else {
            setFilteredProducts(products)
          }
        }
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }

    loadProducts()
  }, [searchQuery])

  // Initialize and clean up barcode reader
  useEffect(() => {
    if (scanMode === "camera") {
      barcodeReaderRef.current = new BrowserMultiFormatReader()
      setIsScanning(true) // Start scanning immediately with stable state
      return () => {
        if (barcodeReaderRef.current) {
          barcodeReaderRef.current.reset()
          barcodeReaderRef.current = null
        }
      }
    }
  }, [scanMode])

  // Handle camera access
  useEffect(() => {
    if (scanMode === "camera" && !scanResult) {
      const startCamera = async () => {
        try {
          if (!barcodeReaderRef.current) return
          
          // Configure hints for better recognition
          const hints = new Map();
          hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8, 
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_128,
            BarcodeFormat.QR_CODE,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E
          ]);
          hints.set(DecodeHintType.TRY_HARDER, true);
          barcodeReaderRef.current.hints = hints;
          
          // Get video devices
          const videoDevices = await barcodeReaderRef.current.listVideoInputDevices()
                    
          // Find back camera if available
          let selectedDeviceId = videoDevices[0]?.deviceId
          const backCamera = videoDevices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear')
          )
          
          if (backCamera) {
                        selectedDeviceId = backCamera.deviceId
          } else if (videoDevices.length > 1) {
                        selectedDeviceId = videoDevices[videoDevices.length - 1].deviceId
          }

          if (videoRef.current) {
            setCameraReady(true)
                        
            // Start continuous scanning with improved settings
            await barcodeReaderRef.current.decodeFromConstraints(
              {
                video: { 
                  deviceId: selectedDeviceId,
                  facingMode: "environment",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                  frameRate: { ideal: 30 }
                }
              },
              videoRef.current,
              (result: Result | null, error: Error | undefined) => {
                if (result && isScanning && !scanResult) {
                  const barcode = result.getText()
                                    handleBarcodeScan(barcode)
                }
              }
            )
          }
        } catch (err) {
          console.error("Error accessing camera:", err)
          setIsScanning(false)
          setCameraReady(false)
        }
      }

      startCamera()

      return () => {
        if (barcodeReaderRef.current) {
          barcodeReaderRef.current.reset()
          setIsScanning(false)
          setCameraReady(false)
        }
      }
    }
  }, [scanMode, scanResult, isScanning, handleBarcodeScan])

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

    // Simulate scanning process for demo
    setTimeout(() => {
      // This is just for demo purposes - in real implementation, this would be handled by camera
      const demoBarcode = "8901234567890"
      handleBarcodeScan(demoBarcode)
    }, 2000)
  }

  const resetScan = () => {
    if (scannedProduct) {
      updateStock(scannedProduct.id, -1); // Decrease stock when scanning another product
    }
    setScanResult(null)
    setScannedProduct(null)
    setScannedBarcode(null)
    setIsScanning(true)
    playSound("click")
  }

  const updateStock = async (productId: string, change: number) => {
    try {
      // Find the product by ID (which is the barcode)
      const product = filteredProducts.find(p => p.id === productId)
      if (!product) return

      const action = change < 0 ? 'sell' : 'restock'
      
      const response = await fetch('/api/barcode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          barcode: product.barcode,
          action: action
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state with new data
        setFilteredProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { 
              ...p, 
              stock: data.product.quantity 
            } : p
          )
        )
        
        // Update scanned product if it's the same one
        if (scannedProduct && scannedProduct.id === productId) {
          setScannedProduct({
            ...scannedProduct,
            stock: data.product.quantity
          })
        }
        
        playSound("click")
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const renderScanArea = () => {
    if (scanMode === "barcode") {
      return (
        <div
          ref={scanAreaRef}
          className="relative w-full max-w-md h-64 mx-auto bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
        >
          {isScanning || isLoading ? (
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
              <p className="text-gray-600">
                {isScanning ? "Scanning barcode..." : "Looking up product..."}
              </p>
            </div>
          ) : scanResult ? (
            <div className="text-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <p className="text-green-600 font-medium text-lg">Scan Successful!</p>
                  {scannedProduct && (
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
              </motion.div>
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
        <div className="flex gap-4 items-start">
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Scan overlay with guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-1/2 border-2 border-white/50 rounded-lg flex items-center justify-center">
                {isScanning && (
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
                )}
                {!cameraReady && (
                  <div className="text-center text-white/80">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p>Accessing camera...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scanning indicator */}
            {isScanning && cameraReady && (
              <div className="absolute top-2 left-2 bg-blue-500/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <span className="animate-pulse mr-1 h-2 w-2 bg-white inline-block rounded-full"></span>
                Scanning...
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              {!scanResult ? (
                <Button
                  variant={isScanning ? "outline" : "default"}
                  onClick={() => setIsScanning(!isScanning)}
                  className={isScanning ? "bg-white/90 text-red-600 hover:bg-white" : "bg-white/90 text-blue-600 hover:bg-white"}
                >
                  {isScanning ? "Pause Scanning" : "Resume Scanning"}
                </Button>
              ) : (
                <Button
                  onClick={() => resetScan()}
                  className="bg-white/90 text-blue-600 hover:bg-white"
                >
                  Scan New Product
                </Button>
              )}
            </div>
          </div>

          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white rounded-lg shadow-md"
            >
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
                    Scan Another Product
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

        {/* Temporary Product Card */}
        {tempProductCard && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-1/3 bg-white rounded-lg shadow-lg p-4 sticky top-0"
          >
            <Card className="w-full">
              <CardContent className="p-0">
                <div className="w-full h-40 relative" style={{ flexBasis: '70%' }}>
                  <Image
                    src={tempProductCard.image || "/placeholder.svg"}
                    alt={tempProductCard.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-3" style={{ flexBasis: '30%' }}>
                  <h3 className="font-bold text-md truncate">{tempProductCard.name}</h3>
                  <p className="text-green-600 font-semibold text-lg">₹{tempProductCard.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
