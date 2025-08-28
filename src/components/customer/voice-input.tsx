"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VoiceInputProps {
  onResult: (text: string) => void
  placeholder?: string
  className?: string
}

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

class SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null

  constructor() {
    super()
    this.continuous = false
    this.interimResults = false
    this.lang = "en-US"
    this.onresult = null
    this.onerror = null
    this.onend = null
  }

  start(): void {
    // Implementation will be provided by the browser
  }

  stop(): void {
    // Implementation will be provided by the browser
  }
}

export function VoiceInput({ onResult, placeholder = "Search products...", className = "" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let recognition: SpeechRecognition | null = null

    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
      if (recognition) {
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          onResult(transcript)
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
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [onResult, toast])

  const toggleListening = () => {
    if (!isListening) {
      try {
        const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
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
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        readOnly
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={toggleListening}
      >
        {isListening ? (
          <MicOff className="h-5 w-5 text-red-500" />
        ) : (
          <Mic className="h-5 w-5 text-gray-500" />
        )}
      </Button>
    </div>
  )
} 