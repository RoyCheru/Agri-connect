"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"

export function BuyerDashboard() {
  const { user, orders } = useStore()

  // Filter orders for this buyer
  const buyerOrders = orders.filter((o) => o.buyerId === user?.id)

  const pendingOrders = buyerOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length
  const shippedOrders = buyerOrders.filter((o) => o.status === "shipped").length
  const deliveredOrders = buyerOrders.filter((o) => o.status === "delivered").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyerOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shippedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <Button asChild>
          <Link href="/marketplace">Browse Marketplace</Link>
        </Button>
      </div>

      {buyerOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start shopping from local farmers</p>
            <Button asChild>
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {buyerOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</span>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                              ? "secondary"
                              : order.status === "confirmed"
                                ? "outline"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.productImage || `/placeholder.svg?height=60&width=60&query=${item.productName}`}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ${item.priceAtPurchase.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Delivery: {order.deliveryAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
