"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Header } from "@/components/header"
import { Leaf, Tractor, ShoppingBag } from "lucide-react"
import { useStore } from "@/lib/store-context"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userType, setUserType] = useState<"farmer" | "buyer">("buyer")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useStore()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const result = await signUp({ email, password, fullName, userType })

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "An error occurred")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">AgriConnect</span>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>Join AgriConnect as a farmer or buyer</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="farmer@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>I want to</Label>
                      <RadioGroup
                        value={userType}
                        onValueChange={(value) => setUserType(value as "farmer" | "buyer")}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="farmer" id="farmer" className="peer sr-only" />
                          <Label
                            htmlFor="farmer"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Tractor className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Sell Products</span>
                            <span className="text-xs text-muted-foreground">As a Farmer</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                          <Label
                            htmlFor="buyer"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <ShoppingBag className="mb-3 h-6 w-6" />
                            <span className="text-sm font-medium">Buy Products</span>
                            <span className="text-xs text-muted-foreground">As a Buyer</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="repeat-password">Confirm Password</Label>
                      <Input
                        id="repeat-password"
                        type="password"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary underline underline-offset-4">
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
