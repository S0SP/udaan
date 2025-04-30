import type React from "react"
import { ShopkeeperNavbar } from "@/components/shopkeeper/navbar"
import { ShopkeeperSidebar } from "@/components/shopkeeper/sidebar"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ShopkeeperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <ShopkeeperSidebar />
      <div className="flex-1 flex flex-col">
        <ShopkeeperNavbar />
        <main className="flex-1 p-6">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  )
}
