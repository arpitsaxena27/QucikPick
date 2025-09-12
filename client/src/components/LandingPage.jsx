import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
} from "@mui/material";
import {
  ShoppingCart,
  MapPin,
  Shield,
  BarChart3,
  Zap,
  Navigation,
  Camera,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const go = () => {
    navigate("/lp");
  };

  // Walmart-ish color palette
  // Primary blue: #0071CE
  // Accent yellow: #FFC220
  // Deep navy for text/contrast: #0C2D48

  const features = [
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Pre-Curated Shopping",
      description:
        "Customers build their cart in advance, streamlining the in-store experience and reducing shopping time.",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Sub-Meter Positioning",
      description:
        "Wi‑Fi RTT technology provides precise indoor location tracking with accuracy under one meter.",
    },
    {
      icon: <Navigation className="h-8 w-8" />,
      title: "Smart Pathfinding",
      description:
        "Custom Dijkstra's algorithm creates optimal routes through the store layout for maximum efficiency.",
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Shelf Recognition",
      description:
        "OpenCV-powered image detection accurately identifies shelves and products on the store map.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "RFID Security",
      description:
        "Smart exit system with RFID tags ensures secure checkout while maintaining smooth customer flow.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Retailer Dashboard",
      description:
        "Comprehensive admin interface for inventory management, layout optimization, and real-time analytics.",
    },
  ];

  const techStack = [
    {
      name: "MERN Stack",
      description: "MongoDB, Express, React, Node.js",
    },
    { name: "Redux Toolkit", description: "State Management" },
    { name: "MongoDB", description: "NoSQL Database" },
    { name: "Wi‑Fi RTT", description: "Indoor Positioning" },
    { name: "OpenCV", description: "Image Detection" },
    { name: "RFID", description: "Security & Tracking" },
  ];

  const steps = [
    {
      number: "01",
      title: "Pre-Shop Online",
      description:
        "Customers curate their shopping cart in advance through our web platform.",
    },
    {
      number: "02",
      title: "Arrive & Locate",
      description:
        "Wi‑Fi RTT technology pinpoints customer location with sub-meter accuracy upon store entry.",
    },
    {
      number: "03",
      title: "Navigate Efficiently",
      description:
        "Dynamic map with Dijkstra pathfinding guides customers along the optimal route.",
    },
    {
      number: "04",
      title: "Secure Checkout",
      description:
        "RFID tags ensure secure exit while maintaining a smooth, frictionless experience.",
    },
  ];

  return (
    <div>
      {/* Inject small style block to keep Walmart colors consistent */}
      <style>{`
        :root {
          --walmart-blue: #0071CE;
          --walmart-yellow: #FFC220;
          --walmart-dark: #0C2D48;
          --walmart-muted: rgba(12,45,72,0.08);
        }

        .walmart-bg { background-color: var(--walmart-blue); }
        .walmart-accent { color: var(--walmart-blue); }
        .walmart-yellow { color: var(--walmart-yellow); }
        .walmart-btn { background-color: var(--walmart-yellow); color: var(--walmart-dark); }
        .walmart-chip { border-color: var(--walmart-blue); color: var(--walmart-dark); }
        .walmart-card { border: 1px solid rgba(7,62,120,0.06); }
        .walmart-hero-cta { background: linear-gradient(90deg, rgba(255,194,32,0.12), rgba(0,113,206,0.04)); }
        .walmart-stat { color: var(--walmart-blue); font-weight: 700; }
      `}</style>

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f7fbff, #ffffff)" }}>
        {/* Navigation */}
        <nav className="border-b bg-white/95 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: "var(--walmart-yellow)" }}>
                  <Zap className="h-5 w-5" style={{ color: "var(--walmart-dark)" }} />
                </div>
                <span className="text-xl font-bold" style={{ color: "var(--walmart-dark)" }}>
                  QuickPick
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-sm hover:underline" style={{ color: "var(--walmart-dark)" }}>
                  Features
                </a>
                <a href="#how-it-works" className="text-sm hover:underline" style={{ color: "var(--walmart-dark)" }}>
                  How It Works
                </a>
                <a href="#technology" className="text-sm hover:underline" style={{ color: "var(--walmart-dark)" }}>
                  Technology
                </a>
                <Button onClick={go} sx={{ textTransform: 'none', boxShadow: 'none' }} className="walmart-btn">
                  Get Started
                </Button>
              </div>

              {/* Mobile menu button */}
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
                {mobileMenuOpen ? <X className="h-6 w-6" style={{ color: "var(--walmart-dark)" }} /> : <Menu className="h-6 w-6" style={{ color: "var(--walmart-dark)" }} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col space-y-4">
                  <a href="#features" className="text-sm" style={{ color: "var(--walmart-dark)" }}>
                    Features
                  </a>
                  <a href="#how-it-works" className="text-sm" style={{ color: "var(--walmart-dark)" }}>
                    How It Works
                  </a>
                  <a href="#technology" className="text-sm" style={{ color: "var(--walmart-dark)" }}>
                    Technology
                  </a>
                  <Button onClick={go} sx={{ textTransform: 'none', boxShadow: 'none' }} className="walmart-btn">
                    Get Started
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Chip label="Revolutionizing Retail Experience" variant="outlined" className="walmart-chip mx-auto" />

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight my-6" style={{ color: "var(--walmart-dark)" }}>
                Transform Physical Retail with <span style={{ color: "var(--walmart-blue)" }}>Smart Navigation</span>
              </h1>

              <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(12,45,72,0.7)" }}>
                Eliminate checkout queues and complex store layouts. Our intelligent system guides customers efficiently while providing retailers with powerful management tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="large" onClick={go} sx={{ textTransform: 'none', paddingX: 6 }} className="walmart-btn">
                  Try QuickPick
                  <ArrowRight className="ml-2" />
                </Button>
                <Button variant="outlined" size="large" sx={{ textTransform: 'none', borderColor: 'var(--walmart-blue)', color: 'var(--walmart-blue)' }}>
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16" style={{ background: 'var(--walmart-muted)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--walmart-dark)' }}>
                The Problem We Solve
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(12,45,72,0.75)' }}>
                Physical retail often lacks efficiency, forcing customers to navigate complex layouts and endure long checkout queues. This friction alienates time-conscious shoppers who value convenience but still desire the tactile satisfaction of in-person shopping.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--walmart-dark)' }}>
                Powerful Features
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(12,45,72,0.7)' }}>
                Our comprehensive solution addresses every aspect of the retail experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="walmart-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader
                    title={feature.title}
                    avatar={
                      <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,113,206,0.08)', color: 'var(--walmart-blue)' }}>
                        {feature.icon}
                      </div>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20" style={{ background: 'var(--walmart-muted)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--walmart-dark)' }}>
                How It Works
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(12,45,72,0.7)' }}>
                A seamless journey from online planning to secure checkout
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: 'var(--walmart-yellow)' }}>
                    <div style={{ color: 'var(--walmart-dark)', fontWeight: 700 }}>{step.number}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--walmart-dark)' }}>{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed" style={{ color: 'rgba(12,45,72,0.75)' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section id="technology" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--walmart-dark)' }}>
                Built with Modern Technology
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(12,45,72,0.7)' }}>
                Leveraging cutting-edge technologies for optimal performance and reliability
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader title={tech.name} subheader={tech.description} />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20" style={{ background: 'var(--walmart-muted)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--walmart-dark)' }}>
                  Benefits for Everyone
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--walmart-blue)' }} />
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--walmart-dark)' }}>For Customers</h3>
                      <p style={{ color: 'rgba(12,45,72,0.75)' }}>Reduced shopping time, no checkout queues, and effortless navigation</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--walmart-blue)' }} />
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--walmart-dark)' }}>For Retailers</h3>
                      <p style={{ color: 'rgba(12,45,72,0.75)' }}>Improved inventory management, layout optimization, and customer insights</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--walmart-blue)' }} />
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--walmart-dark)' }}>For Business</h3>
                      <p style={{ color: 'rgba(12,45,72,0.75)' }}>Increased efficiency, reduced operational costs, and enhanced customer satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(0,113,206,0.04), rgba(255,194,32,0.06))' }}>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl walmart-stat mb-2">75%</div>
                    <div className="text-sm" style={{ color: 'rgba(12,45,72,0.75)' }}>Reduction in Shopping Time</div>
                  </div>
                  <div>
                    <div className="text-3xl walmart-stat mb-2">90%</div>
                    <div className="text-sm" style={{ color: 'rgba(12,45,72,0.75)' }}>Checkout Queue Elimination</div>
                  </div>
                  <div>
                    <div className="text-3xl walmart-stat mb-2">60%</div>
                    <div className="text-sm" style={{ color: 'rgba(12,45,72,0.75)' }}>Improved Customer Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-3xl walmart-stat mb-2">40%</div>
                    <div className="text-sm" style={{ color: 'rgba(12,45,72,0.75)' }}>Operational Cost Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl p-8 lg:p-12 text-center walmart-hero-cta">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--walmart-dark)' }}>
                Ready to Transform Your Retail Experience?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(12,45,72,0.8)' }}>
                Join the future of retail with our intelligent navigation and management system. Start your free trial today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={go} size="large" sx={{ textTransform: 'none' }} className="walmart-btn">
                  Get Started Today
                  <ArrowRight className="ml-2" />
                </Button>
                <Button size="large" variant="outlined" sx={{ textTransform: 'none', borderColor: 'var(--walmart-blue)', color: 'var(--walmart-blue)' }}>
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: 'var(--walmart-yellow)' }}>
                    <Zap className="h-5 w-5" style={{ color: 'var(--walmart-dark)' }} />
                  </div>
                  <span className="text-xl font-bold" style={{ color: 'var(--walmart-dark)' }}>QuickPick</span>
                </div>
                <p className="mb-4 max-w-md" style={{ color: 'rgba(12,45,72,0.75)' }}>
                  Revolutionizing physical retail with intelligent navigation and seamless customer experiences.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--walmart-dark)' }}>Product</h3>
                <ul className="space-y-2" style={{ color: 'rgba(12,45,72,0.75)' }}>
                  <li><a href="#" className="hover:underline">Features</a></li>
                  <li><a href="#" className="hover:underline">Demo</a></li>
                  <li><a href="#" className="hover:underline">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--walmart-dark)' }}>Company</h3>
                <ul className="space-y-2" style={{ color: 'rgba(12,45,72,0.75)' }}>
                  <li><a href="#" className="hover:underline">About</a></li>
                  <li><a href="#" className="hover:underline">Contact</a></li>
                  <li><a href="#" className="hover:underline">Support</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center" style={{ color: 'rgba(12,45,72,0.65)' }}>
              <p>&copy; 2025 QuickPick. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
