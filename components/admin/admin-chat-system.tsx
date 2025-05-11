"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Search, Bell, BellOff, Settings, User, Clock, CheckCheck, Check, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ChatSoundSettings from "@/components/admin/chat-sound-settings"
import { useChatSounds } from "@/hooks/use-chat-sounds"

// Types
interface ChatMessage {
  id: string
  conversationId: string
  sender: {
    id: string
    name: string
    email: string
    avatar: string
  }
  content: string
  timestamp: string
  read: boolean
  isAdmin: boolean
}

interface ChatConversation {
  id: string
  user: {
    id: string
    name: string
    email: string
    avatar: string
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: "online" | "offline" | "away"
}

interface AdminChatSystemProps {
  onUnreadMessagesChange: (count: number) => void
}

export default function AdminChatSystem({ onUnreadMessagesChange }: AdminChatSystemProps) {
  const [activeTab, setActiveTab] = useState("conversations")
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSoundSettings, setShowSoundSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { playSound, soundSettings, updateSoundSettings } = useChatSounds()

  // Calculate total unread messages
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
    onUnreadMessagesChange(totalUnread)
  }, [conversations, onUnreadMessagesChange])

  // Load conversations and messages from API
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => {
        setConversations(data.conversations)
        if (selectedConversation) {
          setMessages(data.messages.filter((m: any) => m.conversationId === selectedConversation.id))
        }
      })
  }, [])

  // Reload messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetch("/api/chat")
        .then((r) => r.json())
        .then((data) => {
          setMessages(data.messages.filter((m: any) => m.conversationId === selectedConversation.id))
          // Mark as read
          fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "setAllRead", payload: selectedConversation.id }),
          })
        })
    }
  }, [selectedConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const msg: ChatMessage = {
      id: `msg${Date.now()}`,
      conversationId: selectedConversation.id,
      sender: {
        id: "admin1",
        name: "Administrador",
        email: "admin@supermercadokin.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
      isAdmin: true,
    }

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "addMessage", payload: msg }),
    })

    setMessages((prev) => [...prev, msg])
    setNewMessage("")

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: msg.content, lastMessageTime: "Ahora" }
          : c,
      ),
    )
  }, [newMessage, selectedConversation])

  const handleDeleteConversation = async (id: string) => {
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "deleteConversation", payload: id }),
    })
    setConversations((prev) => prev.filter((c) => c.id !== id))
    setSelectedConversation(null)
    setMessages([])
  }

  const markAllAsRead = () => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => ({
        ...conv,
        unreadCount: 0,
      })),
    )

    toast({
      title: "Todos los mensajes marcados como leídos",
      description: "Ha borrado todas las notificaciones de mensajes no leídos",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "En línea"
      case "away":
        return "Ausente"
      default:
        return "Desconectado"
    }
  }

  return (
    <div className="grid h-[calc(100vh-220px)] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      {/* Left sidebar - Conversations list */}
      <Card className="flex h-full flex-col overflow-hidden">
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar conversaciones..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b p-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="unread">No leídos</TabsTrigger>
              <TabsTrigger value="online">En línea</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-3 hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? "bg-gray-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                      conversation.status,
                    )}`}
                  ></span>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{conversation.user.name}</h4>
                    <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                  </div>
                  <p className="truncate text-sm text-gray-500">{conversation.lastMessage}</p>
                </div>

                {conversation.unreadCount > 0 && (
                  <Badge className="ml-auto bg-red-600">{conversation.unreadCount}</Badge>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-2 text-red-500 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConversation(conversation.id)
                  }}
                  title="Eliminar conversación"
                >
                  🗑️
                </Button>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No se encontraron conversaciones</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
            <CheckCheck className="mr-1 h-4 w-4" /> Marcar todo como leído
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSoundSettings(!showSoundSettings)}
            >
              {soundSettings.enabled ? (
                <Bell className="h-4 w-4 text-red-600" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Right side - Chat area */}
      <Card className="flex h-full flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b p-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.user.avatar || "/placeholder.svg"}
                    alt={selectedConversation.user.name}
                  />
                  <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.user.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${getStatusColor(selectedConversation.status)}`}
                    ></span>
                    <p className="text-xs text-gray-500">{selectedConversation.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <User className="mr-1 h-4 w-4" /> Perfil
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Clock className="mr-1 h-4 w-4" /> Historial
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 flex ${message.isAdmin ? "justify-end" : "justify-start"}`}>
                  {!message.isAdmin && (
                    <Avatar className="mr-2 mt-1 h-8 w-8">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isAdmin ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                        message.isAdmin ? "text-red-200" : "text-gray-500"
                      }`}
                    >
                      <span>{message.timestamp}</span>
                      {message.isAdmin && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                  {message.isAdmin && (
                    <Avatar className="ml-2 mt-1 h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Escriba un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-medium">No hay conversación seleccionada</h3>
            <p className="text-center text-gray-500">Seleccione una conversación de la lista para comenzar a chatear</p>
          </div>
        )}
      </Card>

      {/* Sound settings modal */}
      {showSoundSettings && (
        <ChatSoundSettings
          settings={soundSettings}
          onUpdate={updateSoundSettings}
          onClose={() => setShowSoundSettings(false)}
        />
      )}
    </div>
  )
}
