import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import VendorCard from "@/components/VendorCard";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, 
  FileText, 
  Store, 
  ArrowRight,
  Building,
  Armchair,
  Hammer,
  Zap,
  Wrench,
  Palette,
  Star,
  TrendingUp,
  Package,
  Users,
  Award
} from "lucide-react";

export default function Home() {
  const { t } = useLocale();
  const { user } = useAuth();

  const { data: featuredVendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ["/api/organizations", { status: "active", limit: 4 }],
    select: (data) => data || [],
  });

  const { data: recentProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { isActive: true, limit: 8 }],
    select: (data) => data || [],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    select: (data) => data || [],
  });

  const categories_static = [
    {
      name: t('categories.decoration'),
      description: "Paint, wallpaper, lighting & decorative items",
      icon: Palette,
      color: "from-primary/20 to-secondary/20",
      href: "/categories/decoration"
    },
    {
      name: t('categories.furniture'),
      description: "Office, home & commercial furniture solutions",
      icon: Armchair,
      color: "from-accent/20 to-yellow-400/20",
      href: "/categories/furniture"
    },
    {
      name: t('categories.contracting'),
      description: "General contracting & specialized construction",
      icon: Hammer,
      color: "from-success/20 to-green-400/20",
      href: "/categories/contracting"
    },
    {
      name: t('categories.electrical'),
      description: "Wiring, fixtures, panels & electrical components",
      icon: Zap,
      color: "from-blue-500/20 to-indigo-400/20",
      href: "/categories/electrical"
    },
    {
      name: t('categories.sanitary'),
      description: "Fixtures, pipes, fittings & bathroom accessories",
      icon: Wrench,
      color: "from-purple-500/20 to-pink-400/20",
      href: "/categories/sanitary"
    },
    {
      name: t('categories.tools'),
      description: "Power tools, hand tools & construction equipment",
      icon: Building,
      color: "from-red-500/20 to-orange-400/20",
      href: "/categories/tools"
    }
  ];

  const quickActions = [
    {
      title: "Browse Products",
      description: "Explore our catalog",
      icon: Search,
      color: "bg-primary/10 text-primary",
      href: "/products"
    },
    {
      title: "Request Quote",
      description: "Get competitive pricing",
      icon: FileText,
      color: "bg-accent/10 text-accent",
      href: "/rfq"
    },
    {
      title: "Find Vendors",
      description: "Connect with suppliers",
      icon: Store,
      color: "bg-success/10 text-success",
      href: "/vendors"
    }
  ];

  const stats = [
    { value: "500+", label: t('trust.verifiedVendors'), icon: Award },
    { value: "50K+", label: "Products Available", icon: Package },
    { value: "10K+", label: t('trust.happyCustomers'), icon: Users },
    { value: "95%", label: t('trust.satisfaction'), icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Ready to find the best construction and home fit-out solutions in Qatar?
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {quickActions.map((action, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                  <CardContent className="p-6" onClick={() => window.location.href = action.href}>
                    <div className="text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-blue-100">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <stat.icon className="h-8 w-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories_static.map((category, index) => (
              <div 
                key={index}
                onClick={() => window.location.href = category.href}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-64 bg-gradient-to-br ${category.color}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center mb-2">
                    <category.icon className="h-6 w-6 text-white mr-2" />
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </div>
                  <p className="text-gray-200 text-sm mb-3">{category.description}</p>
                  <div className="flex items-center text-accent font-medium">
                    <span>{t('categories.explore')}</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vendors.title')}</h2>
              <p className="text-lg text-gray-600">
                {t('vendors.subtitle')}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/vendors"}
              className="flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {vendorsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVendors.slice(0, 4).map((vendor: any) => (
                <VendorCard
                  key={vendor.id}
                  vendor={{
                    id: vendor.id,
                    name: vendor.legalName || vendor.tradeName,
                    description: vendor.description || "Quality construction and home fit-out solutions",
                    rating: vendor.rating || 4.5,
                    reviewCount: vendor.reviewCount || 0,
                    verified: vendor.status === "active",
                    deliveryTime: "2-3 days",
                    logoUrl: vendor.logoUrl,
                    categories: vendor.categories || ["General"]
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Products</h2>
              <p className="text-lg text-gray-600">
                Discover the latest additions to our marketplace
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/products"}
              className="flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.slice(0, 8).map((product: any) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    {product.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {product.currency} {product.price}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-accent fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating || 4.5}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {t('rfq.title')}
                </h2>
                <p className="text-xl text-blue-100 mb-6">
                  {t('rfq.subtitle')}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-blue-100">Compare quotes from multiple vendors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-blue-100">Get competitive pricing on bulk orders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-blue-100">Negotiate terms directly with suppliers</span>
                  </div>
                </div>

                <Button 
                  onClick={() => window.location.href = "/rfq"}
                  className="bg-accent hover:bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
                >
                  {t('rfq.createNow')}
                </Button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('rfq.quickForm')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('rfq.projectType')}</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Select project type...</option>
                      <option>Commercial Building</option>
                      <option>Residential Home</option>
                      <option>Office Fit-out</option>
                      <option>Renovation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('rfq.category')}</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Select category...</option>
                      <option>{t('categories.decoration')}</option>
                      <option>{t('categories.furniture')}</option>
                      <option>{t('categories.electrical')}</option>
                      <option>{t('categories.sanitary')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('rfq.budget')}</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Select budget range...</option>
                      <option>QAR 5,000 - 25,000</option>
                      <option>QAR 25,000 - 100,000</option>
                      <option>QAR 100,000 - 500,000</option>
                      <option>QAR 500,000+</option>
                    </select>
                  </div>

                  <Button 
                    onClick={() => window.location.href = "/rfq"}
                    className="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {t('rfq.submit')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
