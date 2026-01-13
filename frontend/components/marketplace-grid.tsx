"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "meat", label: "Meat" },
  { value: "poultry", label: "Poultry" },
  { value: "other", label: "Other" },
]

export function MarketplaceGrid({
  initialCategory,
  initialSearch,
}: {
  initialCategory?: string
  initialSearch?: string
}) {
  const [search, setSearch] = useState(initialSearch || "")
  const [category, setCategory] = useState(initialCategory || "all")
  const router = useRouter()
  const { products } = useStore()

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      const isAvailable = product.isAvailable && product.quantityAvailable > 0
      return matchesCategory && matchesSearch && isAvailable
    })
  }, [products, category, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category && category !== "all") params.set("category", category)
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (value && value !== "all") params.set("category", value)
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">Browse fresh produce from local farmers</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Search</Button>
      </form>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/marketplace/${product.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square relative rounded-t-lg overflow-hidden">
                    <img
                      src={
                        product.imageUrl || `/placeholder.svg?height=300&width=300&query=${product.name} fresh produce`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description || "Fresh from the farm"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ${product.price}/{product.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">{product.quantityAvailable} left</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      by {product.farmer?.farmName || product.farmer?.fullName || "Local Farmer"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
