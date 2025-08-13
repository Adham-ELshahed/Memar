import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Vendors from "@/pages/vendors";
import Products from "@/pages/products";
import RFQ from "@/pages/rfq";
import Messages from "@/pages/messages";
import VendorDashboard from "@/pages/vendor/dashboard";
import VendorOnboarding from "@/pages/vendor/onboarding";
import AdminDashboard from "@/pages/admin/dashboard";

const queryClient = new QueryClient();

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { locale, dir } = useLocale();

  // Set document direction and language
  if (typeof document !== 'undefined') {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/products" component={Products} />
          <Route path="/rfq" component={RFQ} />
          <Route path="/messages" component={Messages} />
          
          {user?.role === 'vendor' && (
            <>
              <Route path="/vendor/dashboard" component={VendorDashboard} />
              <Route path="/vendor/onboarding" component={VendorOnboarding} />
            </>
          )}
          
          {user?.role === 'admin' && (
            <Route path="/admin/dashboard" component={AdminDashboard} />
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
