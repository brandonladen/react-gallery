
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { DollarSign, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSubscription, SubscriptionPlan } from '@/contexts/SubscriptionContext';

const priceSchema = z.object({
  price: z.coerce.number()
    .min(0.01, "Price must be greater than 0")
    .max(1000, "Price cannot exceed $1000"),
});

const PricingPage = () => {
  const { plans } = useSubscription();
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [localPlans, setLocalPlans] = useState<SubscriptionPlan[]>(plans);
  
  const form = useForm<z.infer<typeof priceSchema>>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      price: 0,
    },
  });
  
  const startEditing = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    form.reset({ price: plan.price });
  };
  
  const cancelEditing = () => {
    setEditingPlanId(null);
    form.reset();
  };
  
  const savePrice = (planId: string) => {
    const newPrice = form.getValues().price;
    
    // Update local plans state
    setLocalPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, price: newPrice } 
          : plan
      )
    );
    
    // In a real app, we would make an API call to update the price
    toast.success(`Subscription price updated to $${newPrice}`);
    
    // Reset form and exit edit mode
    setEditingPlanId(null);
    form.reset();
  };
  
  return (
    <div className="admin-ui">
      <h1 className="text-3xl font-bold mb-6">Subscription Pricing</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Plan Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localPlans.map(plan => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="capitalize">{plan.interval}</TableCell>
                  <TableCell>
                    {editingPlanId === plan.id ? (
                      <Form {...form}>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">$</span>
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    className="w-24" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Form>
                    ) : (
                      <span>${plan.price.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPlanId === plan.id ? (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => savePrice(plan.id)}
                          disabled={!form.formState.isValid}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEditing(plan)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Edit Price
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Price Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Apply Discount to All Monthly Plans
                  </label>
                  <div className="flex mt-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Discount percentage"
                      className="w-32 mr-2"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Apply Discount to All Annual Plans
                  </label>
                  <div className="flex mt-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Discount percentage"
                      className="w-32 mr-2"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Button className="w-full mt-2">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Save All Price Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;
