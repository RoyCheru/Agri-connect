import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">AgriConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting farmers directly with buyers for fresher, fairer, and more sustainable food.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/marketplace" className="hover:text-foreground transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=vegetables" className="hover:text-foreground transition-colors">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=fruits" className="hover:text-foreground transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=dairy" className="hover:text-foreground transition-colors">
                  Dairy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Farmers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AgriConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
