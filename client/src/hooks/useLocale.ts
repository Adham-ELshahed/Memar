import { useState, useEffect } from 'react';

export interface LocaleContextType {
  locale: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  toggleLocale: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.support': 'Support',
    'header.becomeVendor': 'Become a Vendor',
    'header.helpCenter': 'Help Center',
    'header.searchPlaceholder': 'Search for products, services, or vendors...',
    'header.categories': 'Categories',
    'header.decoration': 'Decoration',
    'header.furniture': 'Furniture',
    'header.contracting': 'Contracting',
    'header.electrical': 'Electrical',
    'header.sanitary': 'Sanitary',
    'header.rfqCenter': 'RFQ Center',
    
    // Navigation
    'nav.home': 'Home',
    'nav.vendors': 'Vendors',
    'nav.products': 'Products',
    'nav.rfq': 'RFQ',
    'nav.messages': 'Messages',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.title': "Qatar's Premier Construction Marketplace",
    'hero.subtitle': 'Connect with trusted vendors, get competitive quotes, and source quality materials for your construction and home fit-out projects.',
    'hero.startShopping': 'Start Shopping',
    'hero.createRFQ': 'Create RFQ',
    'hero.trustedVendors': 'Trusted Vendors',
    'hero.products': 'Products',
    'hero.happyCustomers': 'Happy Customers',
    
    // Categories
    'categories.title': 'Shop by Category',
    'categories.subtitle': 'Discover a wide range of construction and home fit-out products from trusted vendors across Qatar',
    'categories.decoration': 'Decoration & Design',
    'categories.furniture': 'Furniture & Fixtures',
    'categories.contracting': 'Contracting Services',
    'categories.electrical': 'Electrical Supplies',
    'categories.sanitary': 'Sanitary & Plumbing',
    'categories.tools': 'Tools & Equipment',
    'categories.explore': 'Explore Category',
    
    // Vendors
    'vendors.title': 'Featured Vendors',
    'vendors.subtitle': 'Connect with Qatar\'s most trusted construction and home fit-out suppliers',
    'vendors.searchPlaceholder': 'Search vendors...',
    'vendors.allVendors': 'All Vendors',
    'vendors.activeOnly': 'Active Only',
    'vendors.verifiedOnly': 'Verified Only',
    'vendors.results': 'results',
    'vendors.filtered': 'Filtered',
    'vendors.becomeVendor': 'Become a Vendor',
    'vendors.noResults': 'No vendors found',
    'vendors.noResultsDesc': 'Try adjusting your search criteria or browse all vendors',
    'vendors.clearFilters': 'Clear Filters',
    'vendors.loadMore': 'Load More',
    'vendors.defaultDesc': 'Quality construction and home fit-out solutions',
    'vendors.verified': 'Verified',
    'vendors.viewVendor': 'View Vendor',
    
    // Sorting
    'sort.rating': 'By Rating',
    'sort.name': 'By Name',
    'sort.newest': 'Newest First',
    
    // RFQ
    'rfq.title': 'Need Something Specific?',
    'rfq.subtitle': 'Create a Request for Quote (RFQ) and get competitive offers from multiple verified vendors.',
    'rfq.createNow': 'Create RFQ Now',
    'rfq.quickForm': 'Quick RFQ Form',
    'rfq.projectType': 'Project Type',
    'rfq.category': 'Category',
    'rfq.budget': 'Budget Range',
    'rfq.description': 'Description',
    'rfq.submit': 'Submit RFQ',
    
    // Trust Indicators
    'trust.title': 'Why Choose Meamar?',
    'trust.subtitle': 'We\'re committed to providing a secure, reliable platform for all your construction and home fit-out needs',
    'trust.verifiedVendors': 'Verified Vendors',
    'trust.securePayments': 'Secure Payments',
    'trust.support247': '24/7 Support',
    'trust.fastDelivery': 'Fast Delivery',
    'trust.satisfaction': 'Customer Satisfaction',
    
    // Footer
    'footer.company': 'Qatar\'s premier marketplace for construction and home fit-out solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.aboutUs': 'About Us',
    'footer.howItWorks': 'How It Works',
    'footer.contactUs': 'Contact Us',
    'footer.categories': 'Categories',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.cookies': 'Cookie Policy',
    'footer.returns': 'Returns & Refunds',
    'footer.kyc': 'KYC Policy',
    'footer.copyright': '© 2024 Meamar. All rights reserved.',
    'footer.madeInQatar': 'Made in Qatar',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.update': 'Update',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  ar: {
    // Header
    'header.support': 'الدعم',
    'header.becomeVendor': 'كن مورد',
    'header.helpCenter': 'مركز المساعدة',
    'header.searchPlaceholder': 'البحث عن المنتجات أو الخدمات أو الموردين...',
    'header.categories': 'الفئات',
    'header.decoration': 'الديكور',
    'header.furniture': 'الأثاث',
    'header.contracting': 'المقاولات',
    'header.electrical': 'الكهرباء',
    'header.sanitary': 'الصحي',
    'header.rfqCenter': 'مركز طلبات التسعير',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.vendors': 'الموردين',
    'nav.products': 'المنتجات',
    'nav.rfq': 'طلب تسعير',
    'nav.messages': 'الرسائل',
    'nav.dashboard': 'لوحة التحكم',
    'nav.admin': 'المدير',
    
