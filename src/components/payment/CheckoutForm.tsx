
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock } from 'lucide-react';

interface CheckoutFormProps {
  planId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planId }) => {
  const { plans, subscribeToPlan } = useSubscription();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const plan = plans.find(p => p.id === planId);
  
  if (!plan) {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardHolder || !cardNumber || !expiry || !cvc) {
      toast.error("Please fill in all payment fields");
      return;
    }
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
    
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      toast.error("Please enter expiry in format MM/YY");
      return;
    }
    
    if (cvc.length !== 3) {
      toast.error("Please enter a valid 3-digit CVC");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be a real payment integration in a production app
      // For demo, we'll just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful "payment", subscribe the user to the plan
      await subscribeToPlan(planId);
      
      toast.success("Payment successful! You're now subscribed.");
      navigate('/subscriptions');
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setCardNumber(value.replace(/(.{4})/g, '$1 ').trim());
    }
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      // Format as MM/YY
      if (value.length > 2) {
        setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiry(value);
      }
    }
  };
  
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvc(value);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete your subscription</CardTitle>
          <CardDescription>
            You're subscribing to the {plan.name} ({plan.interval}) plan.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-slate-50 rounded-md">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium">{plan.name} ({plan.interval === 'monthly' ? 'Monthly' : 'Annual'})</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Price</span>
              <span className="font-medium">${plan.price}/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${plan.price}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardHolder">Cardholder Name</Label>
                <Input
                  id="cardHolder"
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={handleCvcChange}
                    maxLength={3}
                    type="password"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Pay $${plan.price}`}
          </Button>
          
          <div className="text-xs text-center text-gray-500 flex items-center justify-center">
            <Lock size={12} className="mr-1" />
            Your payment information is secure and encrypted
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutForm;
