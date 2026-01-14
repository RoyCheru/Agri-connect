"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Clock, Package, CheckCircle } from "lucide-react"

type Order = {
  id: number
  user_id: number
  status: string
  total_price: string
  created_at?: string
}

export function BuyerDashboard() {
  const { user } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

const fetchOrders = async () => {
  try {
    const res = await apiFetch("/orders")
    if (!res.ok) throw new Error("Failed to fetch orders")

    const allOrders = await res.json()
    const myOrders = allOrders.filter(
      (o: Order) => o.user_id === user.id
    )

    setOrders(myOrders)
  } catch (err: any) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

fetchOrders()
  }, [user])

  if (loading) return <p>Loading your orders...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const pending = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  ).length
  const shipped = orders.filter((o) => o.status === "shipped").length
  const delivered = orders.filter((o) => o.status === "delivered").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

  <div className="grid gap-4 md:grid-cols-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Total Orders</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {orders.length}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Pending</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {pending}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Shipped</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {shipped}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Delivered</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {delivered}
      </CardContent>
    </Card>
  </div>

  {orders.length === 0 && <p>You have no orders yet.</p>}
</div>
  )
}

