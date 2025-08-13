import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Clock, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface Organization {
  id: string;
  legalName: string;
  tradeName: string;
  description: string;
  descriptionAr: string;
  logo: string;
  status: string;
}

export function FeaturedVendors() {
  const { t, language } = useLanguage();

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['/api/organizations'],
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('vendors.title', 'Featured Vendors')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('vendors.subtitle', "Connect with Qatar's most trusted construction and home fit-out suppliers")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {organizations.slice(0, 4).map((vendor: Organization) => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
              <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {vendor.logo ? (
                      <img 
                        src={vendor.logo} 
                        alt={vendor.tradeName || vendor.legalName} 
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-1">
                    {vendor.tradeName || vendor.legalName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {language === 'ar' && vendor.descriptionAr 
                      ? vendor.descriptionAr.substring(0, 50) + '...'
                      : vendor.description?.substring(0, 50) + '...' || 'Construction Supplier'
                    }
                  </p>
                  
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < 4 ? 'text-orange-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8)</span>
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      Verified
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      2-3 days
                    </span>
                  </div>

                  <Button className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    View Vendor
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors"
            asChild
          >
            <Link href="/vendors">
              View All Vendors
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
