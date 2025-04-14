
import React, { useState, useEffect } from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const ImageCarousel: React.FC = () => {
  const { featuredImages } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const showNextImage = () => {
    if (isTransitioning || !featuredImages.length) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const showPrevImage = () => {
    if (isTransitioning || !featuredImages.length) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredImages.length - 1 : prevIndex - 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(showNextImage, 5000);
    return () => clearInterval(interval);
  }, [featuredImages.length]);

  const showImageInfo = (title: string, description: string) => {
    toast(title, {
      description: description,
      duration: 3000,
    });
  };

  if (!featuredImages.length) {
    return <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl shadow-xl h-[70vh] mb-12">
      {featuredImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{image.title}</h2>
            <p className="line-clamp-2">{image.description}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50"
            onClick={() => showImageInfo(image.title, image.description)}
          >
            <Info size={20} />
          </Button>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-12 w-12 rounded-full"
        onClick={showPrevImage}
        disabled={isTransitioning}
      >
        <ChevronLeft size={24} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-12 w-12 rounded-full"
        onClick={showNextImage}
        disabled={isTransitioning}
      >
        <ChevronRight size={24} />
      </Button>
      
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {featuredImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
