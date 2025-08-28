"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Camera, Upload, X, Loader2, Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/components/audio-provider"
import { analyzeInvoice, InvoiceAnalysisResult } from "@/services/geminiInvoiceService"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export function NewStockUpload() {
  const router = useRouter()
  const { playSound } = useAudio()
  const { toast } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<InvoiceAnalysisResult | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraActive(true)
        setCameraError(null)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setCameraError('Unable to access camera. Please check your device and browser settings.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-invoice.jpg", { type: "image/jpeg" })
            setSelectedFile(file)
            setImage(canvas.toDataURL('image/jpeg'))
            setError(null)
            setResult(null)
          }
        }, 'image/jpeg')
        
        stopCamera()
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
      setResult(null)
    }
  }

  const clearImage = () => {
    setImage(null)
    setSelectedFile(null)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or capture an invoice image')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const analysisResult = await analyzeInvoice(selectedFile)
      setResult(analysisResult)
      playSound("success")
    } catch (err) {
      console.error('Error in handleAnalyze:', err)
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}`)
      } else {
        setError('Failed to analyze invoice. Please check the console for details.')
      }
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    
    setIsLoading(true)
    
    try {
      // Store invoice data in MongoDB
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: result.items,
          totalAmount: result.totalAmount,
          invoiceDate: result.invoiceDate,
          vendorName: result.vendorName,
          invoiceNumber: result.invoiceNumber,
          imageUrl: image || '/placeholder.svg'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save invoice data');
      }

      toast({
        title: "Success",
        description: "Invoice and product stock have been updated successfully.",
      });
      
      // Navigate to the products page
      playSound("success");
      router.push('/shopkeeper/products');
    } catch (error) {
      console.error('Error saving invoice data:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      toast({
        title: "Error saving stock",
        description: errorMessage,
        variant: "destructive",
      });

      setError(errorMessage);
      playSound("error");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Stock Upload</h1>
        {result && (
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save to Inventory
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload/Capture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Hidden canvas for capturing images */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <div className="space-y-4">
                {/* Image Preview or Camera Feed */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg aspect-video relative overflow-hidden">
                  {isCameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Button
                          variant="default"
                          size="lg"
                          className="rounded-full w-12 h-12 p-0"
                          onClick={captureImage}
                        >
                          <Camera className="h-6 w-6" />
                        </Button>
                      </div>
                    </>
                  ) : image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt="Invoice"
                        fill
                        className="object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 text-center">
                        Click to upload an invoice image or use the camera
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  {!isCameraActive && (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={startCamera}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Use Camera
                      </Button>
                    </>
                  )}
                </div>

                {/* Camera Error Alert */}
                {cameraError && (
                  <Alert variant="destructive">
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{cameraError}</AlertDescription>
                  </Alert>
                )}

                {/* Analyze Button */}
                {image && !isLoading && !result && (
                  <Button
                    className="w-full"
                    onClick={handleAnalyze}
                  >
                    Analyze Invoice
                  </Button>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing invoice...
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Invoice Details */}
                    <div className="grid grid-cols-2 gap-4">
                      {result.vendorName && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Vendor</p>
                          <p className="text-lg">{result.vendorName}</p>
                        </div>
                      )}
                      {result.invoiceDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-lg">{result.invoiceDate}</p>
                        </div>
                      )}
                      {result.invoiceNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                          <p className="text-lg">{result.invoiceNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold">₹{result.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}