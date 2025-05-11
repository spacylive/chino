"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send } from "lucide-react"

// Sample data for the messenger
const vendors = [
  {
    id: 1,
    name: "Golden Dragon Foods",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "We have a new shipment of premium rice available",
    unread: 2,
    time: "10:30 AM",
  },
  {
    id: 2,
    name: "Jade Garden Imports",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Thank you for your order. It will be shipped tomorrow.",
    unread: 0,
    time: "Yesterday",
  },
  {
    id: 3,
    name: "Lucky Star Seafood",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Fresh seafood delivery scheduled for Friday",
    unread: 5,
    time: "Yesterday",
  },
  {
    id: 4,
    name: "Phoenix Tea Imports",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "New premium tea samples are on the way",
    unread: 0,
    time: "Monday",
  },
  {
    id: 5,
    name: "Red Lantern Spices",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Invoice #1234 has been paid",
    unread: 0,
    time: "Monday",
  },
]

// Sample messages for a conversation
const sampleMessages = [
  {
    id: 1,
    sender: "vendor",
    text: "Hello! We have a new shipment of premium jasmine rice available. Would you be interested in placing an order?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "admin",
    text: "Hi there! Yes, we're definitely interested. What quantities are available and what's your current pricing?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "vendor",
    text: "We have 25kg and 50kg bags available. The 25kg bags are $45 each, and the 50kg bags are $85 each. We also have a special promotion: buy 10 bags of 50kg and get 1 free.",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "admin",
    text: "That sounds good. We'd like to place an order for 10 bags of 50kg to take advantage of the promotion. When can you deliver?",
    time: "10:38 AM",
  },
  {
    id: 5,
    sender: "vendor",
    text: "Great! We can deliver this Friday. Would that work for you?",
    time: "10:40 AM",
  },
]

export default function AdminMarketplaceMessenger() {
  const [selectedVendor, setSelectedVendor] = useState(vendors[0])
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(sampleMessages)

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: messages.length + 1,
      sender: "admin",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Simulate vendor response after a delay
    setTimeout(() => {
      const vendorResponse = {
        id: messages.length + 2,
        sender: "vendor",
        text: "Thank you for your message. I'll get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, vendorResponse])
    }, 2000)
  }

  return (
    <Card className="h-[calc(100vh-200px)] overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle>Marketplace Messenger</CardTitle>
        <CardDescription>Communicate with vendors and suppliers (Press Ctrl+Space to quickly access)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid h-full grid-cols-[300px_1fr]">
          {/* Vendors List */}
          <div className="border-r border-gray-200">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input type="search" placeholder="Search vendors..." className="pl-8" />
              </div>
            </div>

            <Tabs defaultValue="all" className="px-3">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-[calc(100vh-350px)] overflow-y-auto">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-3 hover:bg-gray-50 ${
                    selectedVendor.id === vendor.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={vendor.avatar || "/placeholder.svg"} alt={vendor.name} />
                      <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        vendor.status === "online" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></span>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{vendor.name}</h4>
                      <span className="text-xs text-gray-500">{vendor.time}</span>
                    </div>
                    <p className="truncate text-sm text-gray-500">{vendor.lastMessage}</p>
                  </div>

                  {vendor.unread > 0 && <Badge className="ml-auto bg-red-600">{vendor.unread}</Badge>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex h-full flex-col">
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedVendor.avatar || "/placeholder.svg"} alt={selectedVendor.name} />
                  <AvatarFallback>{selectedVendor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedVendor.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedVendor.status === "online" ? (
                      <span className="flex items-center">
                        <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span> Online
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "admin" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 text-right text-xs ${
                        message.sender === "admin" ? "text-red-200" : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" className="bg-red-600 hover:bg-red-700" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
