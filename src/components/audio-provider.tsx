"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
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
  const [isLoaded, setIsLoaded] = useState(false)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const soundEffects = useRef<Record<string, HTMLAudioElement>>({})

  useEffect(() => {
    // Create background music element
    backgroundMusicRef.current = new Audio("/sounds/background-music.mp3")
    backgroundMusicRef.current.loop = true
    backgroundMusicRef.current.volume = 0.2

    // Create sound effects
    soundEffects.current = {
      click: new Audio("/sounds/click.mp3"),
      success: new Audio("/sounds/success.mp3"),
      error: new Audio("/sounds/error.mp3"),
      notification: new Audio("/sounds/notification.mp3"),
    }

    // Set all volumes
    Object.values(soundEffects.current).forEach((audio) => {
      audio.volume = 0.3
    })

    setIsLoaded(true)

    // Cleanup
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }
    }
  }, [])

  // Start playing background music on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isLoaded && backgroundMusicRef.current && !isMuted) {
        backgroundMusicRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }

      // Remove event listeners after first interaction
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [isLoaded, isMuted])

  // Update background music when mute state changes
  useEffect(() => {
    if (!backgroundMusicRef.current) return

    if (isMuted) {
      backgroundMusicRef.current.pause()
    } else {
      backgroundMusicRef.current.play().catch((e) => console.log("Audio play failed:", e))
    }
  }, [isMuted])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const playSound = (sound: string) => {
    if (isMuted || !isLoaded) return

    const audio = soundEffects.current[sound]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((e) => console.log(`Sound effect play failed: ${sound}`, e))
    }
  }

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
      {isLoaded && (
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
      )}
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
