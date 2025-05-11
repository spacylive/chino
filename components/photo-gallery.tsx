"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Move } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { PhotoItem, LayoutConfig, HolderConfig } from "@/app/page"

interface PhotoGalleryProps {
  photos: PhotoItem[]
  layout: LayoutConfig
  onRemovePhoto: (id: string) => void
}

export default function PhotoGallery({ photos, layout, onRemovePhoto }: PhotoGalleryProps) {
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null)
  const [photoPositions, setPhotoPositions] = useState<Record<string, string>>({})
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null)

  // Map photos to holders based on photoPositions or default order
  const getPhotoForHolder = (holderId: string, index: number) => {
    // Check if a photo is explicitly assigned to this holder
    const assignedPhotoId = Object.entries(photoPositions).find(
      ([photoId, holderAssigned]) => holderAssigned === holderId,
    )?.[0]

    if (assignedPhotoId) {
      return photos.find((photo) => photo.id === assignedPhotoId) || null
    }

    // Otherwise, assign photos in order
    return index < photos.length ? photos[index] : null
  }

  const handleDragStart = (photoId: string) => {
    setDraggedPhoto(photoId)
  }

  const handleDragOver = (e: React.DragEvent, holderId: string) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, holderId: string) => {
    e.preventDefault()
    if (draggedPhoto) {
      setPhotoPositions((prev) => ({
        ...prev,
        [draggedPhoto]: holderId,
      }))
      setDraggedPhoto(null)
    }
  }

  const confirmDelete = (photoId: string) => {
    setDeletePhotoId(photoId)
  }

  const handleDeleteConfirmed = () => {
    if (deletePhotoId) {
      onRemovePhoto(deletePhotoId)
      // Also remove from positions mapping
      setPhotoPositions((prev) => {
        const newPositions = { ...prev }
        delete newPositions[deletePhotoId]
        return newPositions
      })
      setDeletePhotoId(null)
    }
  }

  const getHolderStyles = (holder: HolderConfig) => {
    return {
      width: `${holder.width}%`,
      height: `${holder.height}px`,
      borderWidth: `${holder.borderWidth}px`,
      borderColor: holder.borderColor,
      borderRadius: `${holder.borderRadius}px`,
      padding: `${holder.padding}px`,
      backgroundColor: holder.backgroundColor,
      boxShadow:
        holder.shadow === "none"
          ? "none"
          : holder.shadow === "sm"
            ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            : holder.shadow === "md"
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : holder.shadow === "lg"
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }
  }

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
          gap: `${layout.gap}px`,
        }}
      >
        {layout.holders.map((holder, index) => {
          const photo = getPhotoForHolder(holder.id, index)

          return (
            <div
              key={holder.id}
              className="relative"
              style={getHolderStyles(holder)}
              onDragOver={(e) => handleDragOver(e, holder.id)}
              onDrop={(e) => handleDrop(e, holder.id)}
            >
              {photo ? (
                <div className="group relative h-full w-full">
                  <img
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                    draggable
                    onDragStart={() => handleDragStart(photo.id)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                        onDragStart={(e) => e.stopPropagation()}
                      >
                        <Move className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full"
                        onClick={() => confirmDelete(photo.id)}
                        onDragStart={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                  <p className="text-sm">Drop photo here</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AlertDialog open={!!deletePhotoId} onOpenChange={(open) => !open && setDeletePhotoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the photo from your gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
