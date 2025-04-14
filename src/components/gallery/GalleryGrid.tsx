
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '@/contexts/GalleryContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const GalleryGrid: React.FC = () => {
  const { galleries, hasAccessToGallery } = useGallery();
  const navigate = useNavigate();

  if (!galleries.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-200">No galleries found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please check back later for new content.</p>
      </div>
    );
  }

  const handleGalleryClick = (galleryId: string) => {
    // Always navigate to the gallery detail page
    // Access control will be handled there
    navigate(`/galleries/${galleryId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleries.map((gallery) => {
        const hasAccess = hasAccessToGallery(gallery.id);
        
        return (
          <Card 
            key={gallery.id}
            className="overflow-hidden transition-shadow cursor-pointer hover:shadow-lg group dark:bg-gray-800 dark:border-gray-700"
            onClick={() => handleGalleryClick(gallery.id)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={gallery.cover} 
                alt={gallery.title}
                className={`w-full h-full object-cover ${hasAccess ? 'group-hover:scale-105 transition-transform duration-300' : 'opacity-80'}`}
              />
              
              {gallery.isPremium && (
                <div className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-1.5">
                  <Lock size={16} />
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${hasAccess ? 'opacity-0 group-hover:opacity-100 transition-opacity' : 'opacity-100'}`}>
                <div className="absolute bottom-0 w-full p-4">
                  <p className="text-white text-sm">
                    {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                  </p>
                </div>
              </div>
              
              {gallery.isPremium && !hasAccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center p-4">
                    <Lock size={28} className="mx-auto mb-2 text-white" />
                    <p className="text-white mb-2 font-medium">Premium Content</p>
                    <Button 
                      className="mt-2 bg-gallery-primary hover:bg-gallery-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Subscribe to Access
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="pt-4">
              <h3 className="text-xl font-medium dark:text-white">{gallery.title}</h3>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{gallery.description}</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default GalleryGrid;
