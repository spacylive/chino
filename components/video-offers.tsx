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
  const [isMuted, setIsMuted] = useState(true) // Iniciamos en silencio por política de autoplay
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<string>("16/9")
  const [videoError, setVideoError] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [canAutoplay, setCanAutoplay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentOffer = videoOffers[currentIndex]

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
        // Mezclar el orden de los videos de forma aleatoria
        for (let i = activeOffers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[activeOffers[i], activeOffers[j]] = [activeOffers[j], activeOffers[i]]
        }
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
    if (!isHovered && videoOffers.length > 0 && videoRef.current) {
      const video = videoRef.current;
      const handleEnded = () => {
        setCurrentIndex((prevIndex: number) => (prevIndex === videoOffers.length - 1 ? 0 : prevIndex + 1));
      };
      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [isHovered, videoOffers.length, currentIndex]);

  useEffect(() => {
    if (!currentOffer) return;
    if (videoRef.current) {
      const handleLoadedMetadata = () => {
        const video = videoRef.current
        if (video && video.videoWidth && video.videoHeight) {
          const ratio = video.videoWidth / video.videoHeight
          if (ratio < 1) {
            setAspectRatio("9/16") // vertical
          } else {
            setAspectRatio("16/9") // horizontal
          }
        }
      }
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
      return () => videoRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [currentOffer?.videoUrl])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 1;
    }
  }, [currentOffer?.videoUrl, isMuted]);

  useEffect(() => {
    setVideoError(false)
  }, [currentOffer?.videoUrl])

  useEffect(() => {
    // Verificar si podemos hacer autoplay con sonido
    const checkAutoplay = async () => {
      try {
        if (videoRef.current) {
          // Intentar reproducir sin sonido primero
          await videoRef.current.play()
          setCanAutoplay(true)
          setIsPlaying(true)
        }
      } catch (error) {
        console.log('Autoplay not allowed:', error)
        setCanAutoplay(false)
        setIsPlaying(false)
      }
    }

    if (videoRef.current && currentOffer) {
      checkAutoplay()
    }
  }, [currentOffer])

  // Efecto para manejar el cambio de video
  useEffect(() => {
    if (videoRef.current && currentOffer) {
      if (canAutoplay) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [currentOffer, canAutoplay])

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
              className={cn(
                "relative w-full overflow-hidden flex justify-center items-center bg-black",
                aspectRatio === "9/16"
                  ? "aspect-[9/16] max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
                  : "aspect-video max-w-3xl mx-auto"
              )}
            >
              {/* Mostrar error si el video falla */}
              {videoError ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
                  <span className="text-red-500 text-lg font-semibold mb-2">No se pudo cargar el video</span>
                  <span className="text-gray-400 text-sm">Intenta con otro video o recarga la página.</span>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={currentOffer.videoUrl}
                  poster={currentOffer.thumbnailUrl}
                  autoPlay={currentOffer.displayOptions.autoplay}
                  controls={false}
                  loop={currentOffer.displayOptions.loop}
                  muted={isMuted}
                  playsInline
                  className={cn(
                    aspectRatio === "9/16"
                      ? "h-full w-full object-contain bg-black rounded-2xl shadow-2xl border-4 border-white"
                      : "h-[480px] w-full max-w-3xl mx-auto object-cover rounded-2xl shadow-2xl border-4 border-white bg-black"
                  )}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => setVideoError(true)}
                  onLoadedData={() => setShowControls(true)}
                />
              )}

              {/* Controles personalizados pequeños */}
              {!videoError && showControls && (
                <div className="absolute bottom-2 left-2 flex gap-2 items-center bg-black/40 rounded-full px-2 py-1 shadow-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-white hover:bg-black/60"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    <Play className={cn("h-4 w-4", isPlaying ? "opacity-30" : "")}/>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-white hover:bg-black/60"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  {videoOffers.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-white hover:bg-black/60"
                        onClick={handlePrevious}
                        aria-label="Anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-white hover:bg-black/60"
                        onClick={handleNext}
                        aria-label="Siguiente"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Play/Pause overlay */}
              {!isPlaying && !videoError && (
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
