import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, FileText, Calendar, MapPin, DollarSign, Clock, Eye } from 'lucide-react';
import { Link } from 'wouter';

interface RFQ {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: string;
  deliveryLocation: string;
  dueDate: string;
  createdAt: string;
  categoryId: string;
}

export default function RFQs() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to view your RFQs.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: rfqsData, isLoading, error } = useQuery({
    queryKey: ['/api/rfqs'],
    enabled: isAuthenticated,
    retry: false,
  });

  const cancelRFQMutation = useMutation({
    mutationFn: async (rfqId: string) => {
      await apiRequest('PATCH', `/api/rfqs/${rfqId}`, { status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rfqs'] });
      toast({
        title: "RFQ Cancelled",
        description: "Your RFQ has been cancelled successfully.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to cancel RFQ. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LanguageToggle />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const rfqs = rfqsData?.rfqs || [];
  const totalRFQs = rfqsData?.total || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'quoted': return 'bg-blue-100 text-blue-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-QA' : 'en-QA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageToggle />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My RFQs
            </h1>
            <p className="text-lg text-gray-600">
              Manage your requests for quotes and track vendor responses
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/rfqs/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New RFQ
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{rfqs.filter((r: RFQ) => r.status === 'open').length}</div>
              <div className="text-sm text-gray-600">Open RFQs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{rfqs.filter((r: RFQ) => r.status === 'quoted').length}</div>
              <div className="text-sm text-gray-600">Quoted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{rfqs.filter((r: RFQ) => r.status === 'awarded').length}</div>
              <div className="text-sm text-gray-600">Awarded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">{totalRFQs}</div>
              <div className="text-sm text-gray-600">Total RFQs</div>
            </CardContent>
          </Card>
        </div>

        {/* RFQs List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading RFQs</h3>
              <p className="text-gray-600 mb-4">We're having trouble loading your RFQs. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : rfqs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No RFQs yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't created any requests for quotes yet. Start by creating your first RFQ.
              </p>
              <Button size="lg" asChild>
                <Link href="/rfqs/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First RFQ
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rfqs.map((rfq: RFQ) => (
              <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rfq.title}
                        </h3>
                        <Badge className={getStatusColor(rfq.status)}>
                          {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {rfq.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {rfq.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <span>Budget: QAR {parseFloat(rfq.budget).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="truncate">{rfq.deliveryLocation}</span>
                    </div>
                    {rfq.dueDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                        <span>Due: {formatDate(rfq.dueDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-purple-600" />
                      <span>Created: {formatDate(rfq.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/rfqs/${rfq.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      {rfq.status === 'quoted' && (
                        <Button size="sm" asChild>
                          <Link href={`/rfqs/${rfq.id}/quotes`}>
                            View Quotes
                          </Link>
                        </Button>
                      )}
                    </div>
                    
                    {rfq.status === 'open' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelRFQMutation.mutate(rfq.id)}
                        disabled={cancelRFQMutation.isPending}
                      >
                        {cancelRFQMutation.isPending ? 'Cancelling...' : 'Cancel RFQ'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
