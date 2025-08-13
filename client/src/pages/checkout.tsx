import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocale } from "@/hooks/useLocale";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/orders',
      },
    });

    if (error) {
      toast({
        title: t("checkout.paymentFailed"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("checkout.paymentSuccessful"),
        description: t("checkout.thankYou"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="w-full mt-6" disabled={!stripe}>
        {t("checkout.completePayment")}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  const { data: cart } = useQuery({
    queryKey: ["/api/cart"],
  });

  const { data: addresses } = useQuery({
    queryKey: ["/api/addresses"],
  });

  const createPaymentIntent = useMutation({
    mutationFn: async (orderTotal: number) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: orderTotal 
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      // Calculate order total
      const subtotal = cart.items.reduce((sum: number, item: any) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);
      
      const tax = subtotal * 0.05; // 5% tax
      const shipping = 50; // QAR 50 shipping
      const total = subtotal + tax + shipping;

      setOrderData({
        items: cart.items,
        subtotal,
        tax,
        shipping,
        total,
      });

      // Create payment intent
      createPaymentIntent.mutate(total);
    }
  }, [cart]);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-shopping-cart text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("cart.empty")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("cart.emptyDesc")}
            </p>
            <Button onClick={() => window.location.href = "/products"}>
              {t("cart.continueShopping")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("checkout.title")}</h1>
          <p className="text-lg text-gray-600">
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Items */}
                <div className="space-y-4">
                  {cart.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 bg-gray-200 rounded-lg"
                        style={{
                          backgroundImage: item.image ? `url('${item.image}')` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {t("checkout.quantity")}: {item.quantity} x QAR {parseFloat(item.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="font-semibold">
                        QAR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("checkout.subtotal")}</span>
                    <span>QAR {orderData?.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("checkout.tax")}</span>
                    <span>QAR {orderData?.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("checkout.shipping")}</span>
                    <span>QAR {orderData?.shipping.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t("checkout.total")}</span>
                    <span>QAR {orderData?.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("checkout.deliveryInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">{t("checkout.deliveryAddress")}</Label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>{t("checkout.selectAddress")}</option>
                      {addresses?.map((address: any) => (
                        <option key={address.id} value={address.id}>
                          {address.name} - {address.addressLine1}, {address.city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="delivery-method">{t("checkout.deliveryMethod")}</Label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="delivery">{t("checkout.homeDelivery")} - QAR 50</option>
                      <option value="pickup">{t("checkout.storePickup")} - {t("common.free")}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="notes">{t("checkout.orderNotes")}</Label>
                    <textarea 
                      id="notes"
                      placeholder={t("checkout.orderNotesPlaceholder")}
                      rows={3}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.paymentDetails")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
                
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <i className="fas fa-shield-alt text-success mr-1"></i>
                      {t("checkout.securePayment")}
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-credit-card mr-1"></i>
                      {t("checkout.allMajorCards")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Policies */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-truck text-primary mt-0.5"></i>
                    <span>{t("checkout.deliveryPolicy")}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-undo text-primary mt-0.5"></i>
                    <span>{t("checkout.returnPolicy")}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-headset text-primary mt-0.5"></i>
                    <span>{t("checkout.supportPolicy")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
