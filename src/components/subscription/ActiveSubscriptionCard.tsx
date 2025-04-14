
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ActiveSubscription, useSubscription } from '@/contexts/SubscriptionContext';

interface ActiveSubscriptionCardProps {
  subscription: ActiveSubscription;
}

const ActiveSubscriptionCard: React.FC<ActiveSubscriptionCardProps> = ({ subscription }) => {
  const { cancelSubscription, toggleAutoRenew } = useSubscription();
  
  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      cancelSubscription(subscription.id);
    }
  };
  
  const handleToggleAutoRenew = () => {
    toggleAutoRenew(subscription.id);
  };
  
  // Calculate days remaining
  const endDate = new Date(subscription.endDate);
  const today = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{subscription.planName}</h3>
            <p className="text-sm text-gray-500">
              {subscription.status === 'active' ? 'Active' : subscription.status === 'cancelled' ? 'Cancelled' : 'Expired'}
            </p>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
              subscription.status === 'cancelled' ? 'bg-orange-100 text-orange-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {subscription.status === 'active' ? 'Active' : 
               subscription.status === 'cancelled' ? 'Cancelled' : 
               'Expired'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Start date</span>
            <span className="text-sm">{subscription.startDate}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Renewal date</span>
            <span className="text-sm">{subscription.endDate}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm">
              {subscription.status === 'active' ? 
                `Renews in ${daysRemaining} days` : 
                subscription.status === 'cancelled' ? 
                `Expires in ${daysRemaining} days` : 
                'Expired'}
            </span>
          </div>
          
          {subscription.status === 'active' && (
            <div className="flex items-center justify-between space-x-2 pt-2">
              <Label htmlFor="auto-renew" className="text-sm">Auto-renew subscription</Label>
              <Switch 
                id="auto-renew" 
                checked={subscription.autoRenew}
                onCheckedChange={handleToggleAutoRenew}
              />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        {subscription.status === 'active' && (
          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </Button>
        )}
        
        {subscription.status === 'cancelled' && (
          <Button 
            className="w-full"
            onClick={() => toggleAutoRenew(subscription.id)}
          >
            Reactivate Subscription
          </Button>
        )}
        
        {subscription.status === 'expired' && (
          <Button 
            className="w-full"
          >
            Renew Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ActiveSubscriptionCard;
