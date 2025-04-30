import type React from "react"
import { DeliveryNavbar } from "@/components/delivery/navbar"
import { DeliverySidebar } from "@/components/delivery/sidebar"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <DeliverySidebar />
      <div className="flex-1 flex flex-col">
        <DeliveryNavbar />
        <main className="flex-1 p-6">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  )
}
