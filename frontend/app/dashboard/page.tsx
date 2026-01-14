"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FarmerDashboard } from "@/components/farmer-dashboard"
import { BuyerDashboard } from "@/components/buyer-dashboard"
import { useStore } from "@/lib/store-context"

export default function DashboardPage() {
  const { user, loading } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  if (loading || !user) {
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
        {user.user_type_id === 1 ? (
          <FarmerDashboard />
        ) : (
          <BuyerDashboard />
        )}
      </main>
      <Footer />
    </div>
  )
}
