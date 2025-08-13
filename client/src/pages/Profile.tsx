import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { ObjectUploader } from '@/components/ObjectUploader';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Building2, 
  Shield, 
  Settings,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImageUrl: '',
  });

  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    street: '',
    city: 'Doha',
    state: '',
    zipCode: '',
    country: 'Qatar',
    isDefault: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to view your profile.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, authLoading, toast]);

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImageUrl: user.profileImageUrl || '',
      });
    }
  }, [user]);

  // Fetch user addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['/api/addresses'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', '/api/auth/user', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
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
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (addressData: any) => {
      const response = await apiRequest('POST', '/api/addresses', addressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/addresses'] });
      setNewAddress({
        type: 'shipping',
        street: '',
        city: 'Doha',
        state: '',
        zipCode: '',
        country: 'Qatar',
        isDefault: false,
      });
      toast({
        title: "Address Added",
        description: "Your address has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add address. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street.trim()) {
      toast({
        title: "Missing Information",
        description: "Street address is required.",
        variant: "destructive",
      });
      return;
    }
    addAddressMutation.mutate(newAddress);
  };

  const handleProfileImageUpload = async () => {
    try {
      const response = await apiRequest('POST', '/api/objects/upload');
      const { uploadURL } = await response.json();
      return {
        method: 'PUT' as const,
        url: uploadURL,
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to get upload URL",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      
      try {
        // Set ACL policy for the uploaded image
        const aclResponse = await apiRequest('PUT', '/api/files', {
          fileURL: uploadedFile.uploadURL,
          visibility: 'public', // Profile images should be public
        });
        const { objectPath } = await aclResponse.json();
        
        // Update profile with new image URL
        setProfileData(prev => ({ ...prev, profileImageUrl: objectPath }));
        
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been uploaded successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to set image permissions",
          variant: "destructive",
        });
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LanguageToggle />
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageToggle />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and personal information
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileData.profileImageUrl} />
                      <AvatarFallback className="text-lg">
                        {profileData.firstName?.[0] || profileData.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={5 * 1024 * 1024} // 5MB
                          onGetUploadParameters={handleProfileImageUpload}
                          onComplete={handleUploadComplete}
                          buttonClassName="flex items-center space-x-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Change Photo</span>
                        </ObjectUploader>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="+974 XXXX XXXX"
                      />
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Role</Label>
                        <div className="mt-1">
                          <Badge variant="outline" className="capitalize">
                            {user?.role || 'buyer'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label>KYC Status</Label>
                        <div className="mt-1">
                          <Badge 
                            variant={user?.kycStatus === 'approved' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {user?.kycStatus || 'pending'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Member Since</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <Label>Language Preference</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {user?.locale === 'ar' ? 'Arabic' : 'English'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses">
            <div className="space-y-6">
              {/* Existing Addresses */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                </CardHeader>
                <CardContent>
                  {addressesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <Skeleton className="h-4 w-1/4 mb-2" />
                          <Skeleton className="h-3 w-3/4 mb-1" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No addresses saved yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address: Address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="capitalize">
                                  {address.type}
                                </Badge>
                                {address.isDefault && (
                                  <Badge>Default</Badge>
                                )}
                              </div>
                              <p className="text-gray-900">{address.street}</p>
                              <p className="text-gray-600">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add New Address */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Add New Address</h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addressType">Address Type</Label>
                        <select
                          id="addressType"
                          value={newAddress.type}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="shipping">Shipping</option>
                          <option value="billing">Billing</option>
                          <option value="business">Business</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Textarea
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="Enter your full address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Region</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isDefault">Set as default address</Label>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={addAddressMutation.isPending}
                    >
                      {addAddressMutation.isPending ? 'Adding...' : 'Add Address'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Security Settings</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Account Security</h3>
                  </div>
                  <p className="text-blue-700 mt-1">
                    Your account is secured with Replit authentication. 
                    Security settings are managed through your Replit account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600">Managed by Replit authentication</p>
                    </div>
                    <Button variant="outline" disabled>
                      Managed Externally
                    </Button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Extra security for your account</p>
                    </div>
                    <Button variant="outline" disabled>
                      Managed Externally
                    </Button>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-gray-600">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Preferences</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h4 className="font-medium">Language</h4>
                      <p className="text-sm text-gray-600">Choose your preferred language</p>
                    </div>
                    <Badge variant="outline">
                      {user?.locale === 'ar' ? 'Arabic' : 'English'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about your orders and RFQs</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>

                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get text messages for important updates</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
