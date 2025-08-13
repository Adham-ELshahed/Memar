import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CreditCard, Headphones, Truck } from 'lucide-react';

export function TrustIndicators() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: 'Verified Vendors',
      description: 'All vendors undergo KYC verification and background checks for your security',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Protected transactions with escrow services and multiple payment options',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support team available around the clock in Arabic & English',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Efficient logistics network ensuring quick delivery across Qatar',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  const stats = [
    { value: '500+', label: 'Verified Vendors' },
    { value: '50K+', label: 'Products Available' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '95%', label: 'Customer Satisfaction' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('trust.title', 'Why Choose Meamar?')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing a secure, reliable platform for all your construction and home fit-out needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
