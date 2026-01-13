"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Minus, Plus, ShoppingCart, MapPin, User } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useStore, type Product } from "@/lib/store-context"

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [isOrdering, setIsOrdering] = useState(false)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const router = useRouter()
  const { user, placeOrder } = useStore()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.quantityAvailable) {
      setQuantity(newQuantity)
    }
  }

  const handleOrder = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.userType !== "buyer") {
      alert("Only buyers can place orders")
      return
    }

    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address")
      return
    }

    setIsOrdering(true)

    const result = await placeOrder(product.id, quantity, deliveryAddress, notes)

    if (result.success) {
      setShowOrderDialog(false)
      router.push("/dashboard")
    } else {
      alert(result.error || "Failed to place order. Please try again.")
    }

    setIsOrdering(false)
  }

  const totalPrice = product.price * quantity

  return (
    <div className="space-y-8">
      <Link
        href="/marketplace"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square relative rounded-xl overflow-hidden bg-muted">
            <img
              src={product.imageUrl || `/placeholder.svg?height=600&width=600&query=${product.name} fresh produce farm`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">
              {product.description || "Fresh from the farm, directly to your table."}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">${product.price}</span>
            <span className="text-muted-foreground">per {product.unit}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {product.quantityAvailable} {product.unit}s available
            </span>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label>Quantity:</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantityAvailable}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-muted-foreground">{product.unit}s</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-medium">Total:</span>
              <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {user ? "Place Order" : "Login to Order"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete Your Order</DialogTitle>
                  <DialogDescription>Review your order and provide delivery details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <img
                      src={product.imageUrl || `/placeholder.svg?height=80&width=80&query=${product.name}`}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {quantity} {product.unit}s x ${product.price}
                      </p>
                      <p className="font-bold text-primary">${totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full delivery address"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Order Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions?"
                    />
                  </div>

                  <Button onClick={handleOrder} className="w-full" disabled={isOrdering}>
                    {isOrdering ? "Placing Order..." : `Confirm Order - $${totalPrice.toFixed(2)}`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{product.farmer?.farmName || product.farmer?.fullName || "Local Farmer"}</span>
              </div>
              {product.farmer?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.farmer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
