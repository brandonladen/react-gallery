
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useGallery } from '@/contexts/GalleryContext';
import PlanCard from '@/components/subscription/PlanCard';
import ActiveSubscriptionCard from '@/components/subscription/ActiveSubscriptionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SubscriptionsPage = () => {
  const { plans, activeSubscriptions, loading } = useSubscription();
  const { galleries, hasAccessToGallery } = useGallery();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  
  // Parse the gallery ID from the URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const galleryId = params.get('fromGallery');
    if (galleryId) {
      setSelectedGallery(galleryId);
    }
  }, [location]);

  // Get the gallery details if coming from a gallery
  const gallery = selectedGallery ? galleries.find(g => g.id === selectedGallery) : null;
  
  // Filter plans by interval
  const monthlyPlans = plans.filter(plan => plan.interval === 'monthly');
  const annualPlans = plans.filter(plan => plan.interval === 'annual');
  
  // Get only galleries the user actually has access to
  const accessibleGalleries = galleries.filter(g => hasAccessToGallery(g.id));
  
  return (
    <div className="subscription-section">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Subscriptions</h1>
        <p className="text-gray-600">
          Choose a subscription plan to get access to our premium galleries.
        </p>
      </div>
      
      {gallery && (
        <Alert className="mb-6 border-gallery-primary/30 bg-gallery-primary/5">
          <div className="flex items-center gap-2">
            <img 
              src={gallery.cover} 
              alt={gallery.title} 
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <AlertTitle className="mb-1">Subscribe to access {gallery.title}</AlertTitle>
              <AlertDescription>
                <p className="text-sm text-gray-600 mb-2">{gallery.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => navigate('/galleries')}
                >
                  <ArrowLeft size={14} className="mr-1" />
                  Back to Galleries
                </Button>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      {activeSubscriptions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {activeSubscriptions.map((subscription) => (
              <ActiveSubscriptionCard 
                key={subscription.id} 
                subscription={subscription} 
              />
            ))}
          </div>
        </div>
      )}
      
      {accessibleGalleries.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">My Accessible Galleries</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accessibleGalleries.map((gallery) => (
              <Card 
                key={gallery.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/galleries/${gallery.id}`)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={gallery.cover} 
                    alt={gallery.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 w-full p-4">
                      <p className="text-white text-sm">
                        {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="text-xl font-medium">{gallery.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{gallery.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
      
      <Tabs defaultValue="monthly" className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="annual">Annual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-6">
            {monthlyPlans.map((plan, index) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                featured={index === 1} // Make the second plan featured
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="annual">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-6">
            {annualPlans.map((plan, index) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                featured={index === 1} // Make the second plan featured
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Subscription Benefits</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Unlimited access to premium galleries</li>
          <li>High-resolution image downloads</li>
          <li>Early access to new content</li>
          <li>Cancel anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
