"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Bell, Play, Volume2 } from "lucide-react"
import type { ChatSoundSettings } from "@/hooks/use-chat-sounds"

interface ChatSoundSettingsProps {
  settings: ChatSoundSettings
  onUpdate: (settings: ChatSoundSettings) => void
  onClose: () => void
}

// Available sound options
const availableSounds = {
  newMessage: [
    { id: "notification1", name: "Notificación 1", path: "/sonidos/notification1.mp3" },
    { id: "notification2", name: "Notificación 2", path: "/sonidos/notification2.mp3" },
    { id: "notification3", name: "Notificación 3", path: "/sonidos/notification3.mp3" },
  ],
  newConversation: [
    { id: "chat1", name: "Chat 1", path: "/sonidos/chat1.mp3" },
    { id: "chat2", name: "Chat 2", path: "/sonidos/chat2.mp3" },
    { id: "chat3", name: "Chat 3", path: "/sonidos/chat3.mp3" },
  ],
  sentMessage: [
    { id: "sent1", name: "Enviado 1", path: "/sonidos/sent1.mp3" },
    { id: "sent2", name: "Enviado 2", path: "/sonidos/sent2.mp3" },
    { id: "none", name: "Ninguno", path: "" },
  ],
}

export default function ChatSoundSettings({ settings, onUpdate, onClose }: ChatSoundSettingsProps) {
  const [currentSettings, setCurrentSettings] = useState<ChatSoundSettings>(settings)

  const handleSave = () => {
    onUpdate(currentSettings)
    onClose()
  }

  const playSound = (soundPath: string) => {
    if (!soundPath) return

    try {
      const audio = new Audio(soundPath)
      audio.volume = currentSettings.volume
      audio.play()
    } catch (error) {
      console.error("Error reproduciendo sonido:", error)
    }
  }

  const getSelectedSoundPath = (type: keyof typeof availableSounds, soundId: string) => {
    return availableSounds[type].find((sound) => sound.id === soundId)?.path || ""
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notificaciones de Sonido
          </DialogTitle>
          <DialogDescription>Configure las notificaciones de sonido para el sistema de chat.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" /> Activar notificaciones de sonido
            </Label>
            <Switch
              id="sound-enabled"
              checked={currentSettings.enabled}
              onCheckedChange={(checked) => setCurrentSettings({ ...currentSettings, enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">Volumen</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="volume"
                min={0}
                max={1}
                step={0.1}
                value={[currentSettings.volume]}
                onValueChange={(value) => setCurrentSettings({ ...currentSettings, volume: value[0] })}
                disabled={!currentSettings.enabled}
                className="flex-1"
              />
              <span className="w-10 text-center">{Math.round(currentSettings.volume * 100)}%</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Opciones de Sonido</h4>

            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="space-y-1">
                <Label htmlFor="new-message-sound">Mensaje nuevo</Label>
                <Select
                  value={currentSettings.sounds.newMessage}
                  onValueChange={(value) =>
                    setCurrentSettings({
                      ...currentSettings,
                      sounds: { ...currentSettings.sounds, newMessage: value },
                    })
                  }
                  disabled={!currentSettings.enabled}
                >
                  <SelectTrigger id="new-message-sound">
                    <SelectValue placeholder="Seleccionar sonido" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSounds.newMessage.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="mt-6"
                onClick={() => playSound(getSelectedSoundPath("newMessage", currentSettings.sounds.newMessage))}
                disabled={!currentSettings.enabled}
              >
                <Play className="h-4 w-4" />
              </Button>

              <div className="space-y-1">
                <Label htmlFor="new-conversation-sound">Nueva conversación</Label>
                <Select
                  value={currentSettings.sounds.newConversation}
                  onValueChange={(value) =>
                    setCurrentSettings({
                      ...currentSettings,
                      sounds: { ...currentSettings.sounds, newConversation: value },
                    })
                  }
                  disabled={!currentSettings.enabled}
                >
                  <SelectTrigger id="new-conversation-sound">
                    <SelectValue placeholder="Seleccionar sonido" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSounds.newConversation.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="mt-6"
                onClick={() =>
                  playSound(getSelectedSoundPath("newConversation", currentSettings.sounds.newConversation))
                }
                disabled={!currentSettings.enabled}
              >
                <Play className="h-4 w-4" />
              </Button>

              <div className="space-y-1">
                <Label htmlFor="sent-message-sound">Mensaje enviado</Label>
                <Select
                  value={currentSettings.sounds.sentMessage}
                  onValueChange={(value) =>
                    setCurrentSettings({
                      ...currentSettings,
                      sounds: { ...currentSettings.sounds, sentMessage: value },
                    })
                  }
                  disabled={!currentSettings.enabled}
                >
                  <SelectTrigger id="sent-message-sound">
                    <SelectValue placeholder="Seleccionar sonido" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSounds.sentMessage.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="mt-6"
                onClick={() => playSound(getSelectedSoundPath("sentMessage", currentSettings.sounds.sentMessage))}
                disabled={!currentSettings.enabled || currentSettings.sounds.sentMessage === "none"}
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            Guardar Configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
