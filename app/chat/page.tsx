"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatMessage {
  id: string
  content: string
  timestamp: string
  isUser: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "¡Bienvenido al chat de atención al cliente de Supermercado Kin! ¿En qué podemos ayudarle hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate admin response after a delay
    setTimeout(() => {
      let responseContent = "Gracias por su mensaje. Nuestro equipo se pondrá en contacto con usted a la brevedad."

      // Simple auto-responses based on keywords in Spanish
      const lowerCaseMessage = newMessage.toLowerCase()
      if (lowerCaseMessage.includes("ayuda") || lowerCaseMessage.includes("ayudar")) {
        responseContent = "Con gusto le ayudaré. ¿Podría proporcionarme más detalles sobre su consulta?"
      } else if (
        lowerCaseMessage.includes("precio") ||
        lowerCaseMessage.includes("costo") ||
        lowerCaseMessage.includes("valor")
      ) {
        responseContent =
          "La información de precios se encuentra en nuestra página de productos. ¿Desea que le proporcione el enlace?"
      } else if (lowerCaseMessage.includes("gracias") || lowerCaseMessage.includes("agradezco")) {
        responseContent = "¡De nada! ¿Hay algo más en lo que pueda ayudarle hoy?"
      } else if (
        lowerCaseMessage.includes("horario") ||
        lowerCaseMessage.includes("abierto") ||
        lowerCaseMessage.includes("cerrado")
      ) {
        responseContent =
          "Nuestro horario de atención es de lunes a sábado de 8:00 AM a 9:00 PM y domingos de 9:00 AM a 7:00 PM."
      } else if (
        lowerCaseMessage.includes("ubicación") ||
        lowerCaseMessage.includes("dirección") ||
        lowerCaseMessage.includes("donde")
      ) {
        responseContent = "Estamos ubicados en Av. Principal #123, Colonia Centro. ¿Necesita indicaciones para llegar?"
      } else if (
        lowerCaseMessage.includes("entrega") ||
        lowerCaseMessage.includes("delivery") ||
        lowerCaseMessage.includes("domicilio")
      ) {
        responseContent =
          "Ofrecemos servicio a domicilio para pedidos superiores a $300. El tiempo estimado de entrega es de 45-60 minutos dependiendo de su ubicación."
      }

      const adminResponse: ChatMessage = {
        id: `admin-${Date.now()}`,
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
      }

      setMessages((prev) => [...prev, adminResponse])

      // Show notification
      toast({
        title: "Nuevo mensaje",
        description: "Ha recibido un nuevo mensaje de atención al cliente",
      })
    }, 1000)
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-gray-50 p-4">
      <Card className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden">
        <CardHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Supermercado Kin" />
                  <AvatarFallback>KIN</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">Chat de Atención al Cliente</CardTitle>
              </div>
            </div>
            <div className="flex h-2 w-2 items-center rounded-full bg-green-500"></div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              {!message.isUser && (
                <Avatar className="mr-2 mt-1 h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Supermercado Kin" />
                  <AvatarFallback>KIN</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p className={`mt-1 text-right text-xs ${message.isUser ? "text-red-200" : "text-gray-500"}`}>
                  {message.timestamp}
                </p>
              </div>
              {message.isUser && (
                <Avatar className="ml-2 mt-1 h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usted" />
                  <AvatarFallback>UD</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Escriba su mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
