import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRfqSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  FileText, 
  Plus, 
  Calendar,
  DollarSign,
  Clock,
  Building,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit
} from "lucide-react";

const createRfqSchema = insertRfqSchema.extend({
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
});

type CreateRfqForm = z.infer<typeof createRfqSchema>;

export default function RFQ() {
  const { t } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"create" | "my-rfqs">("my-rfqs");

  const form = useForm<CreateRfqForm>({
    resolver: zodResolver(createRfqSchema),
    defaultValues: {
      title: "",
      description: "",
      projectType: "",
      budgetMin: "",
      budgetMax: "",
      currency: "QAR",
      status: "draft",
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    select: (data) => data || [],
  });

  const { data: myRfqs = [], isLoading: rfqsLoading } = useQuery({
    queryKey: ["/api/rfqs", { userId: user?.id }],
    select: (data) => data || [],
  });

  const createRfqMutation = useMutation({
    mutationFn: async (data: CreateRfqForm) => {
      const payload = {
        ...data,
        budgetMin: data.budgetMin ? parseFloat(data.budgetMin) : undefined,
        budgetMax: data.budgetMax ? parseFloat(data.budgetMax) : undefined,
      };
      return apiRequest("POST", "/api/rfqs", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "RFQ created successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/rfqs"] });
      setActiveTab("my-rfqs");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create RFQ",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateRfqForm) => {
    createRfqMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "published": return "bg-blue-100 text-blue-800";
      case "closed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Edit className="h-4 w-4" />;
      case "published": return <Eye className="h-4 w-4" />;
      case "closed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Request for Quote (RFQ)</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Create detailed RFQs to get competitive quotes from multiple verified vendors across Qatar
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("my-rfqs")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "my-rfqs"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My RFQs ({myRfqs.length})
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "create"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Create New RFQ
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "create" ? (
          /* Create RFQ Form */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create New RFQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RFQ Title *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Office Renovation - Electrical Work"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="commercial">Commercial Building</SelectItem>
                                <SelectItem value="residential">Residential Home</SelectItem>
                                <SelectItem value="office">Office Fit-out</SelectItem>
                                <SelectItem value="renovation">Renovation</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category: any) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="budgetMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Budget (QAR)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="5000"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="budgetMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Budget (QAR)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="25000"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Doha, Qatar"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide detailed description of your requirements, specifications, timeline, and any other relevant information..."
                                className="min-h-[200px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deadline</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local"
                                {...field}
                                value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Requirements JSON field - simplified for now */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700">Additional Requirements</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="material-supply" className="rounded" />
                            <label htmlFor="material-supply" className="text-sm">Material Supply</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="installation" className="rounded" />
                            <label htmlFor="installation" className="text-sm">Installation Required</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="warranty" className="rounded" />
                            <label htmlFor="warranty" className="text-sm">Warranty Required</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="maintenance" className="rounded" />
                            <label htmlFor="maintenance" className="text-sm">Maintenance Service</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue("status", "draft")}
                      >
                        Save as Draft
                      </Button>
                      <Button 
                        type="submit"
                        onClick={() => form.setValue("status", "published")}
                        disabled={createRfqMutation.isPending}
                      >
                        {createRfqMutation.isPending ? "Publishing..." : "Publish RFQ"}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Published RFQs will be visible to all verified vendors
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          /* My RFQs List */
          <div className="space-y-6">
            {rfqsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : myRfqs.length > 0 ? (
              myRfqs.map((rfq: any) => (
                <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{rfq.title}</h3>
                          <Badge className={`${getStatusColor(rfq.status)} flex items-center space-x-1`}>
                            {getStatusIcon(rfq.status)}
                            <span className="capitalize">{rfq.status}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{rfq.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{rfq.projectType || "Not specified"}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>
                              {rfq.budgetMin && rfq.budgetMax 
                                ? `${rfq.currency} ${rfq.budgetMin} - ${rfq.budgetMax}`
                                : "Budget negotiable"
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {rfq.deadline 
                                ? new Date(rfq.deadline).toLocaleDateString()
                                : "No deadline"
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              Created {new Date(rfq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Responses
                        </Button>
                      </div>
                    </div>

                    {rfq.location && (
                      <div className="text-sm text-gray-500 mb-2">
                        📍 {rfq.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <FileText className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No RFQs yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first RFQ to start receiving quotes from verified vendors
                  </p>
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First RFQ
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
