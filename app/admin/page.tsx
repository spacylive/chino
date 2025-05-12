"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, LayoutGrid, Settings, Users, ImageIcon, MessageSquare, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminChatSystem from "@/components/admin/admin-chat-system"
import AdminMarketplaceMessenger from "@/components/admin/admin-marketplace-messenger"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"
import AdminLoginModal from "@/components/admin-login-modal"
import type { VideoOffer } from "@/types/video-offers"

function validateOfferForm(formData: FormData, isEdit = false) {
  const errors: string[] = [];
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const image = formData.get("image") as File;
  const video = formData.get("video") as File;
  const thumbnail = formData.get("thumbnail") as File;
  if (!title || title.trim().length < 3) errors.push("El título es obligatorio y debe tener al menos 3 caracteres.");
  if (!description || description.trim().length < 10) errors.push("La descripción debe tener al menos 10 caracteres.");
  if (!startDate || !endDate) errors.push("Debe ingresar fechas de inicio y fin.");
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) errors.push("La fecha de inicio debe ser anterior a la fecha de fin.");
  if (!isEdit) {
    if (!image || image.size === 0) errors.push("Debe subir una imagen.");
    if (!video || video.size === 0) errors.push("Debe subir un video.");
    if (!thumbnail || thumbnail.size === 0) errors.push("Debe subir una miniatura.");
  }
  if (image && image.size > 2 * 1024 * 1024) errors.push("La imagen no debe superar 2MB.");
  if (thumbnail && thumbnail.size > 2 * 1024 * 1024) errors.push("La miniatura no debe superar 2MB.");
  if (video && video.size > 50 * 1024 * 1024) errors.push("El video no debe superar 50MB.");
  if (image && !image.type.startsWith("image/")) errors.push("El archivo de imagen no es válido.");
  if (thumbnail && !thumbnail.type.startsWith("image/")) errors.push("El archivo de miniatura no es válido.");
  if (video && !video.type.startsWith("video/")) errors.push("El archivo de video no es válido.");
  return errors;
}

