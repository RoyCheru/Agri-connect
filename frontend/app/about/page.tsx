import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Shield, Heart, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in building strong connections between farmers and their local communities.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Every product is traceable to its source, ensuring quality and authenticity.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Supporting sustainable farming practices for a healthier planet.",
    },
  ]

  const stats = [
    { value: "500+", label: "Local Farmers" },
    { value: "10,000+", label: "Happy Customers" },
    { value: "50+", label: "Communities Served" },
    { value: "100%", label: "Fresh Guarantee" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Leaf className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Connecting Farmers with Communities</h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                AgriConnect is more than a marketplace. We are a movement to revolutionize how fresh food reaches your
                table, creating a sustainable ecosystem that benefits farmers, buyers, and the environment.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">Join AgriConnect</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace">Explore Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At AgriConnect, we are on a mission to create a more equitable and sustainable food system. We believe
                  that everyone deserves access to fresh, locally-grown produce, and that farmers deserve fair
                  compensation for their hard work.
                </p>
                <p className="text-muted-foreground mb-4">
                  By cutting out the middlemen, we enable farmers to earn more while buyers pay less for higher quality
                  products. It is a win-win that strengthens local economies and reduces the environmental impact of
                  food transportation.
                </p>
                <p className="text-muted-foreground">
                  Join us in building a food system that works for everyone from the soil to your table.
                </p>
              </div>
              <div>
                <img src="/farmer-in-field-with-crops-sustainable-agriculture.jpg" alt="Sustainable farming" className="rounded-xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do at AgriConnect
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Getting started with AgriConnect is simple</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  Create your account as a farmer or buyer in just a few minutes
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-sm text-muted-foreground">
                  Browse products from local farmers or list your own produce for sale
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Enjoy</h3>
                <p className="text-sm text-muted-foreground">
                  Receive fresh produce at your doorstep or grow your farming business
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-90">
              Join thousands of farmers and buyers who are already part of the AgriConnect community.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/sign-up">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