    // Hero Section
    'hero.title': 'السوق الرائد للبناء في قطر',
    'hero.subtitle': 'تواصل مع موردين موثوقين واحصل على عروض أسعار تنافسية ومواد عالية الجودة لمشاريع البناء والتأثيث المنزلي.',
    'hero.startShopping': 'ابدأ التسوق',
    'hero.createRFQ': 'إنشاء طلب تسعير',
    'hero.trustedVendors': 'موردين موثوقين',
    'hero.products': 'منتج',
    'hero.happyCustomers': 'عميل راضي',
    
    // Categories
    'categories.title': 'تسوق حسب الفئة',
    'categories.subtitle': 'اكتشف مجموعة واسعة من منتجات البناء والتأثيث المنزلي من موردين موثوقين في قطر',
    'categories.decoration': 'الديكور والتصميم',
    'categories.furniture': 'الأثاث والتجهيزات',
    'categories.contracting': 'خدمات المقاولات',
    'categories.electrical': 'المعدات الكهربائية',
    'categories.sanitary': 'الصحي والسباكة',
    'categories.tools': 'الأدوات والمعدات',
    'categories.explore': 'استكشف الفئة',
    
    // Vendors
    'vendors.title': 'موردين مميزين',
    'vendors.subtitle': 'تواصل مع أكثر موردي البناء والتأثيث المنزلي موثوقية في قطر',
    'vendors.searchPlaceholder': 'البحث عن موردين...',
    'vendors.allVendors': 'جميع الموردين',
    'vendors.activeOnly': 'النشطين فقط',
    'vendors.verifiedOnly': 'المعتمدين فقط',
    'vendors.results': 'نتيجة',
    'vendors.filtered': 'مفلتر',
    'vendors.becomeVendor': 'كن مورد',
    'vendors.noResults': 'لم يتم العثور على موردين',
    'vendors.noResultsDesc': 'جرب تعديل معايير البحث أو تصفح جميع الموردين',
    'vendors.clearFilters': 'مسح المرشحات',
    'vendors.loadMore': 'تحميل المزيد',
    'vendors.defaultDesc': 'حلول البناء والتأثيث المنزلي عالية الجودة',
    'vendors.verified': 'معتمد',
    'vendors.viewVendor': 'عرض المورد',
    
    // Sorting
    'sort.rating': 'حسب التقييم',
    'sort.name': 'حسب الاسم',
    'sort.newest': 'الأحدث أولاً',
    
    // RFQ
    'rfq.title': 'تحتاج شيء محدد؟',
    'rfq.subtitle': 'أنشئ طلب تسعير واحصل على عروض تنافسية من موردين معتمدين متعددين.',
    'rfq.createNow': 'إنشاء طلب تسعير الآن',
    'rfq.quickForm': 'نموذج طلب تسعير سريع',
    'rfq.projectType': 'نوع المشروع',
    'rfq.category': 'الفئة',
    'rfq.budget': 'نطاق الميزانية',
    'rfq.description': 'الوصف',
    'rfq.submit': 'إرسال طلب التسعير',
    
    // Trust Indicators
    'trust.title': 'لماذا تختار معمار؟',
    'trust.subtitle': 'نحن ملتزمون بتوفير منصة آمنة وموثوقة لجميع احتياجات البناء والتأثيث المنزلي',
    'trust.verifiedVendors': 'موردين معتمدين',
    'trust.securePayments': 'مدفوعات آمنة',
    'trust.support247': 'دعم على مدار الساعة',
    'trust.fastDelivery': 'توصيل سريع',
    'trust.satisfaction': 'رضا العملاء',
    
    // Footer
    'footer.company': 'السوق الرائد في قطر لحلول البناء والتأثيث المنزلي.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.aboutUs': 'من نحن',
    'footer.howItWorks': 'كيف يعمل',
    'footer.contactUs': 'اتصل بنا',
    'footer.categories': 'الفئات',
    'footer.legal': 'قانوني',
    'footer.terms': 'شروط الخدمة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.cookies': 'سياسة ملفات تعريف الارتباط',
    'footer.returns': 'الإرجاع والاسترداد',
    'footer.kyc': 'سياسة التحقق من الهوية',
    'footer.copyright': '© 2024 معمار. جميع الحقوق محفوظة.',
    'footer.madeInQatar': 'صنع في قطر',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.add': 'إضافة',
    'common.remove': 'إزالة',
    'common.update': 'تحديث',
    'common.submit': 'إرسال',
    'common.close': 'إغلاق',
    'common.yes': 'نعم',
    'common.no': 'لا',
  }
};

export function useLocale(): LocaleContextType {
  const [locale, setLocale] = useState<'en' | 'ar'>(() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('locale') as 'en' | 'ar') || 'en';
    }
    return 'en';
  });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = locale;
    }
  }, [locale, dir]);

  return {
    locale,
    dir,
    toggleLocale,
    t,
  };
}
