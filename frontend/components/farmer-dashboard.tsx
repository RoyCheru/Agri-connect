"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, ShoppingCart } from "lucide-react"

type UserProduct = {
  user_id: number
  product_id: number
  price: string
  stock_quantity: number
}

type Product = {
  id: number
  name: string
  base_price: string
}

type Order = {
  id: number
  user_id: number
  status: string
  total_price: string
}

export function FarmerDashboard() {
  const { user } = useStore()

  const [userProducts, setUserProducts] = useState<UserProduct[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

const loadData = async () => {
  try {
    const [upRes, pRes, oRes] = await Promise.all([
      apiFetch("/user-products"),
      apiFetch("/products"),
      apiFetch("/orders"),
    ])

    if (upRes.ok) setUserProducts(await upRes.json())
    if (pRes.ok) setProducts(await pRes.json())
    if (oRes.ok) setOrders(await oRes.json())
  } catch (err) {
    console.error("Failed to load farmer dashboard", err)
  } finally {
    setLoading(false)
  }
}

loadData()
  }, [user])

  if (loading) {
    return <p>Loading farmer dashboard...</p>
  }

  const myProducts = userProducts.filter(
    (up) => up.user_id === user?.id
  )

  const productMap = new Map(products.map((p) => [p.id, p]))

  const totalRevenue = orders
    .filter((o) => o.user_id === user?.id)
    .reduce((sum, o) => sum + Number(o.total_price), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

  <div className="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">My Products</CardTitle>
        <Package className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{myProducts.length}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">Orders</CardTitle>
        <ShoppingCart className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {orders.filter((o) => o.user_id === user?.id).length}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">Revenue</CardTitle>
        <DollarSign className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${totalRevenue.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  </div>

  <div>
    <h2 className="text-xl font-semibold mb-4">My Listings</h2>

    {myProducts.length === 0 ? (
      <p>No products listed yet.</p>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myProducts.map((up) => {
          const product = productMap.get(up.product_id)

          return (
            <Card key={up.product_id}>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">
                  {product?.name || "Unknown product"}
                </h3>
                <p>Price: ${up.price}</p>
                <p>Stock: {up.stock_quantity}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )}
  </div>
</div>
  )
}