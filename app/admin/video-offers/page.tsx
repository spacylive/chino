"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Search, Edit, Trash2, Eye, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { VideoOffer } from "@/types/video-offers"
import { format } from "date-fns"

export default function VideoOffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [videoOffers, setVideoOffers] = useState<VideoOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true"
    if (!isAdminAuthenticated) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access the admin panel",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // In a real app, this would fetch from an API
    const fetchVideoOffers = async () => {
      try {
        // Simulating API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample data - in a real app this would come from the backend
        const offers: VideoOffer[] = [
          {
            id: "1",
            title: "Summer Special Collection",
            description: "Discover our new summer items with 20% discount",
            videoUrl: "https://v0.blob.com/sample-video-1.mp4",
            thumbnailUrl: "/placeholder.svg?height=720&width=1280",
            isActive: true,
            startDate: new Date("2023-06-01").toISOString(),
            endDate: new Date("2023-08-31").toISOString(),
            displayOptions: {
              autoplay: true,
              controls: false,
              loop: true,
              muted: true,
              showBadge: true,
              badgeText: "20% OFF",
              badgeColor: "bg-red-500",
            },
            createdAt: new Date("2023-05-15").toISOString(),
            updatedAt: new Date("2023-05-15").toISOString(),
          },
          {
            id: "2",
            title: "Premium Tea Collection",
            description: "Explore our exclusive selection of premium teas",
            videoUrl: "https://v0.blob.com/sample-video-2.mp4",
            thumbnailUrl: "/placeholder.svg?height=720&width=1280",
            isActive: true,
            startDate: new Date("2023-05-01").toISOString(),
            endDate: new Date("2023-12-31").toISOString(),
            displayOptions: {
              autoplay: true,
              controls: false,
              loop: true,
              muted: true,
              showBadge: true,
              badgeText: "NEW",
              badgeColor: "bg-purple-600",
            },
            createdAt: new Date("2023-04-20").toISOString(),
            updatedAt: new Date("2023-04-20").toISOString(),
          },
          {
            id: "3",
            title: "Cooking Utensils Sale",
            description: "Get up to 30% off on all cooking utensils",
            videoUrl: "https://v0.blob.com/sample-video-3.mp4",
            thumbnailUrl: "/placeholder.svg?height=720&width=1280",
            isActive: true,
            startDate: new Date("2023-07-01").toISOString(),
            endDate: new Date("2023-07-31").toISOString(),
            displayOptions: {
              autoplay: true,
              controls: false,
              loop: true,
              muted: true,
              showBadge: true,
              badgeText: "30% OFF",
              badgeColor: "bg-green-500",
            },
            createdAt: new Date("2023-06-15").toISOString(),
            updatedAt: new Date("2023-06-15").toISOString(),
          },
          {
            id: "4",
            title: "Lunar New Year Special",
            description: "Celebrate with our special Lunar New Year collection",
            videoUrl: "https://v0.blob.com/sample-video-4.mp4",
            thumbnailUrl: "/placeholder.svg?height=720&width=1280",
            isActive: false,
            startDate: new Date("2024-01-25").toISOString(),
            endDate: new Date("2024-02-15").toISOString(),
            displayOptions: {
              autoplay: true,
              controls: false,
              loop: true,
              muted: true,
              showBadge: true,
              badgeText: "SPECIAL",
              badgeColor: "bg-yellow-500",
            },
            createdAt: new Date("2023-12-10").toISOString(),
            updatedAt: new Date("2023-12-10").toISOString(),
          },
        ]

        setVideoOffers(offers)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching video offers:", error)
        setIsLoading(false)
      }
    }

    fetchVideoOffers()
  }, [router, toast])

  const handleCreateOffer = () => {
    router.push("/admin/video-offers/create")
  }

  const handleEditOffer = (id: string) => {
    router.push(`/admin/video-offers/edit/${id}`)
  }

  const handlePreviewOffer = (id: string) => {
    // In a real app, this would open a preview modal or navigate to a preview page
    toast({
      title: "Preview Video Offer",
      description: `Previewing offer with ID: ${id}`,
    })
  }

  const handleDeleteOffer = (id: string) => {
    // In a real app, this would show a confirmation dialog and then delete
    toast({
      title: "Delete Video Offer",
      description: `Offer with ID: ${id} has been deleted`,
    })

    // Update the local state to simulate deletion
    setVideoOffers((prev) => prev.filter((offer) => offer.id !== id))
  }

  const filteredOffers = videoOffers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isOfferActive = (offer: VideoOffer) => {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)
    return offer.isActive && startDate <= now && endDate >= now
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Video <span className="text-purple-600">Offers</span>
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Video Offers</CardTitle>
              <CardDescription>Create and manage promotional video offers for your website</CardDescription>
            </div>
            <Button onClick={handleCreateOffer} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Create New Offer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search video offers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">Loading video offers...</p>
            </div>
          ) : filteredOffers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-20 overflow-hidden rounded">
                            <img
                              src={offer.thumbnailUrl || "/placeholder.svg"}
                              alt={offer.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{offer.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{offer.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isOfferActive(offer) ? "border-green-500 text-green-500" : "border-gray-500 text-gray-500"
                          }
                        >
                          {isOfferActive(offer) ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(new Date(offer.startDate), "MMM d, yyyy")} -{" "}
                            {format(new Date(offer.endDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {offer.displayOptions.showBadge ? (
                          <Badge className={offer.displayOptions.badgeColor}>{offer.displayOptions.badgeText}</Badge>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handlePreviewOffer(offer.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEditOffer(offer.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeleteOffer(offer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center">
              <p className="mb-4 text-gray-500">No video offers found</p>
              <Button
                onClick={handleCreateOffer}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="mr-2 h-4 w-4" /> Create your first video offer
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredOffers.length} of {videoOffers.length} video offers
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
