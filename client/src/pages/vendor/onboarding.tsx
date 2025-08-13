import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrganizationSchema } from "@shared/schema";
import { z } from "zod";
import type { UploadResult } from "@uppy/core";
import {
  Building,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Hash,
  CreditCard,
  User,
  Camera,
  ShieldCheck,
  Clock
} from "lucide-react";

const onboardingSchema = insertOrganizationSchema.extend({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const STEPS = [
  { id: 1, name: "Basic Information", icon: Building },
  { id: 2, name: "Business Documents", icon: FileText },
  { id: 3, name: "Verification", icon: ShieldCheck },
  { id: 4, name: "Review & Submit", icon: CheckCircle },
];

export default function VendorOnboarding() {
  const { t } = useLocale();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [logoUrl, setLogoUrl] = useState("");
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access vendor onboarding.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check if user already has an organization
  const { data: existingOrganization } = useQuery({
    queryKey: ["/api/organizations", { userId: user?.id }],
    queryFn: async () => {
      if (!user?.id) return null;
      const organizations = await apiRequest("GET", "/api/organizations");
      return organizations?.find((org: any) => org.userId === user.id);
    },
    enabled: !!user?.id,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    }
  });

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      legalName: "",
      tradeName: "",
      description: "",
      email: user?.email || "",
      phone: "",
      website: "",
      address: "",
      city: "",
      commercialRegistration: "",
      taxNumber: "",
      acceptTerms: false,
    },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      const organizationData = {
        ...data,
        userId: user?.id,
        logoUrl: logoUrl || undefined,
        status: 'pending' as const,
      };
      delete organizationData.acceptTerms;
      return apiRequest("POST", "/api/organizations", organizationData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your vendor application has been submitted successfully. We'll review it within 24-48 hours.",
      });
      setTimeout(() => {
        window.location.href = "/vendor/dashboard";
      }, 2000);
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = async () => {
    const response = await apiRequest("POST", "/api/objects/upload", {});
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const handleLogoUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful[0]) {
      const uploadedUrl = result.successful[0].uploadURL;
      try {
        const response = await apiRequest("PUT", "/api/upload/logo", {
          logoUrl: uploadedUrl,
        });
        setLogoUrl(response.objectPath);
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to save logo",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: OnboardingForm) => {
    createOrganizationMutation.mutate(data);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const progress = (currentStep / STEPS.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // If user already has an organization, redirect to dashboard
  if (existingOrganization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="text-center py-16">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Already Submitted</h2>
              <p className="text-gray-600 mb-2">
                Your vendor application is currently <Badge className="mx-1">{existingOrganization.status}</Badge>
              </p>
              {existingOrganization.status === 'pending' && (
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-amber-600">Under review - typically takes 24-48 hours</span>
                </div>
              )}
              <div className="space-x-4">
                <Button onClick={() => window.location.href = "/vendor/dashboard"}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Become a Vendor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join Qatar's premier construction marketplace and connect with thousands of buyers.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-full h-1 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {STEPS.map((step) => (
              <span key={step.id} className={currentStep === step.id ? 'font-semibold text-primary' : ''}>
                {step.name}
              </span>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-6 w-6 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Camera className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo (Coming Soon)
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Upload your company logo (PNG, JPG up to 5MB)</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="legalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            Legal Company Name *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Trading Company LLC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tradeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Trading" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Business Email *
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="business@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+974 XXXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Website (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            City
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Doha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Business Address
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Building XX, Street Name, Area, Doha, Qatar"
                            className="min-h-[60px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your business, services, and expertise..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Business Documents */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2" />
                    Business Documents & Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="commercialRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Hash className="h-4 w-4 mr-2" />
                            Commercial Registration Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="CR-XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taxNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Tax Registration Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Tax-XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
                    <p className="text-sm text-gray-600">
                      Please upload the following documents for verification (PDF format preferred):
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Commercial Registration</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Valid commercial registration certificate from Qatar
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          onGetUploadParameters={handleLogoUpload}
                          onComplete={(result) => {
                            toast({
                              title: "Success",
                              description: "Commercial registration uploaded",
                            });
                          }}
                          buttonClassName="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload CR Document
                        </ObjectUploader>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Tax Certificate</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Tax registration certificate (if applicable)
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          onGetUploadParameters={handleLogoUpload}
                          onComplete={(result) => {
                            toast({
                              title: "Success",
                              description: "Tax certificate uploaded",
                            });
                          }}
                          buttonClassName="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Tax Certificate
                        </ObjectUploader>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Company Profile</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Company brochure or detailed profile (optional)
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          onGetUploadParameters={handleLogoUpload}
                          onComplete={(result) => {
                            toast({
                              title: "Success",
                              description: "Company profile uploaded",
                            });
                          }}
                          buttonClassName="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Profile
                        </ObjectUploader>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Bank Details</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Bank account details or certificate (optional)
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          onGetUploadParameters={handleLogoUpload}
                          onComplete={(result) => {
                            toast({
                              title: "Success",
                              description: "Bank details uploaded",
                            });
                          }}
                          buttonClassName="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Bank Details
                        </ObjectUploader>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-6 w-6 mr-2" />
                    Verification Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-blue-900">KYC Verification Process</h3>
                    </div>
                    <p className="text-blue-800 text-sm">
                      Your application will undergo a thorough verification process to ensure platform security and trust. This includes:
                    </p>
                    <ul className="list-disc list-inside text-blue-800 text-sm mt-2 space-y-1">
                      <li>Document authenticity verification</li>
                      <li>Business registration validation</li>
                      <li>Contact information verification</li>
                      <li>Background checks (if required)</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Verification Checklist</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Basic information provided</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Valid email address</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {form.getValues("commercialRegistration") ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                        <span className="text-sm">Commercial registration number provided</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {logoUrl ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                        <span className="text-sm">Company logo uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-amber-600 mr-2" />
                      <h3 className="font-semibold text-amber-900">Processing Time</h3>
                    </div>
                    <p className="text-amber-800 text-sm">
                      Verification typically takes 24-48 hours. You'll receive email updates throughout the process.
                      Once approved, you can start listing products and receiving orders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Review & Submit Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Application Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Company Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Legal Name:</span> {form.getValues("legalName") || "Not provided"}</p>
                          <p><span className="text-gray-600">Trade Name:</span> {form.getValues("tradeName") || "Same as legal name"}</p>
                          <p><span className="text-gray-600">Email:</span> {form.getValues("email")}</p>
                          <p><span className="text-gray-600">Phone:</span> {form.getValues("phone") || "Not provided"}</p>
                          <p><span className="text-gray-600">City:</span> {form.getValues("city") || "Not provided"}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Business Registration</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">CR Number:</span> {form.getValues("commercialRegistration") || "Not provided"}</p>
                          <p><span className="text-gray-600">Tax Number:</span> {form.getValues("taxNumber") || "Not provided"}</p>
                          <p><span className="text-gray-600">Logo:</span> {logoUrl ? "Uploaded" : "Not uploaded"}</p>
                        </div>
                      </div>
                    </div>

                    {form.getValues("description") && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Business Description</h4>
                        <p className="text-sm text-gray-600">{form.getValues("description")}</p>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start space-x-3">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div>
                            <FormLabel className="text-sm">
                              I accept the <a href="/terms" className="text-primary hover:underline" target="_blank">Terms and Conditions</a> and <a href="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</a> *
                            </FormLabel>
                            <p className="text-xs text-gray-500 mt-1">
                              By checking this box, you agree to our platform policies and confirm that all information provided is accurate.
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-900">Ready to Submit</h3>
                    </div>
                    <p className="text-green-800 text-sm">
                      Your application is complete and ready for submission. After review and approval, you'll be able to:
                    </p>
                    <ul className="list-disc list-inside text-green-800 text-sm mt-2 space-y-1">
                      <li>List products and services</li>
                      <li>Receive and respond to RFQs</li>
                      <li>Manage orders and customer communications</li>
                      <li>Access vendor dashboard and analytics</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createOrganizationMutation.isPending || !form.watch("acceptTerms")}
                  className="flex items-center"
                >
                  {createOrganizationMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you through the onboarding process.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-primary mr-2" />
                  <span>+974 4444 5555</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-primary mr-2" />
                  <span>vendor-support@meamar.qa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
