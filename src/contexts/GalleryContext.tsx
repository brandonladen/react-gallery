
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';

interface Image {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  cover: string;
  images: Image[];
  isPremium: boolean;
  artistId?: string; // The ID of the artist who created this gallery
  monthlyPrice?: number; // Optional price for monthly subscription
  annualPrice?: number; // Optional price for annual subscription
}

interface GalleryContextType {
  galleries: Gallery[];
  featuredImages: Image[];
  loadGalleries: () => Promise<void>;
  activeGallery: Gallery | null;
  setActiveGallery: (gallery: Gallery | null) => void;
  activeImage: Image | null;
  setActiveImage: (image: Image | null) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  hasAccessToGallery: (galleryId: string) => boolean;
  getGalleryById: (galleryId: string) => Gallery | undefined;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { activeSubscriptions } = useSubscription();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [featuredImages, setFeaturedImages] = useState<Image[]>([]);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [activeImage, setActiveImage] = useState<Image | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const dummyGalleries: Gallery[] = [
    {
      id: '1',
      title: 'Nature Landscapes',
      description: 'Beautiful nature scenes from around the world',
      cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      isPremium: true,
      artistId: 'artist1',
      monthlyPrice: 4.99,
      annualPrice: 49.99,
      images: [
        {
          id: '101',
          title: 'Mountain Range',
          description: 'A stunning view of mountains at sunset',
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200'
        },
        {
          id: '102',
          title: 'Forest Path',
          description: 'A serene path through an ancient forest',
          url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
          thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200'
        },
        {
          id: '103',
          title: 'Ocean View',
          description: 'Waves crashing on a rocky shore',
          url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
          thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200'
        },
        {
          id: '104',
          title: 'Desert Landscape',
          description: 'Golden sand dunes at dawn',
          url: 'https://images.unsplash.com/photo-1682686580003-82f3671bc41c',
          thumbnail: 'https://images.unsplash.com/photo-1682686580003-82f3671bc41c?w=200'
        },
        {
          id: '105',
          title: 'Waterfall',
          description: 'Powerful waterfall in a lush forest',
          url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
          thumbnail: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=200'
        },
        {
          id: '106',
          title: 'Autumn Colors',
          description: 'Vibrant red and orange autumn leaves',
          url: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6',
          thumbnail: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=200'
        },
        {
          id: '107',
          title: 'Winter Wonderland',
          description: 'Snow-covered trees in a winter landscape',
          url: 'https://images.unsplash.com/photo-1457269449834-928af64c684d',
          thumbnail: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=200'
        },
        {
          id: '108',
          title: 'Tropical Beach',
          description: 'Pristine white sand beach with turquoise water',
          url: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4',
          thumbnail: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=200'
        },
        {
          id: '109',
          title: 'Alpine Lake',
          description: 'Crystal clear mountain lake with reflections',
          url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc',
          thumbnail: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=200'
        },
        {
          id: '110',
          title: 'Sunset Silhouette',
          description: 'Dramatic silhouettes against a colorful sunset',
          url: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda',
          thumbnail: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=200'
        }
      ]
    },
    {
      id: '2',
      title: 'Urban Photography',
      description: 'City landscapes, architecture, and urban scenes',
      cover: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
      isPremium: false,
      artistId: 'artist2',
      images: [
        {
          id: '201',
          title: 'City Skyline',
          description: 'A panoramic view of a modern city skyline at night',
          url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
          thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200'
        },
        {
          id: '202',
          title: 'Historic Architecture',
          description: 'Ancient buildings with intricate details',
          url: 'https://images.unsplash.com/photo-1492136344046-866c85e0bf04',
          thumbnail: 'https://images.unsplash.com/photo-1492136344046-866c85e0bf04?w=200'
        },
        {
          id: '203',
          title: 'Street Photography',
          description: 'Bustling street scene in a major metropolis',
          url: 'https://images.unsplash.com/photo-1519580790533-5a23f4068a1b',
          thumbnail: 'https://images.unsplash.com/photo-1519580790533-5a23f4068a1b?w=200'
        },
        {
          id: '204',
          title: 'Urban Night Life',
          description: 'City streets illuminated at night',
          url: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6',
          thumbnail: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=200'
        },
        {
          id: '205',
          title: 'Subway Station',
          description: 'Modern subway station with unique architecture',
          url: 'https://images.unsplash.com/photo-1569272895681-61f34e39a55b',
          thumbnail: 'https://images.unsplash.com/photo-1569272895681-61f34e39a55b?w=200'
        },
        {
          id: '206',
          title: 'City Park',
          description: 'Urban green space surrounded by skyscrapers',
          url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
          thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200'
        },
        {
          id: '207',
          title: 'Graffiti Art',
          description: 'Colorful street art on urban walls',
          url: 'https://images.unsplash.com/photo-1562514261-97b0cca6a46d',
          thumbnail: 'https://images.unsplash.com/photo-1562514261-97b0cca6a46d?w=200'
        },
        {
          id: '208',
          title: 'Bridge at Sunset',
          description: 'Iconic bridge silhouette against sunset sky',
          url: 'https://images.unsplash.com/photo-1445264618000-f1e069c5920f',
          thumbnail: 'https://images.unsplash.com/photo-1445264618000-f1e069c5920f?w=200'
        },
        {
          id: '209',
          title: 'City Reflection',
          description: 'Urban skyline reflected in water',
          url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
          thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200'
        },
        {
          id: '210',
          title: 'Rooftop View',
          description: 'Cityscape viewed from a high rooftop',
          url: 'https://images.unsplash.com/photo-1543799182-9a8c45b7d756',
          thumbnail: 'https://images.unsplash.com/photo-1543799182-9a8c45b7d756?w=200'
        }
      ]
    },
    {
      id: '3',
      title: 'Portraits',
      description: 'Professional portrait photography collection',
      cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      isPremium: true,
      artistId: 'artist1',
      monthlyPrice: 5.99,
      annualPrice: 59.99,
      images: [
        {
          id: '301',
          title: 'Professional Headshot',
          description: 'Corporate-style professional portrait',
          url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
          thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200'
        },
        {
          id: '302',
          title: 'Environmental Portrait',
          description: 'A portrait taken in a meaningful location',
          url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
          thumbnail: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200'
        },
        {
          id: '303',
          title: 'Artistic Portrait',
          description: 'Creative lighting and composition for artistic effect',
          url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
        },
        {
          id: '304',
          title: 'Natural Light Portrait',
          description: 'Soft natural lighting for a warm portrait',
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
          thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200'
        },
        {
          id: '305',
          title: 'Black and White Portrait',
          description: 'Classic monochrome portrait with strong contrast',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
        },
        {
          id: '306',
          title: 'Low Key Portrait',
          description: 'Dark, dramatic portrait with minimal lighting',
          url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
          thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
        },
        {
          id: '307',
          title: 'High Key Portrait',
          description: 'Bright, airy portrait with soft shadows',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
          thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
        },
        {
          id: '308',
          title: 'Candid Portrait',
          description: 'Natural, unposed moment captured authentically',
          url: 'https://images.unsplash.com/photo-1513673054901-79525583065e',
          thumbnail: 'https://images.unsplash.com/photo-1513673054901-79525583065e?w=200'
        },
        {
          id: '309',
          title: 'Character Portrait',
          description: 'Portrait highlighting unique personality traits',
          url: 'https://images.unsplash.com/photo-1528892952291-009c663ce843',
          thumbnail: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=200'
        },
        {
          id: '310',
          title: 'Profile Portrait',
          description: 'Classic side view portrait showcasing facial features',
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
          thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'
        }
      ]
    }
  ];

