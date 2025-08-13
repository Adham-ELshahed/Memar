export const translations = {
  en: {
    // Header
    'header.support': 'Support',
    'header.becomeVendor': 'Become a Vendor',
    'header.helpCenter': 'Help Center',
    'header.searchPlaceholder': 'Search for products, services, or vendors...',
    
    // Navigation
    'nav.home': 'Home',
    'nav.vendors': 'Vendors',
    'nav.products': 'Products',
    'nav.rfq': 'RFQ',
    'nav.messages': 'Messages',
    'nav.dashboard': 'Dashboard',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
  ar: {
    // Header
    'header.support': 'الدعم',
    'header.becomeVendor': 'كن مورد',
    'header.helpCenter': 'مركز المساعدة',
    'header.searchPlaceholder': 'البحث عن المنتجات أو الخدمات أو الموردين...',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.vendors': 'الموردين',
    'nav.products': 'المنتجات',
    'nav.rfq': 'طلب تسعير',
    'nav.messages': 'الرسائل',
    'nav.dashboard': 'لوحة التحكم',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
  }
};

export type TranslationKey = keyof typeof translations.en;
