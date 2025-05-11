"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter()
  const { toast } = useToast()

  // If the modal is open, redirect to the login page
  if (isOpen) {
    toast({
      title: "Admin Login",
      description: "Redirecting to admin login page",
    })

    // Close the modal
    onClose()

    // Redirect to login page
    router.push("/login")

    return null
  }

  return null
}
