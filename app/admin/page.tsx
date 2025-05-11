"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, LayoutGrid, Settings, Users, ImageIcon, MessageSquare, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminChatSystem from "@/components/admin/admin-chat-system"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true"
      setIsAuthenticated(isAdminAuthenticated)
      setIsLoading(false)

      if (!isAdminAuthenticated) {
        toast({
          title: "Access Denied",
          description: "You must be logged in to access the admin panel",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    checkAuth()
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin <span className="text-purple-600">Panel</span>
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="galleries" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Galleries
            </TabsTrigger>
            <TabsTrigger value="video-offers" className="flex items-center gap-2">
              <Video className="h-4 w-4" /> Video Offers
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <div className="relative">
                <MessageSquare className="h-4 w-4" />
                {unreadMessages > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadMessages}
                  </span>
                )}
              </div>
              Chat
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Galleries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">+24 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">+4 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Video Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Overview of recent system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">New video offer created</p>
                      <p className="text-sm text-gray-500">Summer Special Collection</p>
                    </div>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">User registered</p>
                      <p className="text-sm text-gray-500">maria@example.com</p>
                    </div>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">New chat message</p>
                      <p className="text-sm text-gray-500">From: john@example.com</p>
                    </div>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Layout template added</p>
                      <p className="text-sm text-gray-500">Modern Split</p>
                    </div>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="galleries">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Gallery Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>All Galleries</CardTitle>
                <CardDescription>Manage photo galleries and layouts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Gallery management interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video-offers">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Video Offers</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Promotional Videos</CardTitle>
                    <CardDescription>Manage video offers displayed on your website</CardDescription>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/video-offers")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Manage Video Offers
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img
                          src="/placeholder.svg?height=720&width=1280"
                          alt="Summer Special Collection"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                          <span className="mb-1 text-xs font-bold text-white">ACTIVE</span>
                          <h3 className="text-sm font-bold text-white">Summer Special Collection</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500">Jun 1 - Aug 31, 2023</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-0">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img
                          src="/placeholder.svg?height=720&width=1280"
                          alt="Premium Tea Collection"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                          <span className="mb-1 text-xs font-bold text-white">ACTIVE</span>
                          <h3 className="text-sm font-bold text-white">Premium Tea Collection</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500">May 1 - Dec 31, 2023</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-0">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img
                          src="/placeholder.svg?height=720&width=1280"
                          alt="Cooking Utensils Sale"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                          <span className="mb-1 text-xs font-bold text-white">SCHEDULED</span>
                          <h3 className="text-sm font-bold text-white">Cooking Utensils Sale</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500">Jul 1 - Jul 31, 2023</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Chat System</h2>
            <AdminChatSystem onUnreadMessagesChange={setUnreadMessages} />
          </TabsContent>

          <TabsContent value="users">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">User Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">User management interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">System Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure system preferences and options</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Settings interface would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-8 border-t bg-white p-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Photo Display Configurator - Admin Panel</p>
      </footer>
    </div>
  )
}
