import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { Search, Package, Star, ShoppingCart, Heart, Filter } from "lucide-react";

export default function Products() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", { 
      categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      search: searchQuery,
      isActive: true
    }],
    select: (data) => data || [],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    select: (data) => data || [],
  });

  const sortedProducts = products?.sort((a: any, b: any) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price_low":
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case "price_high":
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "text-accent fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover quality construction and home fit-out products from verified vendors across Qatar
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-3 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>
              
              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">By Rating</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="name">By Name</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              {sortedProducts?.length || 0} products found
            </Badge>
            {(searchQuery || categoryFilter !== "all") && (
              <Badge variant="secondary" className="text-sm">
                Filtered
              </Badge>
            )}
          </div>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Products Grid */}
        {sortedProducts && sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product: any) => (
              <Card key={product.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                    
                    {/* Wishlist Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>

                    {/* Product Badge */}
                    {product.stockQuantity && product.stockQuantity < 10 && (
                      <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground">
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex space-x-1">
                        {renderStars(product.rating || 4.5)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.rating || 4.5})
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount || 0} reviews)
                      </span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.price ? (
                          <span className="text-xl font-bold text-primary">
                            {product.currency} {product.price}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Contact for Price</span>
                        )}
                        {product.minOrderQuantity > 1 && (
                          <div className="text-xs text-gray-500">
                            Min. order: {product.minOrderQuantity}
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" className="bg-primary hover:bg-secondary">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {/* SKU */}
                    {product.sku && (
                      <div className="text-xs text-gray-500 mt-2">
                        SKU: {product.sku}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Package className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all products
              </p>
              <div className="space-x-4">
                <Button onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}>
                  Clear Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/vendor/onboarding"}
                >
                  Become a Vendor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {sortedProducts && sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