function VideoOffersList() {
  const [offers, setOffers] = useState<VideoOffer[]>([])
  const [editing, setEditing] = useState<null | VideoOffer>(null)
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/offers").then(r => r.json()).then(setOffers)
  }, [])

  const handleEdit = (offer: VideoOffer) => setEditing(offer)
  const handleCancel = () => setEditing(null)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const errors = validateOfferForm(formData, true);
    if (errors.length) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]);
    const uploadFile = async (file: File, type: string) => {
      if (!file) return "";
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      return data.path || "";
    };
    let videoUrl = formData.get("videoUrl") as string;
    let thumbnailUrl = formData.get("thumbnailUrl") as string;
    const videoFile = formData.get("video") as File;
    const thumbFile = formData.get("thumbnail") as File;
    if (videoFile && videoFile.size > 0) videoUrl = await uploadFile(videoFile, "video");
    if (thumbFile && thumbFile.size > 0) thumbnailUrl = await uploadFile(thumbFile, "thumbnail");
    const updated = {
      ...editing,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoUrl,
      thumbnailUrl,
      isActive: formData.get("status") === "activo",
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch("/api/offers", { method: "GET" });
    const all = await res.json();
    const newList = all.map((o: VideoOffer) => o.id === updated.id ? updated : o);
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList),
    });
    setOffers(newList);
    setEditing(null);
    toast({ title: "Oferta actualizada", description: "Los cambios se guardaron correctamente" });
  };

  if (editing) {
    return (
      <form className="space-y-4" onSubmit={handleSave}>
        {formErrors.length > 0 && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded p-2 text-sm">
            <ul className="list-disc pl-5">
              {formErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input name="title" defaultValue={editing.title} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select name="status" className="w-full border rounded px-3 py-2" defaultValue={editing.isActive ? "activo" : "programado"}>
            <option value="activo">Activo</option>
            <option value="programado">Programado</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Fecha inicio</label>
          <input name="startDate" type="date" className="w-full border rounded px-3 py-2" defaultValue={editing.startDate} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Fecha fin</label>
          <input name="endDate" type="date" className="w-full border rounded px-3 py-2" defaultValue={editing.endDate} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea name="description" className="w-full border rounded px-3 py-2" rows={2} defaultValue={editing.description} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Video actual</label>
          <video src={editing.videoUrl} controls className="w-full h-32 object-contain mb-2" />
          <input name="videoUrl" type="hidden" value={editing.videoUrl} />
          <input name="video" type="file" accept="video/*" className="w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Miniatura actual</label>
          <img src={editing.thumbnailUrl} alt="thumb" className="h-10 w-16 object-cover rounded mb-2" />
          <input name="thumbnailUrl" type="hidden" value={editing.thumbnailUrl} />
          <input name="thumbnail" type="file" accept="image/*" className="w-full" />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Guardar cambios</Button>
        </div>
      </form>
    )
  }

  if (!offers.length) return <p className="text-gray-500">No hay ofertas registradas.</p>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">Título</th>
            <th className="px-2 py-1 text-left">Estado</th>
            <th className="px-2 py-1 text-left">Rango</th>
            <th className="px-2 py-1 text-left">Miniatura</th>
            <th className="px-2 py-1 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td className="px-2 py-1">{offer.title}</td>
              <td className="px-2 py-1">{offer.isActive ? "Activo" : "Programado"}</td>
              <td className="px-2 py-1">{offer.startDate} - {offer.endDate}</td>
              <td className="px-2 py-1">
                <img src={offer.thumbnailUrl} alt="thumb" className="h-10 w-16 object-cover rounded" />
              </td>
              <td className="px-2 py-1 flex gap-2">
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => handleEdit(offer)}
                >Editar</Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={async () => {
                    const res = await fetch("/api/offers", { method: "GET" });
                    const all = await res.json();
                    const filtered = all.filter((o:any) => o.id !== offer.id);
                    await fetch("/api/offers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(filtered),
                    });
                    setOffers(filtered);
                  }}
                >Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [showAdminSection, setShowAdminSection] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  useKeyboardShortcut(
    " ",
    () => {
      if (isAuthenticated) {
        setShowAdminSection((v) => !v)
      } else {
        setShowAdminLogin(true)
      }
    },
    { ctrlKey: true }
  )

  const checkAuth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/auth/status")
      if (response.ok) {
        setIsAuthenticated(true)
        setShowAdminLogin(false)
      } else {
        setIsAuthenticated(false)
        setShowAdminLogin(true)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setShowAdminLogin(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    setIsAuthenticated(false)
    setShowAdminLogin(true)
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Cargando...</h2>
          <p className="text-gray-600">Por favor espere</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {isAuthenticated ? (
        <>
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
            {showAdminLogin && (
              <AdminLoginModal 
                isOpen={showAdminLogin} 
                onClose={() => setShowAdminLogin(false)} 
                onLoginSuccess={checkAuth} 
              />
            )}
            {showAdminSection && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="relative w-full max-w-3xl">
                  <Button
                    className="absolute right-2 top-2 z-10 bg-white text-red-700 hover:bg-red-100"
                    onClick={() => setShowAdminSection(false)}
                  >
                    Cerrar
                  </Button>
                  <AdminMarketplaceMessenger />
                </div>
              </div>
            )}
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" /> Dashboard
                </TabsTrigger>
                <TabsTrigger value="galleries" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Galleries
                </TabsTrigger>
                <TabsTrigger value="video-offers" className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Video Offers
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Productos
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
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Crear nueva oferta de video</CardTitle>
                    <CardDescription>Complete los campos y suba los archivos multimedia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget as HTMLFormElement;
                        const formData = new FormData(form);
                        const errors = validateOfferForm(formData);
                        if (errors.length) {
                          toast({ title: "Error de validación", description: errors.join("\n"), variant: "destructive" });
                          return;
                        }
                        const uploadFile = async (file: File, type: string) => {
                          if (!file) return "";
                          const fd = new FormData();
                          fd.append("file", file);
                          fd.append("type", type);
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          return data.path || "";
                        };
                        const image = formData.get("image") as File;
                        const video = formData.get("video") as File;
                        const thumbnail = formData.get("thumbnail") as File;
                        let imageUrl = "";
                        let videoUrl = "";
                        let thumbnailUrl = "";
                        if (image) imageUrl = await uploadFile(image, "image");
                        if (video) videoUrl = await uploadFile(video, "video");
                        if (thumbnail) thumbnailUrl = await uploadFile(thumbnail, "thumbnail");
                        const offer = {
                          id: Date.now().toString(),
                          title: formData.get("title") as string,
                          description: formData.get("description") as string,
                          videoUrl,
                          thumbnailUrl,
                          isActive: formData.get("status") === "activo",
                          startDate: formData.get("startDate") as string,
                          endDate: formData.get("endDate") as string,
                          displayOptions: {
                            autoplay: true,
                            controls: true,
                            loop: true,
                            muted: true,
                            showBadge: false,
                            badgeText: "",
                            badgeColor: "bg-purple-600",
                          },
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        const res = await fetch("/api/offers", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(offer),
                        });
                        if (res.ok) {
                          toast({ title: "Oferta guardada", description: "La oferta se guardó correctamente" });
                          form.reset();
                          setTimeout(() => window.location.reload(), 1000);
                        } else {
                          toast({ title: "Error", description: "No se pudo guardar la oferta", variant: "destructive" });
                        }
                      }}
                    >
                      <div>
                        <label className="block mb-1 font-medium">Título</label>
                        <input name="title" className="w-full border rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Estado</label>
                        <select name="status" className="w-full border rounded px-3 py-2">
                          <option value="activo">Activo</option>
                          <option value="programado">Programado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Fecha inicio</label>
                        <input name="startDate" type="date" className="w-full border rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Fecha fin</label>
                        <input name="endDate" type="date" className="w-full border rounded px-3 py-2" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Descripción</label>
                        <textarea name="description" className="w-full border rounded px-3 py-2" rows={2} required />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Imagen</label>
                        <input name="image" type="file" accept="image/*" className="w-full" required />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Video</label>
                        <input name="video" type="file" accept="video/*" className="w-full" required />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Miniatura</label>
                        <input name="thumbnail" type="file" accept="image/*" className="w-full" required />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Guardar Oferta</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ofertas de video existentes</CardTitle>
                    <CardDescription>Lista de ofertas guardadas en el sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoOffersList />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Administrar Productos</h2>
                <iframe src="/admin/products" className="w-full min-h-[600px] rounded border" />
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
        </>
      ) : (
        <AdminLoginModal 
          isOpen={showAdminLogin} 
          onClose={() => setShowAdminLogin(false)} 
          onLoginSuccess={checkAuth}
        />
      )}
    </div>
  )
}
