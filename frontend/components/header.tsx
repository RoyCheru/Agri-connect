"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, Leaf, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useStore()
  const router = useRouter()

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">AgriConnect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              {user.userType === "buyer" && (
                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </Link>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-1" />
                    {user.fullName || user.email.split("@")[0]}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link href="/marketplace" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
            <Link href="/about" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
