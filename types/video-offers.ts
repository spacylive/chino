export interface VideoDisplayOptions {
  autoplay: boolean
  controls: boolean
  loop: boolean
  muted: boolean
  showBadge: boolean
  badgeText: string
  badgeColor: string
}

export interface VideoOffer {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  isActive: boolean
  startDate: string
  endDate: string
  displayOptions: VideoDisplayOptions
  createdAt: string
  updatedAt: string
}
