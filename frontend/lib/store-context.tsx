"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { apiFetch } from "@/lib/api"


export interface User {
  id: number
  name: string
  email: string
  user_type_id: number
}

interface StoreContextType {
  user: User | null
  loading: boolean

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>

  signUp: (data: {
    name: string
    email: string
    password: string
    user_type_id: number
  }) => Promise<{ success: boolean; error?: string }>

  logout: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)


export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiFetch("/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json()
        return { success: false, error: err.error || "Login failed" }
      }

      const data = await res.json()
      setUser(data)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const signUp = async (data: {
    name: string
    email: string
    password: string
    user_type_id: number
  }) => {
    try {
      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        return { success: false, error: err.error || "Sign up failed" }
      }

      const loginRes = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (loginRes.ok) {
        const userData = await loginRes.json()
        setUser(userData)
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    await apiFetch("/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <StoreContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return ctx
}
