
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGallery } from '@/contexts/GalleryContext';
import { useAuth } from '@/contexts/AuthContext';
import GalleryDetail from '@/components/gallery/GalleryDetail';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Lock, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const GalleryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { galleries, hasAccessToGallery, getGalleryById } = useGallery();
  const { isAuthenticated } = useAuth();
  
  if (!id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-700">Gallery not found</h2>
        <p className="text-gray-500 mt-2">The requested gallery does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/galleries')}>
          Back to Galleries
        </Button>
      </div>
    );
  }
  
  const gallery = getGalleryById(id);
  
  if (!gallery) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-700">Gallery not found</h2>
        <p className="text-gray-500 mt-2">The requested gallery does not exist or was removed.</p>
        <Button className="mt-4" onClick={() => navigate('/galleries')}>
          Back to Galleries
        </Button>
      </div>
    );
  }

  const hasAccess = hasAccessToGallery(id);
  
  // If the user is not authenticated and this is a premium gallery
  if (!isAuthenticated && gallery.isPremium) {
    return (
      <div>
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/galleries')}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Galleries
        </Button>
        
        <div className="text-center py-12">
          <div className="mb-6">
            <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium text-gray-700">Sign in to Access</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              You need to sign in to access this premium gallery.
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-gallery-primary hover:bg-gallery-primary/90"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
          
          <div className="mt-8">
            <img 
              src={gallery.cover} 
              alt={gallery.title}
              className="max-w-md mx-auto rounded-lg opacity-50"
            />
          </div>
        </div>
      </div>
    );
  }
  
  // If the user is authenticated but doesn't have access to this premium gallery
  if (isAuthenticated && gallery.isPremium && !hasAccess) {
    return (
      <div>
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/galleries')}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Galleries
        </Button>
        
        <div className="text-center py-12">
          <div className="mb-6">
            <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium text-gray-700">Premium Gallery</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              This gallery requires a subscription to view. Subscribe to unlock all images in this gallery.
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => navigate(`/subscriptions?fromGallery=${id}`)}
            className="bg-gallery-primary hover:bg-gallery-primary/90"
          >
            Subscribe to Unlock
          </Button>
          
          <div className="mt-8">
            <img 
              src={gallery.cover} 
              alt={gallery.title}
              className="max-w-md mx-auto rounded-lg opacity-50"
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/galleries')}
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Galleries
      </Button>
      
      <GalleryDetail galleryId={id} />
    </div>
  );
};

export default GalleryDetailPage;
