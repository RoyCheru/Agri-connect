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

    const result = await signUp({
      name: fullName,
      email,
      password,
      user_type_id: userType === "farmer" ? 1 : 2,
    })

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Sign up failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join AgriConnect</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <RadioGroup value={userType} onValueChange={(v) => setUserType(v as any)} className="grid grid-cols-2 gap-4">
                  <Label className="border p-4 cursor-pointer">
                    <RadioGroupItem value="farmer" /> <Tractor /> Farmer
                  </Label>
                  <Label className="border p-4 cursor-pointer">
                    <RadioGroupItem value="buyer" /> <ShoppingBag /> Buyer
                  </Label>
                </RadioGroup>

                <div>
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <Input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>

                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
