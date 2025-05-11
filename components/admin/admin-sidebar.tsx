"use client"

import Link from "next/link"
import { BarChart3, Home, LogOut, MessageSquare, Package, Settings, ShoppingCart, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "messenger", label: "Messenger", icon: MessageSquare, shortcut: "Ctrl+Space" },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="hidden w-64 flex-col bg-red-800 text-white lg:flex">
      <div className="flex h-20 items-center border-b border-red-700 px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-yellow-500">
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-red-800">龙</div>
          </div>
          <span className="text-lg font-bold">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeTab === item.id ? "bg-red-700 text-white" : "text-red-100 hover:bg-red-700/50 hover:text-white",
              )}
            >
              <div className="flex items-center">
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </div>
              {item.shortcut && <span className="text-xs text-red-300">{item.shortcut}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-red-700 p-3">
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-100 transition-colors hover:bg-red-700/50 hover:text-white">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
