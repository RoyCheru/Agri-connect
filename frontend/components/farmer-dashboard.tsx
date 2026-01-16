"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"
import { apiFetch } from "@/lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Plus, Inbox } from "lucide-react"

/* =======================
   TYPES
======================= */

type UserProduct = {
  user_id: number
  product_id: number
  price: string
  stock_quantity: number
}

type Product = {
  id: number
  name: string
  description?: string
  base_price: string
}

type Order = {
  id: number
  user_id: number
  status: string
  total_price: string
}

type OrderItem = {
  order_id: number
  product_id: number
  quantity: number
  price: string
}

/* =======================
   COMPONENT
======================= */

export function FarmerDashboard() {
  const { user } = useStore()

  const [userProducts, setUserProducts] = useState<UserProduct[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  })

  /* =======================
     LOAD DATA
  ======================= */

  const loadData = async () => {
    if (!user) return

    try {
      const [upRes, pRes, oRes, oiRes] = await Promise.all([
        apiFetch("/user-products"),
        apiFetch("/products"),
        apiFetch("/orders"),
        apiFetch("/order-items"),
      ])

      if (upRes.ok) setUserProducts(await upRes.json())
      if (pRes.ok) setProducts(await pRes.json())
      if (oRes.ok) setOrders(await oRes.json())
      if (oiRes.ok) setOrderItems(await oiRes.json())
    } catch (err) {
      console.error("Failed to load farmer dashboard data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  /* =======================
     CREATE PRODUCT
  ======================= */

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setCreating(true)

    try {
      const productRes = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          base_price: Number(form.price),
        }),
      })

      if (!productRes.ok) throw new Error("Product creation failed")
      const product = await productRes.json()

      const userProductRes = await apiFetch("/user-products", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          price: Number(form.price),
          stock_quantity: Number(form.stock),
        }),
      })

      if (!userProductRes.ok) throw new Error("Listing creation failed")

      await loadData()
      setForm({ name: "", description: "", price: "", stock: "" })
    } catch (err) {
      console.error(err)
      alert("Failed to create product")
    } finally {
      setCreating(false)
    }
  }

  /* =======================
     ACCEPT / REJECT
  ======================= */

  const handleOrderAction = async (
    orderId: number,
    action: "accept" | "reject"
  ) => {
    setActionLoading(orderId)

    try {
      const res = await apiFetch(
        `/farmer-orders/${orderId}/${action}`,
        { method: "PUT" }
      )

      if (!res.ok) throw new Error("Action failed")

      await loadData()
    } catch (err) {
      console.error(err)
      alert("Failed to update order")
    } finally {
      setActionLoading(null)
    }
  }

  /* =======================
     DERIVED DATA
  ======================= */

  if (loading) return <p>Loading farmer dashboard...</p>

  const myListings = userProducts.filter(
    (up) => up.user_id === user?.id
  )

  const myProductIds = new Set(myListings.map((up) => up.product_id))

  const myOrderItems = orderItems.filter((oi) =>
    myProductIds.has(oi.product_id)
  )

  const incomingOrders = orders.filter((order) =>
    myOrderItems.some((oi) => oi.order_id === order.id)
  )

  const productMap = new Map(products.map((p) => [p.id, p]))

  /* =======================
     UI
  ======================= */

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* CREATE PRODUCT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            List a New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProduct} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Product Name</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button disabled={creating}>
                {creating ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* MY LISTINGS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          My Listings
        </h2>

        {myListings.length === 0 ? (
          <p>No products listed yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myListings.map((up) => {
              const product = productMap.get(up.product_id)
              return (
                <Card key={up.product_id}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold">
                      {product?.name || "Unknown"}
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

      {/* INCOMING ORDERS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Incoming Orders
        </h2>

        {incomingOrders.length === 0 ? (
          <p>No incoming orders yet.</p>
        ) : (
          <div className="space-y-4">
            {incomingOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold">Order #{order.id}</p>
                  <p>Status: {order.status}</p>

                  {myOrderItems
                    .filter((oi) => oi.order_id === order.id)
                    .map((oi) => {
                      const product = productMap.get(oi.product_id)
                      return (
                        <div key={oi.product_id} className="text-sm ml-2">
                          • {product?.name} — Qty: {oi.quantity}
                        </div>
                      )
                    })}

                  {order.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        disabled={actionLoading === order.id}
                        onClick={() => handleOrderAction(order.id, "accept")}
                      >
                        Accept
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === order.id}
                        onClick={() => handleOrderAction(order.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
