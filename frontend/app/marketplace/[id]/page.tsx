"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"
import { useStore } from "@/lib/store-context"

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { products } = useStore()

  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ProductDetails product={product} />
      </main>
      <Footer />
    </div>
  )
}
