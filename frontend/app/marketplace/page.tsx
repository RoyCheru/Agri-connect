"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketplaceGrid } from "@/components/marketplace-grid"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || undefined
  const search = searchParams.get("search") || undefined

  return <MarketplaceGrid initialCategory={category} initialSearch={search} />
}

export default function MarketplacePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <MarketplaceContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