  const dummyFeaturedImages: Image[] = [
    {
      id: 'f1',
      title: 'Featured Landscape',
      description: 'A stunning mountain landscape with a lake',
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
      thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200'
    },
    {
      id: 'f2',
      title: 'Featured Portrait',
      description: 'Professional portrait photography',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    },
    {
      id: 'f3',
      title: 'Featured Architecture',
      description: 'Modern architectural photography',
      url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
      thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200'
    },
    {
      id: 'f4',
      title: 'Featured Nature',
      description: 'Beautiful forest scene',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200'
    },
    {
      id: 'f5',
      title: 'Featured Urban',
      description: 'Urban night photography',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
      thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200'
    }
  ];

  const loadGalleries = async () => {
    try {
      setGalleries(dummyGalleries);
      setFeaturedImages(dummyFeaturedImages);
    } catch (error) {
      console.error('Error loading galleries:', error);
    }
  };

  const getGalleryById = (galleryId: string): Gallery | undefined => {
    return galleries.find(g => g.id === galleryId);
  };

  const hasAccessToGallery = (galleryId: string): boolean => {
    if (!isAuthenticated) return false;
    
    const gallery = galleries.find(g => g.id === galleryId);
    if (!gallery) return false;
    
    // Non-premium galleries are accessible to all authenticated users
    if (!gallery.isPremium) return true;
    
    // User has a specific subscription for this gallery
    return activeSubscriptions.some(sub => {
      // Check if this subscription gives access to this gallery
      // This could be enhanced to check subscription.planId against gallery-specific plan IDs
      return sub.status === 'active';
    });
  };

  useEffect(() => {
    setFeaturedImages(dummyFeaturedImages);
    
    // Always load galleries for all users, even if not authenticated
    // This is a change to make galleries visible to all users
    loadGalleries();
  }, [isAuthenticated]);

  return (
    <GalleryContext.Provider
      value={{
        galleries,
        featuredImages,
        loadGalleries,
        activeGallery,
        setActiveGallery,
        activeImage,
        setActiveImage,
        zoomLevel,
        setZoomLevel,
        hasAccessToGallery,
        getGalleryById
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
