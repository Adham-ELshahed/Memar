import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import LanguageToggle from "./LanguageToggle";
import { 
  Bell, 
  MessageCircle, 
  ShoppingCart, 
  Search,
  Menu,
  Phone,
  Mail,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocale();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <LanguageToggle />
      
      {/* Top Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Phone className="h-4 w-4 text-primary mr-2" />
                +974 4444 5555
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 text-primary mr-2" />
                support@meamar.qa
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:text-primary transition-colors">
                {t('header.helpCenter')}
              </Link>
              <Link href="/vendor/onboarding" className="hover:text-primary transition-colors">
                {t('header.becomeVendor')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary">Meamar</div>
            <Badge variant="secondary" className="ml-2 text-xs">QATAR</Badge>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-400 hover:text-primary p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <MessageCircle className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">2</Badge>
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-accent text-accent-foreground">5</Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || ''} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="w-full">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/rfqs" className="w-full">My RFQs</Link>
                </DropdownMenuItem>
                {user?.role === 'vendor' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/vendor/dashboard" className="w-full">Vendor Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="w-full">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="w-full">Logout</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8 py-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center space-x-1 font-medium text-gray-700 hover:text-primary">
                  <Menu className="h-4 w-4" />
                  <span>{t('header.categories')}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <Link href="/categories/decoration" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">{t('header.decoration')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Paint, wallpaper, lighting & decorative items
                      </p>
                    </Link>
                    <Link href="/categories/furniture" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">{t('header.furniture')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Office, home & commercial furniture solutions
                      </p>
                    </Link>
                    <Link href="/categories/contracting" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">{t('header.contracting')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        General contracting & specialized construction
                      </p>
                    </Link>
                    <Link href="/categories/electrical" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">{t('header.electrical')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Wiring, fixtures, panels & electrical components
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link href="/categories/decoration" className={`font-medium transition-colors ${location === '/categories/decoration' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            {t('header.decoration')}
          </Link>
          <Link href="/categories/furniture" className={`font-medium transition-colors ${location === '/categories/furniture' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            {t('header.furniture')}
          </Link>
          <Link href="/categories/contracting" className={`font-medium transition-colors ${location === '/categories/contracting' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            {t('header.contracting')}
          </Link>
          <Link href="/categories/electrical" className={`font-medium transition-colors ${location === '/categories/electrical' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            {t('header.electrical')}
          </Link>
          <Link href="/categories/sanitary" className={`font-medium transition-colors ${location === '/categories/sanitary' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            {t('header.sanitary')}
          </Link>
          <Link href="/rfq" className={`font-medium transition-colors ${location === '/rfq' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            {t('header.rfqCenter')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
