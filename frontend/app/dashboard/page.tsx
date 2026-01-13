"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FarmerDashboard } from "@/components/farmer-dashboard"
import { BuyerDashboard } from "@/components/buyer-dashboard"
import { useStore } from "@/lib/store-context"

export default function DashboardPage() {
  const { user } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {user.userType === "farmer" ? <FarmerDashboard /> : <BuyerDashboard />}
      </main>
      <Footer />
    </div>
  )
}
