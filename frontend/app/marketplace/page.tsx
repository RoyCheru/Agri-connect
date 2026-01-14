"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { useStore } from "@/lib/store-context"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Product = {
  id: number
  name: string
  description?: string
  base_price: string
}

type UserProduct = {
  user_id: number
  product_id: number
  price: string
  stock_quantity: number
}

export default function MarketplacePage() {
  const { user } = useStore()

  const [products, setProducts] = useState<Product[]>([])
  const [userProducts, setUserProducts] = useState<UserProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState<number | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, upRes] = await Promise.all([
          apiFetch("/products"),
          apiFetch("/user-products"),
        ])

    if (pRes.ok) setProducts(await pRes.json())
    if (upRes.ok) setUserProducts(await upRes.json())
  } catch (err) {
    console.error("Failed to load marketplace", err)
  } finally {
    setLoading(false)
  }
}

load()
  }, [])

  const productMap = new Map(products.map((p) => [p.id, p]))

  const handleOrder = async (productId: number) => {
    if (!user) {
      alert("Please log in to place an order")
      return
    }

const quantity = quantities[productId] || 1
setOrdering(productId)

try {
  const res = await apiFetch("/orders-with-items", {
    method: "POST",
    body: JSON.stringify({
      items: [{ product_id: productId, quantity }],
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Order failed")
  }

  alert("Order placed successfully!")

  const upRes = await apiFetch("/user-products")
  if (upRes.ok) setUserProducts(await upRes.json())
} catch (err: any) {
  alert(err.message)
} finally {
  setOrdering(null)
}
  }

  if (loading) return <p>Loading marketplace...</p>

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Marketplace</h1>

  {userProducts.length === 0 ? (
    <p>No products available yet.</p>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {userProducts.map((up) => {
        const product = productMap.get(up.product_id)
        if (!product || up.stock_quantity <= 0) return null

        return (
          <Card key={`${up.user_id}-${up.product_id}`}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {product.description || "No description"}
              </p>

              <p className="font-semibold">
                ${up.price}
              </p>

              <p className="text-sm">
                Stock: {up.stock_quantity}
              </p>

              <Input
                type="number"
                min={1}
                max={up.stock_quantity}
                value={quantities[up.product_id] || 1}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [up.product_id]: Number(e.target.value),
                  })
                }
              />

              <Button
                className="w-full"
                disabled={ordering === up.product_id}
                onClick={() => handleOrder(up.product_id)}
              >
                {ordering === up.product_id
                  ? "Ordering..."
                  : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )}
</div>
  )
}

