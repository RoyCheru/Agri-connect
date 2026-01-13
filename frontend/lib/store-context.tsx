"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Types
export interface User {
  id: string
  email: string
  fullName: string
  userType: "farmer" | "buyer"
  phone?: string
  address?: string
  farmName?: string
  farmDescription?: string
}

export interface Product {
  id: string
  farmerId: string
  name: string
  description: string
  category: string
  price: number
  unit: string
  quantityAvailable: number
  imageUrl?: string
  isAvailable: boolean
  createdAt: string
  farmer: {
    id: string
    fullName: string
    farmName?: string
    address?: string
  }
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  quantity: number
  priceAtPurchase: number
  farmerId: string
}

export interface Order {
  id: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  items: OrderItem[]
  totalAmount: number
  deliveryAddress: string
  notes?: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

interface StoreContextType {
  // Auth
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (data: { email: string; password: string; fullName: string; userType: "farmer" | "buyer" }) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => void

  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "farmerId" | "createdAt" | "farmer">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Orders
  orders: Order[]
  placeOrder: (
    productId: string,
    quantity: number,
    deliveryAddress: string,
    notes?: string,
  ) => Promise<{ success: boolean; error?: string }>
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Mock initial products
const initialProducts: Product[] = [
  {
    id: "1",
    farmerId: "farmer-1",
    name: "Fresh Organic Tomatoes",
    description: "Vine-ripened tomatoes grown without pesticides. Perfect for salads and cooking.",
    category: "vegetables",
    price: 4.99,
    unit: "kg",
    quantityAvailable: 50,
    imageUrl: "/fresh-organic-tomatoes.png",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-1", fullName: "John Smith", farmName: "Green Valley Farm", address: "123 Farm Road" },
  },
  {
    id: "2",
    farmerId: "farmer-1",
    name: "Farm Fresh Eggs",
    description: "Free-range eggs from happy hens. Rich in flavor and nutrients.",
    category: "dairy",
    price: 6.99,
    unit: "dozen",
    quantityAvailable: 30,
    imageUrl: "/farm-fresh-eggs-basket.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-1", fullName: "John Smith", farmName: "Green Valley Farm", address: "123 Farm Road" },
  },
  {
    id: "3",
    farmerId: "farmer-2",
    name: "Sweet Corn",
    description: "Freshly harvested sweet corn, perfect for grilling or boiling.",
    category: "vegetables",
    price: 1.99,
    unit: "piece",
    quantityAvailable: 100,
    imageUrl: "/fresh-sweet-corn-cobs.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-2", fullName: "Maria Garcia", farmName: "Sunrise Acres", address: "456 Country Lane" },
  },
  {
    id: "4",
    farmerId: "farmer-2",
    name: "Organic Apples",
    description: "Crisp and delicious apples straight from the orchard.",
    category: "fruits",
    price: 3.49,
    unit: "kg",
    quantityAvailable: 75,
    imageUrl: "/organic-red-apples-orchard.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-2", fullName: "Maria Garcia", farmName: "Sunrise Acres", address: "456 Country Lane" },
  },
  {
    id: "5",
    farmerId: "farmer-1",
    name: "Fresh Milk",
    description: "Creamy whole milk from grass-fed cows. Pasteurized and delicious.",
    category: "dairy",
    price: 4.49,
    unit: "liter",
    quantityAvailable: 40,
    imageUrl: "/fresh-milk-bottle-farm.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-1", fullName: "John Smith", farmName: "Green Valley Farm", address: "123 Farm Road" },
  },
  {
    id: "6",
    farmerId: "farmer-2",
    name: "Organic Carrots",
    description: "Sweet and crunchy carrots, perfect for snacking or cooking.",
    category: "vegetables",
    price: 2.99,
    unit: "bunch",
    quantityAvailable: 60,
    imageUrl: "/organic-carrots-bunch-fresh.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-2", fullName: "Maria Garcia", farmName: "Sunrise Acres", address: "456 Country Lane" },
  },
  {
    id: "7",
    farmerId: "farmer-1",
    name: "Fresh Strawberries",
    description: "Sweet, juicy strawberries picked at peak ripeness.",
    category: "fruits",
    price: 5.99,
    unit: "kg",
    quantityAvailable: 25,
    imageUrl: "/fresh-strawberries-basket.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-1", fullName: "John Smith", farmName: "Green Valley Farm", address: "123 Farm Road" },
  },
  {
    id: "8",
    farmerId: "farmer-2",
    name: "Whole Wheat Flour",
    description: "Stone-ground whole wheat flour, perfect for baking.",
    category: "grains",
    price: 3.99,
    unit: "kg",
    quantityAvailable: 45,
    imageUrl: "/whole-wheat-flour-bag.jpg",
    isAvailable: true,
    createdAt: new Date().toISOString(),
    farmer: { id: "farmer-2", fullName: "Maria Garcia", farmName: "Sunrise Acres", address: "456 Country Lane" },
  },
]

