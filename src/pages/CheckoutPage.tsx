
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import CheckoutForm from '@/components/payment/CheckoutForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plans } = useSubscription();
  
  const plan = planId ? plans.find(p => p.id === planId) : undefined;
  
  if (!planId || !plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-700">Plan not found</h2>
        <p className="text-gray-500 mt-2">The requested subscription plan does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/subscriptions')}>
          View Available Plans
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/subscriptions')}
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Plans
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>
      
      <CheckoutForm planId={planId} />
    </div>
  );
};

export default CheckoutPage;
