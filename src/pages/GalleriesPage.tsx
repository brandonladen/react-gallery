
import React from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GalleriesPage = () => {
  const { galleries } = useGallery();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log("Is authenticated:", isAuthenticated);


  return (
    <div className="subscription-section space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Photography Galleries</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our collection of curated galleries from professional photographers around the world.
          From breathtaking landscapes to intimate portraits, discover the art of photography.
        </p>
      </div>
      
      {!isAuthenticated && (
        <Card className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-600 bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Unlock Premium Galleries</h3>
                <p className="text-muted-foreground text-sm">Create an account or sign in to access exclusive content and premium galleries</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/about')}
                  className="whitespace-nowrap flex items-center gap-1"
                >
                  <Info className="h-4 w-4" />
                  Learn More
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="whitespace-nowrap"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {galleries.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
          <div className="inline-block p-3 rounded-full bg-muted mb-4">
            <Image className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Loading Galleries</h3>
          <p className="text-muted-foreground">Please wait while we fetch the latest galleries...</p>
        </div>
      ) : (
        <GalleryGrid />
      )}
    </div>
  );
};

// Import the Image icon needed by the component
const Image = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default GalleriesPage;
