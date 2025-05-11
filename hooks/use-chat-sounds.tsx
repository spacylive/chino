"use client"

import { useState, useEffect } from "react"

export interface ChatSoundSettings {
  enabled: boolean
  volume: number
  sounds: {
    newMessage: string
    newConversation: string
    sentMessage: string
  }
}

const defaultSettings: ChatSoundSettings = {
  enabled: true,
  volume: 0.5,
  sounds: {
    newMessage: "notification1",
    newConversation: "chat1",
    sentMessage: "sent1",
  },
}

// Sound paths mapping
const soundPaths: Record<string, string> = {
  notification1: "/sonidos/notification1.mp3",
  notification2: "/sonidos/notification2.mp3",
  notification3: "/sonidos/notification3.mp3",
  chat1: "/sonidos/chat1.mp3",
  chat2: "/sonidos/chat2.mp3",
  chat3: "/sonidos/chat3.mp3",
  sent1: "/sonidos/sent1.mp3",
  sent2: "/sonidos/sent2.mp3",
}

export function useChatSounds() {
  const [soundSettings, setSoundSettings] = useState<ChatSoundSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("chatSoundSettings")
    if (savedSettings) {
      try {
        setSoundSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error parsing saved sound settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  const updateSoundSettings = (newSettings: ChatSoundSettings) => {
    setSoundSettings(newSettings)
    localStorage.setItem("chatSoundSettings", JSON.stringify(newSettings))
  }

  // Play a sound based on the type
  const playSound = (type: keyof ChatSoundSettings["sounds"]) => {
    if (!soundSettings.enabled) return

    const soundId = soundSettings.sounds[type]
    if (!soundId || soundId === "none") return

    const soundPath = soundPaths[soundId]
    if (!soundPath) return

    try {
      const audio = new Audio(soundPath)
      audio.volume = soundSettings.volume
      audio.play()
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error)
    }
  }

  return {
    soundSettings,
    updateSoundSettings,
    playSound,
  }
}