// Mock users database (email -> user data with password)
const mockUsersDb: Record<string, { user: User; password: string }> = {}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("agriconnect-user")
      const savedProducts = localStorage.getItem("agriconnect-products")
      const savedOrders = localStorage.getItem("agriconnect-orders")
      const savedUsers = localStorage.getItem("agriconnect-users-db")

      if (savedUser) setUser(JSON.parse(savedUser))
      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedOrders) setOrders(JSON.parse(savedOrders))
      if (savedUsers) Object.assign(mockUsersDb, JSON.parse(savedUsers))

      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("agriconnect-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("agriconnect-user")
      }
    }
  }, [user, isLoaded])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("agriconnect-products", JSON.stringify(products))
    }
  }, [products, isLoaded])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("agriconnect-orders", JSON.stringify(orders))
    }
  }, [orders, isLoaded])

  const saveUsersDb = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("agriconnect-users-db", JSON.stringify(mockUsersDb))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const userRecord = mockUsersDb[email.toLowerCase()]
    if (!userRecord) {
      return { success: false, error: "User not found. Please sign up first." }
    }
    if (userRecord.password !== password) {
      return { success: false, error: "Invalid password." }
    }
    setUser(userRecord.user)
    return { success: true }
  }

  const signUp = async (data: {
    email: string
    password: string
    fullName: string
    userType: "farmer" | "buyer"
  }): Promise<{ success: boolean; error?: string }> => {
    const emailLower = data.email.toLowerCase()
    if (mockUsersDb[emailLower]) {
      return { success: false, error: "An account with this email already exists." }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: emailLower,
      fullName: data.fullName,
      userType: data.userType,
    }

    mockUsersDb[emailLower] = { user: newUser, password: data.password }
    saveUsersDb()
    setUser(newUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const addProduct = (product: Omit<Product, "id" | "farmerId" | "createdAt" | "farmer">) => {
    if (!user || user.userType !== "farmer") return

    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      farmerId: user.id,
      createdAt: new Date().toISOString(),
      farmer: {
        id: user.id,
        fullName: user.fullName,
        farmName: user.farmName,
        address: user.address,
      },
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const placeOrder = async (
    productId: string,
    quantity: number,
    deliveryAddress: string,
    notes?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.userType !== "buyer") {
      return { success: false, error: "Only buyers can place orders" }
    }

    const product = products.find((p) => p.id === productId)
    if (!product) {
      return { success: false, error: "Product not found" }
    }

    if (product.quantityAvailable < quantity) {
      return { success: false, error: "Not enough stock available" }
    }

    const orderItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      quantity,
      priceAtPurchase: product.price,
      farmerId: product.farmerId,
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      buyerId: user.id,
      buyerName: user.fullName,
      buyerEmail: user.email,
      items: [orderItem],
      totalAmount: product.price * quantity,
      deliveryAddress,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])
    updateProduct(productId, { quantityAvailable: product.quantityAvailable - quantity })

    return { success: true }
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        signUp,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
