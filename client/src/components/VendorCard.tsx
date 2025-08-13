import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle, Clock } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    description: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    deliveryTime: string;
    logoUrl?: string;
    categories: string[];
  };
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const { t } = useLocale();

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

  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <CardContent className="p-6">
        <div className="text-center">
          {/* Vendor Logo/Avatar */}
          <Avatar className="w-16 h-16 mx-auto mb-4">
            <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {vendor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Vendor Name and Description */}
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
            {vendor.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {vendor.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center space-x-1 mb-3">
            <div className="flex space-x-1">
              {renderStars(vendor.rating)}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({vendor.rating.toFixed(1)})
            </span>
          </div>

          {/* Status and Delivery Time */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
            {vendor.verified && (
              <span className="flex items-center text-success">
                <CheckCircle className="h-4 w-4 mr-1" />
                {t('vendors.verified')}
              </span>
            )}
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {vendor.deliveryTime}
            </span>
          </div>

          {/* Categories */}
          {vendor.categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {vendor.categories.slice(0, 2).map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {vendor.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{vendor.categories.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-primary hover:bg-secondary text-white font-medium transition-colors"
            onClick={() => window.location.href = `/vendors/${vendor.id}`}
          >
            {t('vendors.viewVendor')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
