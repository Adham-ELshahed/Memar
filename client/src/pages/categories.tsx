import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ProductCard from "@/components/ProductCard";
import SearchFilters from "@/components/SearchFilters";
import { useLocale } from "@/hooks/useLocale";

export default function Categories() {
  const [location] = useLocation();
  const { t, language } = useLocale();
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");

  const categorySlug = location.split("/").pop();

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", { categorySlug, ...filters, sort: sortBy }],
    select: (data) => data || [],
  });

  const category = categories?.find((c: any) => c.slug === categorySlug);
  const categoryName = category ? (language === 'ar' ? category.nameAr : category.nameEn) : categorySlug;

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "price-low", label: t("sort.priceLowToHigh") },
    { value: "price-high", label: t("sort.priceHighToLow") },
    { value: "rating", label: t("sort.rating") },
    { value: "popular", label: t("sort.popular") },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("nav.home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">{t("nav.categories")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="capitalize">
              {categoryName}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">{categoryName}</h1>
          {category && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {language === 'ar' ? category.descriptionAr : category.descriptionEn}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div>
            <SearchFilters onFiltersChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-sm">
                  {products?.length || 0} {t("products.results")}
                </Badge>
                {Object.keys(filters).length > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {t("products.filtered")}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{t("sort.sortBy")}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <i className="fas fa-search text-6xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("products.noResults")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("products.noResultsDesc")}
                  </p>
                  <div className="space-x-4">
                    <Button onClick={() => setFilters({})}>
                      {t("products.clearFilters")}
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = "/rfq"}>
                      {t("products.createRFQ")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {products && products.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  {t("products.loadMore")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
