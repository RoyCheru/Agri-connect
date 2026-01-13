import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Leaf, ShoppingBag, Truck, Users, ArrowRight, Star } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Leaf,
      title: "Farm Fresh",
      description: "Products sourced directly from local farms, ensuring maximum freshness and quality.",
    },
    {
      icon: Users,
      title: "Direct Connection",
      description: "Connect directly with farmers, supporting local agriculture and fair pricing.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery from farm to your doorstep.",
    },
    {
      icon: ShoppingBag,
      title: "Wide Selection",
      description: "Browse through a diverse range of fresh produce, dairy, and more.",
    },
  ]

  const categories = [
    { name: "Vegetables", image: "/fresh-vegetables-farm.jpg" },
    { name: "Fruits", image: "/fresh-fruits-orchard.jpg" },
    { name: "Dairy", image: "/fresh-dairy-products-farm.jpg" },
    { name: "Grains", image: "/wheat-grains-harvest.jpg" },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Cook",
      content: "The quality of produce from AgriConnect is unmatched. I love knowing exactly where my food comes from.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Local Farmer",
      content:
        "AgriConnect has transformed my business. I can now reach customers directly and get fair prices for my produce.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Restaurant Owner",
      content:
        "My customers love knowing we source from local farms. AgriConnect makes it easy to get fresh ingredients daily.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                  Fresh From Farm to Your Table
                </h1>
                <p className="text-lg text-muted-foreground max-w-md text-pretty">
                  Connect directly with local farmers and get the freshest produce delivered to your doorstep. Support
                  local agriculture while enjoying quality food.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/marketplace">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/sign-up">Start Selling</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/farmer-holding-fresh-vegetables-basket-sunny-farm.jpg"
                  alt="Fresh produce from local farms"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose AgriConnect?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're building a sustainable food ecosystem that benefits farmers, buyers, and the environment.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Browse Categories</h2>
              <p className="text-muted-foreground">Explore our wide selection of farm-fresh products</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/marketplace?category=${category.name.toLowerCase()}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative h-48">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 text-xl font-bold text-background">{category.name}</h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What People Say</h2>
              <p className="text-muted-foreground">Hear from our community of farmers and buyers</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{`"${testimonial.content}"`}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-90">
              Whether you are a farmer looking to sell your produce or a buyer seeking fresh, local food, AgriConnect is
              here for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/sign-up">Create Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
