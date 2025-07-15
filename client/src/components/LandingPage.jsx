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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const navigate = useNavigate();
      const go = () => {
            navigate("/");    
      };
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
                        "Wi-Fi RTT technology provides precise indoor location tracking with accuracy under one meter.",
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
            { name: "Wi-Fi RTT", description: "Indoor Positioning" },
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
                        "Wi-Fi RTT technology pinpoints customer location with sub-meter accuracy upon store entry.",
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
            <div className="min-h-screen bg-background">
                  {/* Navigation */}
                  <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex justify-between items-center py-4">
                                    <div className="flex items-center space-x-2">
                                          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                                                <Zap className="h-5 w-5 text-blue-900" />
                                          </div>
                                          <span className="text-xl font-bold">
                                                QuickPick
                                          </span>
                                    </div>

                                    {/* Desktop Navigation */}
                                    <div className="hidden md:flex items-center space-x-8">
                                          <a
                                                href="#features"
                                                className="text-muted-foreground hover:text-blue-800 transition-colors"
                                          >
                                                Features
                                          </a>
                                          <a
                                                href="#how-it-works"
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                          >
                                                How It Works
                                          </a>
                                          <a
                                                href="#technology"
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                          >
                                                Technology
                                          </a>
                                          <Button className="bg-yellow-300 text-blue-800 w-auto h-auto" onClick={go}>Get Started</Button>
                                    </div>

                                    {/* Mobile menu button */}
                                    <button
                                          className="md:hidden"
                                          onClick={() =>
                                                setMobileMenuOpen(
                                                      !mobileMenuOpen
                                                )
                                          }
                                    >
                                          {mobileMenuOpen ? (
                                                <X className="h-6 w-6" />
                                          ) : (
                                                <Menu className="h-6 w-6" />
                                          )}
                                    </button>
                              </div>

                              {/* Mobile Navigation */}
                              {mobileMenuOpen && (
                                    <div className="md:hidden py-4 border-t">
                                          <div className="flex flex-col space-y-4">
                                                <a
                                                      href="#features"
                                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                      Features
                                                </a>
                                                <a
                                                      href="#how-it-works"
                                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                      How It Works
                                                </a>
                                                <a
                                                      href="#technology"
                                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                      Technology
                                                </a>
                                                <Button className="bg-yellow-300 text-blue-800 w-auto h-auto">
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
                                    <Chip
                                          label="Revolutionizing Retail Experience"
                                          variant="outlined"
                                          sx={{ mb: 2 }}
                                    />
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                          Transform Physical Retail with{" "}
                                          <span className="text-primary">
                                                Smart Navigation
                                          </span>
                                    </h1>
                                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                          Eliminate checkout queues and complex
                                          store layouts. Our intelligent system
                                          guides customers efficiently while
                                          providing retailers with powerful
                                          management tools.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Button
                                                size="lg"
                                                className="text-lg px-8"
                                          >
                                                Try QuickPick
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                          </Button>
                                          <Button
                                                variant="outline"
                                                size="lg"
                                                className="text-lg px-8 bg-transparent"
                                          >
                                                Watch Demo
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Problem Statement */}
                  <section className="py-16 bg-muted/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-3xl font-bold mb-6">
                                          The Problem We Solve
                                    </h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                          Physical retail often lacks
                                          efficiency, forcing customers to
                                          navigate complex layouts and endure
                                          long checkout queues. This friction
                                          alienates time-conscious shoppers who
                                          value convenience but still desire the
                                          tactile satisfaction of in-person
                                          shopping. As inefficiencies peak in
                                          busy stores, many turn to online
                                          platforms—not by choice, but out of
                                          necessity.
                                    </p>
                              </div>
                        </div>
                  </section>

                  {/* Features Section */}
                  <section id="features" className="py-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-16">
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                          Powerful Features
                                    </h2>
                                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                          Our comprehensive solution addresses
                                          every aspect of the retail experience
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {features.map((feature, index) => (
                                          <Card
                                                key={index}
                                                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                                          >
                                                <CardHeader
                                                      title={feature.title}
                                                      avatar={
                                                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                                  {feature.icon}
                                                            </div>
                                                      }
                                                />
                                                <CardContent>
                                                      <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                      >
                                                            {
                                                                  feature.description
                                                            }
                                                      </Typography>
                                                </CardContent>
                                          </Card>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* How It Works */}
                  <section id="how-it-works" className="py-20 bg-muted/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-16">
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                          How It Works
                                    </h2>
                                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                          A seamless journey from online
                                          planning to secure checkout
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {steps.map((step, index) => (
                                          <div
                                                key={index}
                                                className="text-center"
                                          >
                                                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-4">
                                                      {step.number}
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">
                                                      {step.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                      {step.description}
                                                </p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* Technology Stack */}
                  <section id="technology" className="py-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-16">
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                          Built with Modern Technology
                                    </h2>
                                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                          Leveraging cutting-edge technologies
                                          for optimal performance and
                                          reliability
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {techStack.map((tech, index) => (
                                          <Card
                                                key={index}
                                                className="text-center hover:shadow-lg transition-shadow"
                                          >
                                                <CardHeader
                                                      title={tech.name}
                                                      subheader={
                                                            tech.description
                                                      }
                                                />
                                          </Card>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* Benefits Section */}
                  <section className="py-20 bg-muted/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    <div>
                                          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                                                Benefits for Everyone
                                          </h2>
                                          <div className="space-y-6">
                                                <div className="flex items-start space-x-3">
                                                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                                      <div>
                                                            <h3 className="font-semibold mb-1">
                                                                  For Customers
                                                            </h3>
                                                            <p className="text-muted-foreground">
                                                                  Reduced
                                                                  shopping time,
                                                                  no checkout
                                                                  queues, and
                                                                  effortless
                                                                  navigation
                                                            </p>
                                                      </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                                      <div>
                                                            <h3 className="font-semibold mb-1">
                                                                  For Retailers
                                                            </h3>
                                                            <p className="text-muted-foreground">
                                                                  Improved
                                                                  inventory
                                                                  management,
                                                                  layout
                                                                  optimization,
                                                                  and customer
                                                                  insights
                                                            </p>
                                                      </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                                      <div>
                                                            <h3 className="font-semibold mb-1">
                                                                  For Business
                                                            </h3>
                                                            <p className="text-muted-foreground">
                                                                  Increased
                                                                  efficiency,
                                                                  reduced
                                                                  operational
                                                                  costs, and
                                                                  enhanced
                                                                  customer
                                                                  satisfaction
                                                            </p>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
                                          <div className="grid grid-cols-2 gap-6 text-center">
                                                <div>
                                                      <div className="text-3xl font-bold text-primary mb-2">
                                                            75%
                                                      </div>
                                                      <div className="text-sm text-muted-foreground">
                                                            Reduction in
                                                            Shopping Time
                                                      </div>
                                                </div>
                                                <div>
                                                      <div className="text-3xl font-bold text-primary mb-2">
                                                            90%
                                                      </div>
                                                      <div className="text-sm text-muted-foreground">
                                                            Checkout Queue
                                                            Elimination
                                                      </div>
                                                </div>
                                                <div>
                                                      <div className="text-3xl font-bold text-primary mb-2">
                                                            60%
                                                      </div>
                                                      <div className="text-sm text-muted-foreground">
                                                            Improved Customer
                                                            Satisfaction
                                                      </div>
                                                </div>
                                                <div>
                                                      <div className="text-3xl font-bold text-primary mb-2">
                                                            40%
                                                      </div>
                                                      <div className="text-sm text-muted-foreground">
                                                            Operational Cost
                                                            Savings
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* CTA Section */}
                  <section className="py-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center text-primary-foreground">
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                          Ready to Transform Your Retail
                                          Experience?
                                    </h2>
                                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                          Join the future of retail with our
                                          intelligent navigation and management
                                          system. Start your free trial today.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Button
                                                size="lg"
                                                variant="secondary"
                                                className="text-lg px-8"
                                          >
                                                Get Started Today
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                          </Button>
                                          <Button
                                                size="lg"
                                                variant="outline"
                                                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                                          >
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
                                          <div className="flex items-center space-x-2 mb-4">
                                                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                                                      <Zap className="h-5 w-5 text-primary-foreground" />
                                                </div>
                                                <span className="text-xl font-bold">
                                                      QuickPick
                                                </span>
                                          </div>
                                          <p className="text-muted-foreground mb-4 max-w-md">
                                                Revolutionizing physical retail
                                                with intelligent navigation and
                                                seamless customer experiences.
                                          </p>
                                    </div>
                                    <div>
                                          <h3 className="font-semibold mb-4">
                                                Product
                                          </h3>
                                          <ul className="space-y-2 text-muted-foreground">
                                                <li>
                                                      <a
                                                            href="#"
                                                            className="hover:text-foreground transition-colors"
                                                      >
                                                            Features
                                                      </a>
                                                </li>
                                                <li>
                                                      <a
                                                            href="#"
                                                            className="hover:text-foreground transition-colors"
                                                      >
                                                            Demo
                                                      </a>
                                                </li>
                                                <li>
                                                      <a
                                                            href="#"
                                                            className="hover:text-foreground transition-colors"
                                                      >
                                                            Documentation
                                                      </a>
                                                </li>
                                          </ul>
                                    </div>
                                    <div>
                                          <h3 className="font-semibold mb-4">
                                                Company
                                          </h3>
                                          <ul className="space-y-2 text-muted-foreground">
                                                <li>
                                                      <a
                                                            href="#"
                                                            className="hover:text-foreground transition-colors"
                                                      >
                                                            About
                                                      </a>
                                                </li>
                                                <li>
                                                      <a
                                                            href="#"
                                                            className="hover:text-foreground transition-colors"
                                                      >
                                                            Contact
                                                      </a>
                                                </li>
                                                <li>
                                                      <a
                                                            href="#"
                                                            className="hover:text-foreground transition-colors"
                                                      >
                                                            Support
                                                      </a>
                                                </li>
                                          </ul>
                                    </div>
                              </div>
                              <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                                    <p>
                                          &copy; 2024 QuickPick. All rights
                                          reserved.
                                    </p>
                              </div>
                        </div>
                  </footer>
            </div>
      );
}
