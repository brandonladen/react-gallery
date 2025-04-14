
import React from 'react';
import { Camera, Image, CreditCard } from 'lucide-react';

const FeatureHighlights: React.FC = () => {
  const features = [
    {
      title: 'Professional Photography',
      description: 'Explore collections from renowned photographers around the world',
      icon: <Camera className="w-8 h-8 text-gallery-primary" />,
    },
    {
      title: 'High-Quality Images',
      description: 'Access to high-resolution images for personal and professional use',
      icon: <Image className="w-8 h-8 text-gallery-primary" />,
    },
    {
      title: 'Flexible Subscriptions',
      description: 'Choose from monthly or annual plans to suit your needs',
      icon: <CreditCard className="w-8 h-8 text-gallery-primary" />,
    },
  ];

  return (
    <section className="py-12 mb-12">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
