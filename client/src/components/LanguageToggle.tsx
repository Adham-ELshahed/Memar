import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLocale();

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-lg border-gray-200 hover:bg-gray-50"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span className="font-medium">{locale.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={locale === 'ar' ? toggleLocale : undefined}
            className={locale === 'en' ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">🇺🇸</span>
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={locale === 'en' ? toggleLocale : undefined}
            className={locale === 'ar' ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">🇶🇦</span>
            العربية
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
