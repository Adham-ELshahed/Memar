import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/hooks/useLocale";

interface CategoryGridProps {
  limit?: number;
}

export default function CategoryGrid({ limit }: CategoryGridProps) {
  const { t, isRTL, language } = useLocale();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const displayCategories = limit ? categories?.slice(0, limit) : categories;

  const defaultCategories = [
    {
      id: "decoration",
      nameEn: "Decoration & Design",
      nameAr: "الديكور والتصميم",
      descriptionEn: "Paint, wallpaper, lighting & decorative items",
      descriptionAr: "الطلاء والخلفيات والإضاءة والعناصر الزخرفية",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      slug: "decoration"
    },
    {
      id: "furniture",
      nameEn: "Furniture & Fixtures",
      nameAr: "الأثاث والتجهيزات",
      descriptionEn: "Office, home & commercial furniture solutions",
      descriptionAr: "حلول الأثاث المكتبي والمنزلي والتجاري",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      slug: "furniture"
    },
    {
      id: "contracting",
      nameEn: "Contracting Services",
      nameAr: "خدمات المقاولات",
      descriptionEn: "General contracting & specialized construction",
      descriptionAr: "المقاولات العامة والبناء المتخصص",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      slug: "contracting"
    },
    {
      id: "electrical",
      nameEn: "Electrical Supplies",
      nameAr: "اللوازم الكهربائية",
      descriptionEn: "Wiring, fixtures, panels & electrical components",
      descriptionAr: "الأسلاك والتجهيزات واللوحات والمكونات الكهربائية",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      slug: "electrical"
    },
    {
      id: "sanitary",
      nameEn: "Sanitary & Plumbing",
      nameAr: "الصحي والسباكة",
      descriptionEn: "Fixtures, pipes, fittings & bathroom accessories",
      descriptionAr: "التجهيزات والأنابيب والوصلات وإكسسوارات الحمام",
      imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      slug: "sanitary"
    },
    {
      id: "tools",
      nameEn: "Tools & Equipment",
      nameAr: "الأدوات والمعدات",
      descriptionEn: "Power tools, hand tools & construction equipment",
      descriptionAr: "الأدوات الكهربائية واليدوية ومعدات البناء",
      imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      slug: "tools"
    }
  ];

  const categoriesToShow = displayCategories || defaultCategories;
  const limitedCategories = limit ? categoriesToShow.slice(0, limit) : categoriesToShow;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {limitedCategories.map((category: any) => (
        <div 
          key={category.id}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => window.location.href = `/categories/${category.slug}`}
        >
          <div 
            className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20"
            style={{
              backgroundImage: `url('${category.imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ar' ? category.nameAr : category.nameEn}
            </h3>
            <p className="text-gray-200 text-sm mb-3">
              {language === 'ar' ? category.descriptionAr : category.descriptionEn}
            </p>
            <div className="flex items-center text-accent font-medium">
              <span>{t("categories.explore")}</span>
              <i className={`fas fa-arrow-${isRTL ? 'left' : 'right'} ml-2 group-hover:translate-x-1 transition-transform`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
