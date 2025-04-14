
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/contexts/SubscriptionContext';

interface PlanCardProps {
  plan: SubscriptionPlan;
  featured?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, featured = false }) => {
  const navigate = useNavigate();
  
  const handleSubscribe = () => {
    navigate(`/checkout/${plan.id}`);
  };
  
  return (
    <Card className={`overflow-hidden ${featured ? 'border-gallery-primary border-2 shadow-lg' : ''}`}>
      {featured && (
        <div className="bg-gallery-primary text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <CardHeader className="bg-slate-50 pt-6 pb-4">
        <div className="text-center">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{plan.interval === 'monthly' ? 'Monthly' : 'Annual'}</p>
          <div className="mt-4">
            <span className="text-3xl font-bold">${plan.price}</span>
            <span className="text-gray-500">/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <p className="text-center text-sm text-gray-600 mb-6">{plan.description}</p>
        
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-green-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-2 pb-6">
        <Button 
          className={`w-full ${featured ? 'bg-gallery-primary hover:bg-gallery-primary/90' : ''}`} 
          onClick={handleSubscribe}
        >
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
