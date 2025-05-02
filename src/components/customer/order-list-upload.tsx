"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"

interface OrderListUploadProps {
  onProcessOrder: (items: { name: string; quantity: number }[]) => void
}

export function OrderListUpload({ onProcessOrder }: OrderListUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      // Convert the image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          resolve(base64.split(",")[1])
        }
        reader.readAsDataURL(file)
      })

      // Call Gemini AI API to process the image
      const response = await fetch("/api/process-order-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      })

      if (!response.ok) {
        throw new Error("Failed to process order list")
      }

      const data = await response.json()
      onProcessOrder(data.items)

      toast({
        title: "Success",
        description: "Order list processed successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error processing order list:", error)
      toast({
        title: "Error",
        description: "Failed to process order list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="order-list-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="order-list-upload"
        className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none"
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="font-medium text-gray-600">
            {isProcessing ? "Processing..." : "Upload Order List"}
          </span>
          <span className="text-sm text-gray-500">
            Click to upload or drag and drop
          </span>
        </div>
      </label>
    </div>
  )
} 