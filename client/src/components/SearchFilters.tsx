import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/hooks/useLocale";

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

export default function SearchFilters({ onFiltersChange, initialFilters = {} }: SearchFiltersProps) {
  const { t } = useLocale();
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    categoryId: initialFilters.categoryId || "",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 10000,
    inStock: initialFilters.inStock || false,
    featured: initialFilters.featured || false,
    rating: initialFilters.rating || 0,
    deliveryOptions: initialFilters.deliveryOptions || [],
    ...initialFilters,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      categoryId: "",
      minPrice: 0,
      maxPrice: 10000,
      inStock: false,
      featured: false,
      rating: 0,
      deliveryOptions: [],
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'minPrice' && value === 0) return false;
    if (key === 'maxPrice' && value === 10000) return false;
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== 0;
  });

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("filters.title")}</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              {t("filters.clearAll")}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search">{t("filters.search")}</Label>
          <Input
            id="search"
            placeholder={t("filters.searchPlaceholder")}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <Label>{t("filters.category")}</Label>
          <Select 
            value={filters.categoryId} 
            onValueChange={(value) => handleFilterChange("categoryId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filters.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("filters.allCategories")}</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-3 block">{t("filters.priceRange")}</Label>
          <div className="px-2 mb-4">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => {
                handleFilterChange("minPrice", min);
                handleFilterChange("maxPrice", max);
              }}
              min={0}
              max={100000}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>QAR {filters.minPrice.toLocaleString()}</span>
            <span>-</span>
            <span>QAR {filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label>{t("filters.availability")}</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
            />
            <Label htmlFor="inStock" className="text-sm">{t("filters.inStockOnly")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured}
              onCheckedChange={(checked) => handleFilterChange("featured", checked)}
            />
            <Label htmlFor="featured" className="text-sm">{t("filters.featuredOnly")}</Label>
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="mb-3 block">{t("filters.minimumRating")}</Label>
          <Select 
            value={filters.rating.toString()} 
            onValueChange={(value) => handleFilterChange("rating", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t("filters.anyRating")}</SelectItem>
              <SelectItem value="4">
                <div className="flex items-center space-x-1">
                  <span>4</span>
                  <i className="fas fa-star text-accent text-xs"></i>
                  <span>{t("filters.andUp")}</span>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center space-x-1">
                  <span>3</span>
                  <i className="fas fa-star text-accent text-xs"></i>
                  <span>{t("filters.andUp")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Options */}
        <div className="space-y-3">
          <Label>{t("filters.deliveryOptions")}</Label>
          <div className="space-y-2">
            {["sameDay", "nextDay", "pickup"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={filters.deliveryOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleFilterChange("deliveryOptions", [...filters.deliveryOptions, option]);
                    } else {
                      handleFilterChange("deliveryOptions", filters.deliveryOptions.filter((o: string) => o !== option));
                    }
                  }}
                />
                <Label htmlFor={option} className="text-sm">{t(`filters.delivery.${option}`)}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div>
            <Label className="mb-3 block">{t("filters.activeFilters")}</Label>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  {t("filters.search")}: {filters.search}
                </Badge>
              )}
              {filters.categoryId && (
                <Badge variant="secondary" className="text-xs">
                  {categories?.find((c: any) => c.id === filters.categoryId)?.nameEn}
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="text-xs">
                  {t("filters.inStockOnly")}
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="text-xs">
                  {t("filters.featuredOnly")}
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.rating}+ {t("filters.stars")}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
