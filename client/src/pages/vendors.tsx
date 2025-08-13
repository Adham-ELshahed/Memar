import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import VendorCard from "@/components/VendorCard";
import { useLocale } from "@/hooks/useLocale";
import { Search, Filter, Store } from "lucide-react";

export default function Vendors() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["/api/organizations", { 
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery 
    }],
    select: (data) => data || [],
  });

  const sortedVendors = vendors?.sort((a: any, b: any) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
        return a.legalName.localeCompare(b.legalName);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("vendors.title")}</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {t("vendors.subtitle")}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    placeholder={t("vendors.searchPlaceholder")}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("vendors.allVendors")}</SelectItem>
                    <SelectItem value="active">{t("vendors.activeOnly")}</SelectItem>
                    <SelectItem value="verified">{t("vendors.verifiedOnly")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">{t("sort.rating")}</SelectItem>
                    <SelectItem value="name">{t("sort.name")}</SelectItem>
                    <SelectItem value="newest">{t("sort.newest")}</SelectItem>
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
              {sortedVendors?.length || 0} {t("vendors.results")}
            </Badge>
            {(searchQuery || statusFilter !== "all") && (
              <Badge variant="secondary" className="text-sm">
                {t("vendors.filtered")}
              </Badge>
            )}
          </div>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/vendor/onboarding"}
          >
            <Store className="h-4 w-4 mr-2" />
            {t("vendors.becomeVendor")}
          </Button>
        </div>

        {/* Vendors Grid */}
        {sortedVendors && sortedVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedVendors.map((vendor: any) => (
              <VendorCard
                key={vendor.id}
                vendor={{
                  id: vendor.id,
                  name: vendor.legalName || vendor.tradeName,
                  description: vendor.description || t("vendors.defaultDesc"),
                  rating: vendor.rating || 4.5,
                  reviewCount: vendor.reviewCount || 0,
                  verified: vendor.status === "active",
                  deliveryTime: "2-3 days", // Default delivery time
                  logoUrl: vendor.logoUrl,
                  categories: vendor.categories || ["General"]
                }}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Store className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("vendors.noResults")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("vendors.noResultsDesc")}
              </p>
              <div className="space-x-4">
                <Button onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}>
                  {t("vendors.clearFilters")}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/vendor/onboarding"}
                >
                  {t("vendors.becomeVendor")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {sortedVendors && sortedVendors.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {t("vendors.loadMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
