import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/hooks/useLocale";

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: string;
  unit: string;
  images: string[];
  isFeatured?: boolean;
  stockQuantity: number;
  minOrderQuantity: number;
  organizationId: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useLocale();

  const handleViewProduct = () => {
    window.location.href = `/products/${product.id}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id);
  };

  const handleRequestQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/rfq/create?productId=${product.id}`;
  };

  const productName = language === 'ar' ? product.nameAr : product.nameEn;
  const productDescription = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';

  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={handleViewProduct}>
      <div className="relative overflow-hidden">
        <div 
          className="h-48 bg-gray-200"
          style={{
            backgroundImage: `url('${mainImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-accent text-white">
            {t("product.featured")}
          </Badge>
        )}
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">{t("product.outOfStock")}</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{productName}</h3>
        {productDescription && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{productDescription}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-primary">
            QAR {parseFloat(product.price).toLocaleString()}
            <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>
          </div>
          {product.minOrderQuantity > 1 && (
            <Badge variant="outline" className="text-xs">
              Min: {product.minOrderQuantity} {product.unit}
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
          >
            <i className="fas fa-shopping-cart mr-1"></i>
            {t("product.addToCart")}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={handleRequestQuote}
          >
            <i className="fas fa-file-invoice mr-1"></i>
            {t("product.requestQuote")}
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{t("product.inStock")}: {product.stockQuantity}</span>
          <span className="flex items-center">
            <i className="fas fa-truck mr-1"></i>
            {t("product.fastDelivery")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
