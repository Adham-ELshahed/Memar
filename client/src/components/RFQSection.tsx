import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';

export function RFQSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    categoryId: '',
    budget: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an RFQ",
        variant: "destructive",
      });
      return;
    }

    if (!formData.projectType || !formData.categoryId || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const rfqData = {
        title: `${formData.projectType} - RFQ`,
        description: formData.description,
        categoryId: formData.categoryId,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        deliveryLocation: 'Doha, Qatar', // Default location
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        items: [], // Quick RFQ doesn't have specific items
      };

      await apiRequest('POST', '/api/rfqs', rfqData);
      
      toast({
        title: "RFQ Created Successfully",
        description: "Vendors will be notified and you'll receive quotes soon",
      });
      
      // Reset form
      setFormData({
        projectType: '',
        categoryId: '',
        budget: '',
        description: '',
      });
    } catch (error: any) {
      toast({
        title: "Error Creating RFQ",
        description: error.message || "Failed to create RFQ. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {t('rfq.title', 'Need Something Specific?')}
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                {t('rfq.subtitle', 'Create a Request for Quote (RFQ) and get competitive offers from multiple verified vendors.')}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-100">Compare quotes from multiple vendors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-100">Get competitive pricing on bulk orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-100">Negotiate terms directly with suppliers</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                asChild
              >
                <Link href="/rfqs/new">Create RFQ Now</Link>
              </Button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick RFQ Form</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </Label>
                  <Select 
                    value={formData.projectType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial Building</SelectItem>
                      <SelectItem value="residential">Residential Home</SelectItem>
                      <SelectItem value="office">Office Fit-out</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decoration">Decoration & Design</SelectItem>
                      <SelectItem value="furniture">Furniture & Fixtures</SelectItem>
                      <SelectItem value="electrical">Electrical Supplies</SelectItem>
                      <SelectItem value="sanitary">Sanitary & Plumbing</SelectItem>
                      <SelectItem value="contracting">Contracting Services</SelectItem>
                      <SelectItem value="tools">Tools & Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range (QAR)
                  </Label>
                  <Select 
                    value={formData.budget} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5000">QAR 5,000 - 25,000</SelectItem>
                      <SelectItem value="25000">QAR 25,000 - 100,000</SelectItem>
                      <SelectItem value="100000">QAR 100,000 - 500,000</SelectItem>
                      <SelectItem value="500000">QAR 500,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your requirements in detail..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit RFQ'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
