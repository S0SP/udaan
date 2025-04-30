"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, Result } from "@zxing/library"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()
    let isActive = true

    const startScanning = async () => {
      try {
        setIsScanning(true)
        const videoInputDevices = await codeReader.listVideoInputDevices()
        
        if (videoInputDevices.length === 0) {
          throw new Error("No camera found")
        }

        const selectedDeviceId = videoInputDevices[0].deviceId
        const constraints = {
          video: { deviceId: selectedDeviceId }
        }

        if (videoRef.current) {
          await codeReader.decodeFromConstraints(
            constraints,
            videoRef.current,
            (result: Result | null, error: Error | undefined) => {
              if (result && isActive) {
                const barcode = result.getText()
                onScan(barcode)
                toast({
                  title: "Barcode Scanned",
                  description: `Scanned barcode: ${barcode}`,
                  variant: "default",
                })
                stopScanning()
              }
              if (error && error.name !== "NotFoundException") {
                console.error("Scanning error:", error)
              }
            }
          )
        }
      } catch (error) {
        console.error("Failed to start scanning:", error)
        toast({
          title: "Error",
          description: "Failed to access camera. Please make sure you have granted camera permissions.",
          variant: "destructive",
        })
        setIsScanning(false)
      }
    }

    const stopScanning = () => {
      codeReader.reset()
      setIsScanning(false)
      onClose()
    }

    startScanning()

    return () => {
      isActive = false
      stopScanning()
    }
  }, [onScan, onClose, toast])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative bg-white p-4 rounded-lg max-w-lg w-full mx-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scan Barcode</h2>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-12 w-12 text-white/50" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            {isScanning
              ? "Position the barcode in front of your camera"
              : "Starting camera..."}
          </p>
        </div>
      </div>
    </div>
  )
} 