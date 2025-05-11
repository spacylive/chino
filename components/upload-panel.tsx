"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PhotoItem } from "@/app/page"

interface UploadPanelProps {
  onAddPhoto: (photo: PhotoItem) => void
}

export default function UploadPanel({ onAddPhoto }: UploadPanelProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (validFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload image files only (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPreviewImages((prev) => [...prev, ...newPreviews])
  }

  const removePreview = (index: number) => {
    setPreviewImages((prev) => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const uploadImages = () => {
    if (previewImages.length === 0) {
      toast({
        title: "No Images",
        description: "Please select images to upload first",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload to a server here
    // For this demo, we'll just add them to the gallery
    previewImages.forEach(({ preview }) => {
      const newPhoto: PhotoItem = {
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: preview,
        alt: "Uploaded photo",
      }
      onAddPhoto(newPhoto)
    })

    // Clear previews
    setPreviewImages([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-medium">Drag and drop your images here</p>
            <p className="mb-4 text-sm text-gray-500">or click to browse files</p>
            <Button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700">
              <Upload className="mr-2 h-4 w-4" /> Select Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>

      {previewImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Selected Images ({previewImages.length})</h3>
            <Button onClick={uploadImages} className="bg-purple-600 hover:bg-purple-700">
              <Upload className="mr-2 h-4 w-4" /> Add to Gallery
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {previewImages.map((preview, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                <img
                  src={preview.preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removePreview(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
