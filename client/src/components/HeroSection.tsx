import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, FileText, Store } from 'lucide-react';
import { Link } from 'wouter';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {t('hero.title', "Qatar's Premier")}
                <span className="text-orange-400 block">Construction</span>
                Marketplace
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('hero.subtitle', 'Connect with trusted vendors, get competitive quotes, and source quality materials for your construction and home fit-out projects.')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                asChild
              >
                <Link href="/products">{t('hero.start_shopping', 'Start Shopping')}</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link href="/rfqs/new">{t('hero.create_rfq', 'Create RFQ')}</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-200">Trusted Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-blue-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-blue-200">Happy Customers</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Quick Actions Card */}
            <Card className="bg-white rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group h-auto"
                    asChild
                  >
                    <Link href="/products">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Search className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Browse Products</div>
                          <div className="text-sm text-gray-500">Explore our catalog</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group h-auto"
                    asChild
                  >
                    <Link href="/rfqs/new">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Request Quote</div>
                          <div className="text-sm text-gray-500">Get competitive pricing</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group h-auto"
                    asChild
                  >
                    <Link href="/vendors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Find Vendors</div>
                          <div className="text-sm text-gray-500">Connect with suppliers</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
