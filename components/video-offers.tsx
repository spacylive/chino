"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { VideoOffer } from "@/types/video-offers"

interface VideoOffersProps {
  className?: string
}

export default function VideoOffers({ className }: VideoOffersProps) {
  const [videoOffers, setVideoOffers] = useState<VideoOffer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Obtener ofertas de video desde la API real
    const fetchVideoOffers = async () => {
      try {
        const res = await fetch("/api/offers")
        const offers = await res.json()
        // Filtrar solo las ofertas activas y vigentes
        const now = new Date()
        const activeOffers = offers.filter(
          (offer: any) => offer.isActive && new Date(offer.startDate) <= now && new Date(offer.endDate) >= now,
        )
        setVideoOffers(activeOffers)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching video offers:", error)
        setIsLoading(false)
      }
    }
    fetchVideoOffers()
  }, [])

  useEffect(() => {
    // Auto-advance carousel
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex === videoOffers.length - 1 ? 0 : prevIndex + 1))
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [videoOffers.length, isHovered])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videoOffers.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === videoOffers.length - 1 ? 0 : prevIndex + 1))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("w-full animate-pulse rounded-lg bg-gray-200", className)}>
        <div className="aspect-video w-full"></div>
      </div>
    )
  }

  if (videoOffers.length === 0) {
    return null
  }

  const currentOffer = videoOffers[currentIndex]

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg shadow-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden">
        <CardContent className="relative p-0">
          {/* Video */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video w-full overflow-hidden"
            >
              <video
                ref={videoRef}
                src={currentOffer.videoUrl}
                poster={currentOffer.thumbnailUrl}
                autoPlay={currentOffer.displayOptions.autoplay}
                controls={currentOffer.displayOptions.controls}
                loop={currentOffer.displayOptions.loop}
                muted={isMuted}
                playsInline
                className="h-[320px] w-full max-w-2xl mx-auto object-cover rounded-2xl shadow-md border border-gray-100 bg-black"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play/Pause overlay */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100"
                  onClick={togglePlay}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform hover:bg-white/30 hover:scale-110"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              )}

              {/* Overlay with title and description */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold md:text-2xl">{currentOffer.title}</h3>
                <p className="mt-2 text-sm text-gray-200 md:text-base">{currentOffer.description}</p>
              </motion.div>

              {/* Badge */}
              {currentOffer.displayOptions.showBadge && (
                <Badge
                  className={cn(
                    "absolute right-4 top-4 px-3 py-1 text-sm font-bold",
                    currentOffer.displayOptions.badgeColor,
                  )}
                >
                  {currentOffer.displayOptions.badgeText}
                </Badge>
              )}

              {/* Mute/Unmute button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              {/* Navigation buttons */}
              {videoOffers.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          {videoOffers.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
              {videoOffers.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 transition-all",
                    index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2",
                    "rounded-full",
                  )}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
