
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'annual';
  features: string[];
}

export interface ActiveSubscription {
  id: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  autoRenew: boolean;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  activeSubscriptions: ActiveSubscription[];
  loading: boolean;
  subscribeToPlan: (planId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  toggleAutoRenew: (subscriptionId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample subscription plans
  const samplePlans: SubscriptionPlan[] = [
    {
      id: 'plan-basic-monthly',
      name: 'Basic',
      description: 'Access to standard galleries',
      price: 9.99,
      interval: 'monthly',
      features: [
        'Access to 10 galleries',
        'Download up to 20 images per month',
        'Standard image quality'
      ]
    },
    {
      id: 'plan-basic-annual',
      name: 'Basic',
      description: 'Access to standard galleries with annual savings',
      price: 99.99,
      interval: 'annual',
      features: [
        'Access to 10 galleries',
        'Download up to 240 images per year',
        'Standard image quality',
        'Save 17% compared to monthly'
      ]
    },
    {
      id: 'plan-pro-monthly',
      name: 'Professional',
      description: 'Enhanced access with more galleries',
      price: 19.99,
      interval: 'monthly',
      features: [
        'Access to all galleries',
        'Unlimited downloads',
        'High-resolution images',
        'Priority support'
      ]
    },
    {
      id: 'plan-pro-annual',
      name: 'Professional',
      description: 'Enhanced access with annual savings',
      price: 199.99,
      interval: 'annual',
      features: [
        'Access to all galleries',
        'Unlimited downloads',
        'High-resolution images',
        'Priority support',
        'Save 17% compared to monthly'
      ]
    }
  ];

  // Sample active subscription
  const sampleActiveSubscription: ActiveSubscription = {
    id: 'sub-123456',
    planId: 'plan-basic-monthly',
    planName: 'Basic Monthly',
    startDate: '2023-06-01',
    endDate: '2023-07-01',
    status: 'active',
    autoRenew: true
  };

  useEffect(() => {
    // Load subscription plans (would be from API in a real app)
    setPlans(samplePlans);
    
    // Load active subscriptions if authenticated
    if (isAuthenticated) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setActiveSubscriptions([sampleActiveSubscription]);
        setLoading(false);
      }, 500);
    } else {
      setActiveSubscriptions([]);
    }
  }, [isAuthenticated]);

  const subscribeToPlan = async (planId: string) => {
    setLoading(true);
    try {
      // This would be an API call in a real application
      console.log(`Subscribing to plan ${planId}`);
      
      // Find the plan details
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }
      
      // Simulate successful subscription
      const newSubscription: ActiveSubscription = {
        id: `sub-${Date.now()}`,
        planId,
        planName: `${plan.name} ${plan.interval === 'annual' ? 'Annual' : 'Monthly'}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (plan.interval === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        autoRenew: true
      };
      
      // Add the new subscription to active subscriptions
      setActiveSubscriptions(prev => [...prev, newSubscription]);
      
    } catch (error) {
      console.error('Error subscribing to plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    setLoading(true);
    try {
      // This would be an API call in a real application
      console.log(`Cancelling subscription ${subscriptionId}`);
      
      // Update the subscription status locally
      setActiveSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'cancelled', autoRenew: false } : sub
        )
      );
      
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRenew = async (subscriptionId: string) => {
    setLoading(true);
    try {
      // Find the subscription
      const subscription = activeSubscriptions.find(sub => sub.id === subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      // This would be an API call in a real application
      console.log(`Toggling auto-renew for subscription ${subscriptionId} to ${!subscription.autoRenew}`);
      
      // Update the subscription auto-renew status locally
      setActiveSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, autoRenew: !sub.autoRenew } : sub
        )
      );
      
    } catch (error) {
      console.error('Error toggling auto-renew:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        activeSubscriptions,
        loading,
        subscribeToPlan,
        cancelSubscription,
        toggleAutoRenew
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
