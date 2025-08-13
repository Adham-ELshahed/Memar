import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/Header";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import {
  Building,
  Package,
  ShoppingCart,
  FileText,
  DollarSign,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";

const createProductSchema = insertProductSchema.extend({
  price: z.string().optional(),
});

type CreateProductForm = z.infer<typeof createProductSchema>;

export default function VendorDashboard() {
  const { t } = useLocale();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Redirect to login if not authenticated or not vendor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'vendor')) {
      toast({
        title: "Unauthorized",
        description: "Vendor access required. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Get vendor's organization
  const { data: organization } = useQuery({
    queryKey: ["/api/organizations", { userId: user?.id }],
    queryFn: async () => {
      const organizations = await apiRequest("GET", "/api/organizations");
      return organizations?.find((org: any) => org.userId === user?.id);
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

  // Get vendor's products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { organizationId: organization?.id }],
    enabled: !!organization?.id,
    select: (data) => data || [],
  });

  // Get vendor's orders
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders", { organizationId: organization?.id }],
    enabled: !!organization?.id,
    select: (data) => data || [],
  });

  // Get categories for product creation
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    select: (data) => data || [],
  });

  // Product form
  const form = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      currency: "QAR",
      stockQuantity: 0,
      minOrderQuantity: 1,
      isActive: true,
      organizationId: organization?.id || "",
    },
  });

  // Update organizationId when organization is loaded
  useEffect(() => {
    if (organization?.id) {
      form.setValue("organizationId", organization.id);
    }
  }, [organization?.id, form]);

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductForm) => {
      const payload = {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        organizationId: organization?.id,
      };
      return apiRequest("POST", "/api/products", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      form.reset();
      setShowAddProduct(false);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
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
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateProductForm) => {
    createProductMutation.mutate(data);
  };

  // Dashboard stats
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p: any) => p.isActive).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
    completedOrders: orders.filter((o: any) => o.status === 'delivered').length,
    totalRevenue: orders
      .filter((o: any) => o.status === 'delivered')
      .reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount || 0), 0),
  };

  const dashboardCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      change: `${stats.activeProducts} active`,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      change: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Revenue",
      value: `QAR ${stats.totalRevenue.toLocaleString()}`,
      change: "This month",
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      title: "Status",
      value: organization?.status || "Unknown",
      change: organization?.rating ? `${organization.rating}★ rating` : "No rating",
      icon: Building,
      color: "text-purple-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'vendor') {
    return null; // Will redirect via useEffect
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="text-center py-16">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Vendor Profile</h2>
              <p className="text-gray-600 mb-8">
                To access your vendor dashboard, you need to complete your organization profile first.
              </p>
              <Button onClick={() => window.location.href = "/vendor/onboarding"}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {organization?.legalName}. Manage your business on the platform.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(organization.status)}>
                {organization.status}
              </Badge>
              {organization.status === 'pending' && (
                <div className="text-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-amber-600">Approval pending</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardCards.map((card, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{card.change}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${card.color}`}>
                        <card.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">QAR {order.totalAmount}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setShowAddProduct(true)} className="h-20 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      Add Product
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      View RFQs
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      Messages
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Products Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <Button onClick={() => setShowAddProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                              </FormControl>
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

                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (QAR)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter price"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stockQuantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock Quantity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter stock quantity"
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter SKU" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="minOrderQuantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Order Quantity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="1"
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your product..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowAddProduct(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createProductMutation.isPending}
                        >
                          {createProductMutation.isPending ? "Creating..." : "Create Product"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <Card>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-lg font-bold text-primary">
                                QAR {product.price}
                              </span>
                              <Badge variant={product.isActive ? "default" : "secondary"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Stock: {product.stockQuantity}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first product to the marketplace.</p>
                    <Button onClick={() => setShowAddProduct(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{order.orderNumber}</h4>
                          <p className="text-sm text-gray-600">Amount: QAR {order.totalAmount}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={`
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders from customers will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={organization.logoUrl} />
                      <AvatarFallback className="text-2xl">
                        {organization.legalName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">{organization.legalName}</h3>
                      <p className="text-gray-600">{organization.tradeName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={getStatusColor(organization.status)}>
                          {organization.status}
                        </Badge>
                        {organization.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{organization.rating} ({organization.reviewCount} reviews)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Email:</span> {organization.email}</p>
                        <p><span className="text-gray-600">Phone:</span> {organization.phone}</p>
                        <p><span className="text-gray-600">Website:</span> {organization.website || "Not provided"}</p>
                        <p><span className="text-gray-600">Address:</span> {organization.address || "Not provided"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Business Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Commercial Registration:</span> {organization.commercialRegistration || "Not provided"}</p>
                        <p><span className="text-gray-600">Tax Number:</span> {organization.taxNumber || "Not provided"}</p>
                        <p><span className="text-gray-600">City:</span> {organization.city || "Not provided"}</p>
                        <p><span className="text-gray-600">Member Since:</span> {new Date(organization.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{organization.description || "No description provided."}</p>
                  </div>

                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Sales Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-16">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Sales analytics dashboard will be available soon.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customer Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Customer insights will be available soon.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
