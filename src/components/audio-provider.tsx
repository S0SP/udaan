"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

type AudioContextType = {
  isMuted: boolean
  toggleMute: () => void
  playSound: (sound: string) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const playSound = (sound: string) => {
    // No-op function since we're not using sounds
      }

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-5 w-5 text-gray-600" /> : <Volume2 className="h-5 w-5 text-blue-600" />}
        </Button>
      </div>
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
