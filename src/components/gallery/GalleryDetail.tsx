
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '@/contexts/GalleryContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Grid2X2, Columns, Lock } from 'lucide-react';
import ImageViewer from './ImageViewer';

interface GalleryDetailProps {
  galleryId: string;
}

const GalleryDetail: React.FC<GalleryDetailProps> = ({ galleryId }) => {
  const { galleries, setActiveGallery, setActiveImage, hasAccessToGallery } = useGallery();
  const [viewStyle, setViewStyle] = useState<'grid' | 'columns'>('grid');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const navigate = useNavigate();
  
  const gallery = galleries.find(g => g.id === galleryId);
  
  if (!gallery) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-700">Gallery not found</h2>
        <p className="text-gray-500 mt-2">The requested gallery does not exist or was removed.</p>
      </div>
    );
  }
  
  const hasAccess = hasAccessToGallery(galleryId);
  
  const handleImageClick = (imageId: string) => {
    if (!hasAccess && gallery.isPremium) {
      navigate(`/subscriptions?fromGallery=${galleryId}`);
      return;
    }
    
    const image = gallery.images.find(img => img.id === imageId);
    if (image) {
      setActiveGallery(gallery);
      setActiveImage(image);
      setShowImageViewer(true);
    }
  };

  const handleCloseViewer = () => {
    setShowImageViewer(false);
  };
  
  const handleSubscribe = () => {
    navigate(`/subscriptions?fromGallery=${galleryId}`);
  };

  if (gallery.isPremium && !hasAccess) {
    return (
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
          onClick={handleSubscribe}
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
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{gallery.title}</h1>
        <p className="text-gray-600 mb-4">{gallery.description}</p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
          </Badge>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${viewStyle === 'grid' ? 'bg-slate-100' : ''}`}
              onClick={() => setViewStyle('grid')}
            >
              <Grid2X2 size={16} className="mr-1" />
              <span className="text-xs">Grid</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${viewStyle === 'columns' ? 'bg-slate-100' : ''}`}
              onClick={() => setViewStyle('columns')}
            >
              <Columns size={16} className="mr-1" />
              <span className="text-xs">Columns</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {viewStyle === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.images.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageClick(image.id)}
              className="aspect-square overflow-hidden rounded-md cursor-pointer group relative"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity p-3">
                <p className="text-white text-sm font-medium">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {gallery.images.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageClick(image.id)}
              className="break-inside-avoid overflow-hidden rounded-md cursor-pointer group relative"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity p-3">
                <p className="text-white text-sm font-medium">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showImageViewer && <ImageViewer onClose={handleCloseViewer} />}
    </div>
  );
};

export default GalleryDetail;
