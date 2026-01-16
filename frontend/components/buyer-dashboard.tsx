"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"
import { apiFetch } from "@/lib/api"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react"

type Order = {
  id: number
  user_id: number
  status: "pending" | "accepted" | "rejected" | "paid"
  total_price: string
}

export function BuyerDashboard() {
  const { user } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const res = await apiFetch("/orders")
      if (!res.ok) throw new Error("Failed to fetch orders")

      const allOrders = await res.json()
      const myOrders = allOrders.filter(
        (o: Order) => o.user_id === user?.id
      )

      setOrders(myOrders)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  const handlePay = async (orderId: number) => {
    try {
      const res = await apiFetch(`/orders/${orderId}/pay`, {
        method: "PUT",
      })

      if (!res.ok) throw new Error("Payment failed")

      fetchOrders()
    } catch (err) {
      alert("Payment failed")
    }
  }

  if (loading) return <p>Loading your orders...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const statusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-600 flex gap-1"><Clock className="h-4 w-4" /> Pending</span>
      case "accepted":
        return <span className="text-green-600 flex gap-1"><CheckCircle className="h-4 w-4" /> Accepted</span>
      case "paid":
        return <span className="text-blue-600 flex gap-1"><CreditCard className="h-4 w-4" /> Paid</span>
      case "rejected":
        return <span className="text-red-600 flex gap-1"><XCircle className="h-4 w-4" /> Rejected</span>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          My Orders
        </h2>

        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: ${order.total_price}
                  </p>
                  {statusBadge(order.status)}
                </div>

                {order.status === "accepted" && (
                  <Button onClick={() => handlePay(order.id)}>
                    Pay Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
