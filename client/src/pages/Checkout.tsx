import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, Truck, MapPin, Package } from 'lucide-react';
import { Link } from 'wouter';

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface CheckoutFormProps {
  cart: any;
  onSuccess: () => void;
}

function CheckoutForm({ cart, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: 'Doha',
    zipCode: '',
    notes: '',
  });

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum: number, item: any) => 
    sum + (parseFloat(item.priceAtAdd) * item.quantity), 0
  );
  const tax = subtotal * 0.05;
  const shippingCost = deliveryMethod === 'delivery' ? 25 : 0;
  const total = subtotal + tax + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingAddress.street && deliveryMethod === 'delivery') {
      toast({
        title: "Missing Address",
        description: "Please provide a delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const orderData = {
        subtotal: subtotal.toString(),
        taxAmount: tax.toString(),
        shippingAmount: shippingCost.toString(),
        total: total.toString(),
        currency: 'QAR',
        deliveryMethod,
        shippingAddress: deliveryMethod === 'delivery' ? shippingAddress : null,
        notes: shippingAddress.notes,
        items: cartItems.map((item: any) => ({
          productId: item.productId,
          name: item.product?.name || 'Product',
          quantity: item.quantity,
          unitPrice: item.priceAtAdd,
          total: (parseFloat(item.priceAtAdd) * item.quantity).toString(),
        })),
      };

      const orderResponse = await apiRequest('POST', '/api/orders', orderData);
      const order = await orderResponse.json();

      // Create payment intent
      const paymentResponse = await apiRequest('POST', '/api/create-payment-intent', {
        amount: total,
        currency: 'qar',
        orderId: order.id,
      });
      const { clientSecret } = await paymentResponse.json();

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${order.id}?payment=success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully!",
        });
        onSuccess();
      }
    } catch (error: any) {
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
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Delivery Method
          </h3>
        </CardHeader>
        <CardContent>
          <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="delivery" id="delivery" />
              <div className="flex-1">
                <Label htmlFor="delivery" className="font-medium">Home Delivery</Label>
                <p className="text-sm text-gray-600">Delivered to your address</p>
              </div>
              <span className="font-semibold">QAR 25</span>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="pickup" id="pickup" />
              <div className="flex-1">
                <Label htmlFor="pickup" className="font-medium">Store Pickup</Label>
                <p className="text-sm text-gray-600">Collect from vendor location</p>
              </div>
              <span className="font-semibold">Free</span>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      {deliveryMethod === 'delivery' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Delivery Address
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Textarea
                id="street"
                placeholder="Enter your full address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Optional"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                placeholder="Any special delivery instructions..."
                rows={2}
                value={shippingAddress.notes}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Method
          </h3>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Order Summary</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>QAR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>VAT (5%)</span>
            <span>QAR {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>QAR {shippingCost.toLocaleString()}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>QAR {total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Place Order - QAR ${total.toLocaleString()}`}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['/api/cart'],
    enabled: isAuthenticated,
    retry: false,
  });

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

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LanguageToggle />
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Not Available</h3>
              <p className="text-gray-600">Payment processing is currently not configured.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const cartItems = cart?.items || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LanguageToggle />
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LanguageToggle />
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? 'Error Loading Cart' : 'Your cart is empty'}
              </h3>
              <p className="text-gray-600 mb-6">
                {error 
                  ? 'We\'re having trouble loading your cart. Please try again later.'
                  : 'Add items to your cart before checking out.'
                }
              </p>
              <Button size="lg" asChild>
                <Link href={error ? "/cart" : "/products"}>
                  {error ? 'Go to Cart' : 'Continue Shopping'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageToggle />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-lg text-gray-600">
            Complete your order and proceed with payment
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm 
            cart={cart} 
            onSuccess={() => {
              // Redirect to orders page or success page
              setTimeout(() => {
                window.location.href = '/orders';
              }, 1000);
            }}
          />
        </Elements>
      </main>

      <Footer />
    </div>
  );
}
