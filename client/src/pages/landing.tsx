import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/hooks/useLocale";
import LanguageToggle from "@/components/LanguageToggle";
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
  Shield,
  CreditCard,
  Headphones,
  Truck,
  Star,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react";

export default function Landing() {
  const { t } = useLocale();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const categories = [
    {
      name: t('categories.decoration'),
      description: "Paint, wallpaper, lighting & decorative items",
      icon: Palette,
      color: "from-primary/20 to-secondary/20"
    },
    {
      name: t('categories.furniture'),
      description: "Office, home & commercial furniture solutions",
      icon: Armchair,
      color: "from-accent/20 to-yellow-400/20"
    },
    {
      name: t('categories.contracting'),
      description: "General contracting & specialized construction",
      icon: Hammer,
      color: "from-success/20 to-green-400/20"
    },
    {
      name: t('categories.electrical'),
      description: "Wiring, fixtures, panels & electrical components",
      icon: Zap,
      color: "from-blue-500/20 to-indigo-400/20"
    },
    {
      name: t('categories.sanitary'),
      description: "Fixtures, pipes, fittings & bathroom accessories",
      icon: Wrench,
      color: "from-purple-500/20 to-pink-400/20"
    },
    {
      name: t('categories.tools'),
      description: "Power tools, hand tools & construction equipment",
      icon: Building,
      color: "from-red-500/20 to-orange-400/20"
    }
  ];

  const vendors = [
    {
      name: "Al Rashid Trading",
      type: "Building Materials Supplier",
      rating: 4.9,
      verified: true,
      deliveryTime: "2-3 days",
      icon: Building
    },
    {
      name: "Modern Spaces",
      type: "Furniture & Interior Design",
      rating: 4.7,
      verified: true,
      deliveryTime: "1-2 days",
      icon: Armchair
    },
    {
      name: "Qatar Electric Co.",
      type: "Electrical Systems & Supply",
      rating: 5.0,
      verified: true,
      deliveryTime: "Same day",
      icon: Zap
    },
    {
      name: "Premium Sanitary",
      type: "Plumbing & Bathroom Fixtures",
      rating: 4.8,
      verified: true,
      deliveryTime: "3-5 days",
      icon: Wrench
    }
  ];

  const trustFeatures = [
    {
      icon: Shield,
      title: t('trust.verifiedVendors'),
      description: "All vendors undergo KYC verification and background checks for your security"
    },
    {
      icon: CreditCard,
      title: t('trust.securePayments'),
      description: "Protected transactions with escrow services and multiple payment options"
    },
    {
      icon: Headphones,
      title: t('trust.support247'),
      description: "Dedicated customer support team available around the clock in Arabic & English"
    },
    {
      icon: Truck,
      title: t('trust.fastDelivery'),
      description: "Efficient logistics network ensuring quick delivery across Qatar"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageToggle />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Phone className="h-4 w-4 text-primary mr-2" />
                +974 4444 5555
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 text-primary mr-2" />
                support@meamar.qa
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hover:text-primary transition-colors cursor-pointer">
                {t('header.helpCenter')}
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                {t('header.becomeVendor')}
              </span>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary">Meamar</div>
              <Badge variant="secondary" className="ml-2 text-xs">QATAR</Badge>
            </div>
            
            <Button onClick={handleLogin} className="bg-primary hover:bg-secondary">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundBlendMode: 'overlay'
             }}>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {t('hero.title').split(' ').slice(0, 2).join(' ')}
                  <br />
                  <span className="text-accent">{t('hero.title').split(' ').slice(2, 3).join(' ')}</span>
                  <br />
                  {t('hero.title').split(' ').slice(3).join(' ')}
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleLogin}
                  className="bg-accent hover:bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
                >
                  {t('hero.startShopping')}
                </Button>
                <Button 
                  onClick={handleLogin}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  {t('hero.createRFQ')}
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-blue-200">{t('hero.trustedVendors')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-blue-200">{t('hero.products')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-blue-200">{t('hero.happyCustomers')}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Browse Products</div>
                        <div className="text-sm text-gray-500">Explore our catalog</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>

                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Request Quote</div>
                        <div className="text-sm text-gray-500">Get competitive pricing</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>

                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Store className="h-5 w-5 text-success" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Find Vendors</div>
                        <div className="text-sm text-gray-500">Connect with suppliers</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div 
                key={index}
                onClick={handleLogin}
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vendors.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('vendors.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((vendor, index) => (
              <Card 
                key={index}
                onClick={handleLogin}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <vendor.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{vendor.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{vendor.type}</p>
                    
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vendor.rating) 
                                ? "text-accent fill-current" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({vendor.rating})</span>
                    </div>

                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                      {vendor.verified && (
                        <span className="flex items-center text-success">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t('vendors.verified')}
                        </span>
                      )}
                      <span>{vendor.deliveryTime}</span>
                    </div>

                    <Button className="w-full bg-primary hover:bg-secondary text-white font-medium transition-colors">
                      {t('vendors.viewVendor')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={handleLogin}
              variant="outline" 
              className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors"
            >
              View All Vendors
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('trust.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('trust.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">{t('trust.verifiedVendors')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-gray-600">Products Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600">{t('trust.happyCustomers')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-gray-600">{t('trust.satisfaction')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">Meamar</div>
                <p className="text-gray-300">{t('footer.company')}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-primary">📍</span>
                  <span className="text-gray-300">Doha, Qatar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-gray-300">+974 4444 5555</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-gray-300">support@meamar.qa</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h3>
              <ul className="space-y-3">
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.aboutUs')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.howItWorks')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('header.becomeVendor')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('header.helpCenter')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.contactUs')}</span></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('footer.categories')}</h3>
              <ul className="space-y-3">
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('categories.decoration')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('categories.furniture')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('categories.contracting')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('categories.electrical')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('categories.sanitary')}</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('footer.legal')}</h3>
              <ul className="space-y-3">
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.terms')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.privacy')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.cookies')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.returns')}</span></li>
                <li><span className="text-gray-300 hover:text-primary transition-colors cursor-pointer">{t('footer.kyc')}</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </div>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{t('footer.madeInQatar')}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
