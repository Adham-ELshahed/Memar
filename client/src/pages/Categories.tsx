import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Package } from 'lucide-react';
import { Link } from 'wouter';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  icon: string;
  image: string;
  parentId: string | null;
}

export default function Categories() {
  const { language } = useLanguage();
  
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 300000, // 5 minutes
  });

  // Group categories by parent (assuming we have main categories and subcategories)
  const mainCategories = categories.filter((cat: Category) => !cat.parentId);
  const subCategories = categories.filter((cat: Category) => cat.parentId);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LanguageToggle />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Categories</h1>
            <p className="text-gray-600 mb-8">We're having trouble loading the categories. Please try again later.</p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageToggle />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of construction and home fit-out categories
          </p>
        </div>

        {/* Main Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-64">
                <CardContent className="p-6">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : mainCategories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Available</h3>
            <p className="text-gray-600">Categories will appear here once they are added by administrators.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainCategories.map((category: Category) => {
              const categorySubItems = subCategories.filter((sub: Category) => sub.parentId === category.id);
              
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {category.icon ? (
                            <span className="text-2xl">{category.icon}</span>
                          ) : (
                            <Package className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {language === 'ar' ? category.nameAr : category.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {language === 'ar' ? category.descriptionAr : category.description}
                          </p>
                          
                          {categorySubItems.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs font-medium text-gray-500 mb-2">Subcategories:</p>
                              <div className="flex flex-wrap gap-1">
                                {categorySubItems.slice(0, 3).map((sub: Category) => (
                                  <span
                                    key={sub.id}
                                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                  >
                                    {language === 'ar' ? sub.nameAr : sub.name}
                                  </span>
                                ))}
                                {categorySubItems.length > 3 && (
                                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                    +{categorySubItems.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                            <span>Explore Category</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {!isLoading && mainCategories.length > 0 && (
          <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Create an RFQ and let our vendors come to you with personalized offers
            </p>
            <Button size="lg" asChild>
              <Link href="/rfqs/new">
                Create RFQ
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
