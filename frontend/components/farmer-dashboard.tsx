"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, DollarSign, ShoppingCart, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useStore, type Product } from "@/lib/store-context"

const categories = ["vegetables", "fruits", "dairy", "grains", "meat", "poultry", "other"]
const units = ["kg", "lb", "dozen", "piece", "bunch", "liter", "gallon"]

export function FarmerDashboard() {
  const { user, products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore()
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "",
    quantityAvailable: "",
    imageUrl: "",
  })

  // Filter products and orders for this farmer
  const farmerProducts = products.filter((p) => p.farmerId === user?.id)
  const farmerOrders = orders.filter((o) => o.items.some((item) => item.farmerId === user?.id))

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    addProduct({
      name: newProduct.name,
      description: newProduct.description || "",
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      unit: newProduct.unit,
      quantityAvailable: Number.parseInt(newProduct.quantityAvailable),
      imageUrl: newProduct.imageUrl || undefined,
      isAvailable: true,
    })

    setIsAddingProduct(false)
    setNewProduct({
      name: "",
      description: "",
      category: "",
      price: "",
      unit: "",
      quantityAvailable: "",
      imageUrl: "",
    })
    setIsLoading(false)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    setIsLoading(true)

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      category: editingProduct.category,
      price: editingProduct.price,
      unit: editingProduct.unit,
      quantityAvailable: editingProduct.quantityAvailable,
      imageUrl: editingProduct.imageUrl,
      isAvailable: editingProduct.isAvailable,
    })

    setEditingProduct(null)
    setIsLoading(false)
  }

  const handleDeleteProduct = (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    deleteProduct(productId)
  }

  const handleUpdateOrderStatus = (orderId: string, status: "pending" | "confirmed" | "shipped" | "delivered") => {
    updateOrderStatus(orderId, status)
  }

  const totalRevenue = farmerOrders.reduce((sum, order) => {
    const farmerItems = order.items.filter((item) => item.farmerId === user?.id)
    return sum + farmerItems.reduce((itemSum, item) => itemSum + item.priceAtPurchase * item.quantity, 0)
  }, 0)

  const activeProducts = farmerProducts.filter((p) => p.isAvailable).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerProducts.length}</div>
            <p className="text-xs text-muted-foreground">{activeProducts} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerOrders.length}</div>
            <p className="text-xs text-muted-foreground">orders received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">from all orders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Add a new product to your marketplace listing</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={newProduct.unit}
                        onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={newProduct.quantityAvailable}
                        onChange={(e) => setNewProduct({ ...newProduct, quantityAvailable: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL (optional)</Label>
                    <Input
                      id="image"
                      type="url"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Product"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {farmerProducts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No products yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by adding your first product to the marketplace
                </p>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {farmerProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-4">
                      <img
                        src={
                          product.imageUrl ||
                          `/placeholder.svg?height=200&width=300&query=${product.name || "/placeholder.svg"} fresh produce`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {!product.isAvailable && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="secondary">Unavailable</Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${product.price}/{product.unit}
                        </span>
                        <span className="text-sm text-muted-foreground">{product.quantityAvailable} available</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Dialog
                          open={editingProduct?.id === product.id}
                          onOpenChange={(open) => !open && setEditingProduct(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            {editingProduct && (
                              <form onSubmit={handleUpdateProduct} className="space-y-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Product Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editingProduct.description || ""}
                                    onChange={(e) =>
                                      setEditingProduct({ ...editingProduct, description: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-price">Price ($)</Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={editingProduct.price}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          price: Number.parseFloat(e.target.value),
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-quantity">Quantity</Label>
                                    <Input
                                      id="edit-quantity"
                                      type="number"
                                      min="0"
                                      value={editingProduct.quantityAvailable}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          quantityAvailable: Number.parseInt(e.target.value),
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="edit-available"
                                    checked={editingProduct.isAvailable}
                                    onChange={(e) =>
                                      setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })
                                    }
                                    className="rounded border-input"
                                  />
                                  <Label htmlFor="edit-available">Available for sale</Label>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <h2 className="text-xl font-semibold">Incoming Orders</h2>
          {farmerOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-sm text-muted-foreground">Orders from buyers will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {farmerOrders.map((order) => (
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
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {order.items
                            .filter((item) => item.farmerId === user?.id)
                            .map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img
                                  src={
                                    item.productImage || `/placeholder.svg?height=60&width=60&query=${item.productName}`
                                  }
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
                        <p className="text-sm text-muted-foreground">Buyer: {order.buyerName}</p>
                        <p className="text-sm text-muted-foreground">Delivery: {order.deliveryAddress}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleUpdateOrderStatus(
                              order.id,
                              value as "pending" | "confirmed" | "shipped" | "delivered",
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
