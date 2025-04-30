import type React from "react"
import { CustomerNavbar } from "@/components/customer/navbar"
import { CustomerFooter } from "@/components/customer/footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
      <CustomerNavbar />
      <main className="flex-grow container mx-auto px-4 py-4">
        <Breadcrumb />
        {children}
      </main>
      <CustomerFooter />
    </div>
  )
}
