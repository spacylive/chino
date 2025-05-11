"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Play, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { VideoOffer, VideoDisplayOptions } from "@/types/video-offers"

export default function CreateVideoOfferPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [previewMode, setPreviewMode] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("/placeholder.svg?height=720&width=1280")
  const [isActive, setIsActive] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [displayOptions, setDisplayOptions] = useState<VideoDisplayOptions>({
    autoplay: true,
    controls: false,
    loop: true,
    muted: true,
    showBadge: true,
    badgeText: "NEW",
    badgeColor: "bg-purple-600",
  })

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
    }

    // Set default dates (today and 30 days from now)
    const today = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)

    setStartDate(today.toISOString().split("T")[0])
    setEndDate(thirtyDaysLater.toISOString().split("T")[0])
  }, [router, toast])

  const handleSave = async () => {
    if (!title || !description || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to save the video offer
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newOffer: Partial<VideoOffer> = {
        title,
        description,
        videoUrl: videoUrl || "https://v0.blob.com/sample-video-1.mp4", // Default video if none provided
        thumbnailUrl,
        isActive,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        displayOptions,
      }

      console.log("Saving video offer:", newOffer)

      toast({
        title: "Video Offer Created",
        description: "Your video offer has been created successfully",
      })

      router.push("/admin/video-offers")
    } catch (error) {
      console.error("Error creating video offer:", error)
      toast({
        title: "Error",
        description: "There was an error creating the video offer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateDisplayOption = <K extends keyof VideoDisplayOptions>(key: K, value: VideoDisplayOptions[K]) => {
    setDisplayOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleVideoUpload = () => {
    // In a real app, this would open a file picker and upload the video
    toast({
      title: "Video Upload",
      description: "Video upload functionality would be implemented here",
    })

    // Simulate a successful upload
    setTimeout(() => {
      setVideoUrl("https://v0.blob.com/sample-video-1.mp4")
      toast({
        title: "Video Uploaded",
        description: "Your video has been uploaded successfully",
      })
    }, 1500)
  }

  const handleThumbnailUpload = () => {
    // In a real app, this would open a file picker and upload the thumbnail
    toast({
      title: "Thumbnail Upload",
      description: "Thumbnail upload functionality would be implemented here",
    })

    // Simulate a successful upload
    setTimeout(() => {
      setThumbnailUrl("/placeholder.svg?height=720&width=1280")
      toast({
        title: "Thumbnail Uploaded",
        description: "Your thumbnail has been uploaded successfully",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/video-offers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Create Video <span className="text-purple-600">Offer</span>
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Offer Details</CardTitle>
              <CardDescription>Enter the details for your new promotional video offer</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Basic Details</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="display">Display Options</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for your video offer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a description for your video offer"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <div className="space-y-4">
                    <Label>Video</Label>
                    <div className="rounded-lg border border-dashed border-gray-300 p-4">
                      {videoUrl ? (
                        <div className="space-y-4">
                          <div className="aspect-video overflow-hidden rounded-lg bg-black">
                            <video src={videoUrl} controls className="h-full w-full object-contain" />
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => setVideoUrl("")}>
                              Remove
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleVideoUpload}>
                              Replace
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="mb-4 rounded-full bg-gray-100 p-4">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="mb-2 text-sm text-gray-500">Drag and drop a video file or click to browse</p>
                          <Button variant="outline" size="sm" onClick={handleVideoUpload}>
                            Upload Video
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Thumbnail</Label>
                    <div className="rounded-lg border border-dashed border-gray-300 p-4">
                      {thumbnailUrl ? (
                        <div className="space-y-4">
                          <div className="aspect-video overflow-hidden rounded-lg">
                            <img
                              src={thumbnailUrl || "/placeholder.svg"}
                              alt="Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => setThumbnailUrl("")}>
                              Remove
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleThumbnailUpload}>
                              Replace
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="mb-4 rounded-full bg-gray-100 p-4">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="mb-2 text-sm text-gray-500">Drag and drop an image file or click to browse</p>
                          <Button variant="outline" size="sm" onClick={handleThumbnailUpload}>
                            Upload Thumbnail
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="display" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Playback Options</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoplay"
                          checked={displayOptions.autoplay}
                          onCheckedChange={(checked) => handleUpdateDisplayOption("autoplay", checked)}
                        />
                        <Label htmlFor="autoplay">Autoplay</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="controls"
                          checked={displayOptions.controls}
                          onCheckedChange={(checked) => handleUpdateDisplayOption("controls", checked)}
                        />
                        <Label htmlFor="controls">Show Controls</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="loop"
                          checked={displayOptions.loop}
                          onCheckedChange={(checked) => handleUpdateDisplayOption("loop", checked)}
                        />
                        <Label htmlFor="loop">Loop Video</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="muted"
                          checked={displayOptions.muted}
                          onCheckedChange={(checked) => handleUpdateDisplayOption("muted", checked)}
                        />
                        <Label htmlFor="muted">Muted by Default</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Badge</h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showBadge"
                          checked={displayOptions.showBadge}
                          onCheckedChange={(checked) => handleUpdateDisplayOption("showBadge", checked)}
                        />
                        <Label htmlFor="showBadge">Show Badge</Label>
                      </div>
                    </div>

                    {displayOptions.showBadge && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="badgeText">Badge Text</Label>
                          <Input
                            id="badgeText"
                            value={displayOptions.badgeText}
                            onChange={(e) => handleUpdateDisplayOption("badgeText", e.target.value)}
                            placeholder="e.g., NEW, SALE, 20% OFF"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="badgeColor">Badge Color</Label>
                          <Select
                            value={displayOptions.badgeColor}
                            onValueChange={(value) => handleUpdateDisplayOption("badgeColor", value)}
                          >
                            <SelectTrigger id="badgeColor">
                              <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bg-red-500">Red</SelectItem>
                              <SelectItem value="bg-blue-500">Blue</SelectItem>
                              <SelectItem value="bg-green-500">Green</SelectItem>
                              <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                              <SelectItem value="bg-purple-600">Purple</SelectItem>
                              <SelectItem value="bg-pink-500">Pink</SelectItem>
                              <SelectItem value="bg-orange-500">Orange</SelectItem>
                              <SelectItem value="bg-gray-800">Black</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button variant="outline" onClick={() => router.push("/admin/video-offers")}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Video Offer"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  {previewMode ? "Hide Controls" : "Show Controls"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video w-full overflow-hidden">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    poster={thumbnailUrl}
                    autoPlay={displayOptions.autoplay && !previewMode}
                    controls={displayOptions.controls || previewMode}
                    loop={displayOptions.loop}
                    muted={displayOptions.muted}
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center">
                      <Play className="mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500">No video selected</p>
                    </div>
                  </div>
                )}

                {/* Overlay with title and description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold">{title || "Video Offer Title"}</h3>
                  <p className="mt-1 text-sm text-gray-200">
                    {description || "Video offer description will appear here"}
                  </p>
                </div>

                {/* Badge */}
                {displayOptions.showBadge && (
                  <div
                    className={`absolute right-2 top-2 px-2 py-1 text-xs font-bold text-white ${displayOptions.badgeColor}`}
                  >
                    {displayOptions.badgeText}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Help & Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Video Format</h4>
                  <p className="text-gray-500">
                    For best results, use MP4 videos with H.264 encoding. Recommended resolution: 1920x1080 (16:9).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">File Size</h4>
                  <p className="text-gray-500">
                    Keep videos under 10MB for optimal performance. Compress larger videos before uploading.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Thumbnail</h4>
                  <p className="text-gray-500">
                    Use a clear, high-quality image that represents your video content. Recommended size: 1280x720.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Scheduling</h4>
                  <p className="text-gray-500">
                    Set start and end dates to automatically display and remove offers at specific times.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
