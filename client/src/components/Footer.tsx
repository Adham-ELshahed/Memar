import { Link } from "wouter";
import { useLocale } from "@/hooks/useLocale";

export default function Footer() {
  const { t, isRTL } = useLocale();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">Meamar</div>
              <p className="text-gray-300">{t("footer.description")}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-primary"></i>
                <span className="text-gray-300">Doha, Qatar</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-primary"></i>
                <span className="text-gray-300">+974 4444 5555</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-primary"></i>
                <span className="text-gray-300">support@meamar.qa</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-primary transition-colors">{t("footer.aboutUs")}</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-primary transition-colors">{t("footer.howItWorks")}</Link></li>
              <li><Link href="/vendor/onboarding" className="text-gray-300 hover:text-primary transition-colors">{t("footer.becomeVendor")}</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-primary transition-colors">{t("footer.helpCenter")}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-primary transition-colors">{t("footer.contactUs")}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.categories")}</h3>
            <ul className="space-y-3">
              <li><Link href="/categories/decoration" className="text-gray-300 hover:text-primary transition-colors">{t("categories.decoration")}</Link></li>
              <li><Link href="/categories/furniture" className="text-gray-300 hover:text-primary transition-colors">{t("categories.furniture")}</Link></li>
              <li><Link href="/categories/contracting" className="text-gray-300 hover:text-primary transition-colors">{t("categories.contracting")}</Link></li>
              <li><Link href="/categories/electrical" className="text-gray-300 hover:text-primary transition-colors">{t("categories.electrical")}</Link></li>
              <li><Link href="/categories/sanitary" className="text-gray-300 hover:text-primary transition-colors">{t("categories.sanitary")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.legal")}</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-gray-300 hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/cookies" className="text-gray-300 hover:text-primary transition-colors">{t("footer.cookies")}</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-primary transition-colors">{t("footer.returns")}</Link></li>
              <li><Link href="/kyc" className="text-gray-300 hover:text-primary transition-colors">{t("footer.kyc")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 Meamar. {t("footer.allRightsReserved")}
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=20" 
                alt="Qatar Flag" 
                className="w-8 h-5 rounded"
              />
              <span className="text-gray-400 text-sm">{t("footer.madeInQatar")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
