
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import axios from "axios"; 

interface ArtistImage {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  uploadDate: string;
}

interface ArtistGallery {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  coverImageUrl: string;
  creationDate: string;
  pricing: {
    monthly: number;
    annual: number;
  };
}

interface ArtistContextType {
  images: ArtistImage[];
  galleries: ArtistGallery[];
  isArtist: boolean;
  isLoading: boolean;
  uploadImages: (files: File[], titles: string[], descriptions: string[]) => Promise<void>;
  createGallery: (name: string, description: string, imageIds: string[]) => Promise<void>;
  updateGalleryImages: (galleryId: string, imageIds: string[], action: 'add' | 'remove') => Promise<void>;
  updateGalleryPricing: (galleryId: string, pricing: { monthly: number, annual: number }) => Promise<void>;
  deleteGallery: (galleryId: string) => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export const ArtistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [images, setImages] = useState<ArtistImage[]>([]);
  const [galleries, setGalleries] = useState<ArtistGallery[]>([]);
  const [isArtist, setIsArtist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would check if the user has artist privileges
    // For now, we'll assume all authenticated users can be artists
    if (isAuthenticated && user) {
      setIsArtist(true);
      // This would be an API call in a real app
      loadArtistData();
    } else {
      setIsArtist(false);
      setImages([]);
      setGalleries([]);
    }
  }, [isAuthenticated, user]);

  const loadArtistData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");
  
      // Fetch both in parallel
      const [imagesRes, groupsRes] = await Promise.all([
        axios.get("https://gallery.secretstartups.org/images", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        axios.get("https://gallery.secretstartups.org/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);
  
      // === IMAGES ===
      const imageUrls: string[] = imagesRes.data.imageUrls[0];
      const allImages = imageUrls.map((url, index) => ({
        id: `img-${Date.now()}-${index}`,
        title: `Image ${index + 1}`,
        description: "",
        url,
        thumbnail: url,
        uploadDate: new Date().toISOString().split("T")[0],
      }));
      setImages(allImages);
  
      // === GALLERIES ===
      const groupData = groupsRes.data.groups;
      const formattedGalleries = groupData.map((group: any) => ({
        id: group._id,
        name: group.name,
        description: group.description,
        imageIds: group.images.map((img: any) => img.imageId),
        coverImageUrl: group.images[0]?.imageUrl || "", // First image as cover
        creationDate: new Date(group.createdAt).toISOString().split("T")[0],
        pricing: {
          monthly: 4.99, // Can be dynamic later
          annual: 49.99,
        },
      }));
      setGalleries(formattedGalleries);
  
    } catch (error) {
      console.error("Error loading artist data:", error);
      toast.error("Failed to load artist data");
    } finally {
      setIsLoading(false);
    }
  };
  


  const uploadImages = async (files: File[], titles: string[], descriptions: string[]) => {
    setIsLoading(true);
    
    try {
      // Create a FormData object to hold the files and other data
      const formData = new FormData();
  
      // Append each file to the FormData object
      files.forEach((file) => {
        formData.append("images", file); // 'images' is the key your backend expects
      });
  
      // If your backend needs the titles and descriptions, you can append them as well
      titles.forEach((title, index) => {
        formData.append("titles[]", title); // Sending titles as an array
      });
  
      descriptions.forEach((description, index) => {
        formData.append("descriptions[]", description); // Sending descriptions as an array
      });
  
      // Retrieve the authorization token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authorization token is missing');
      }
  
      // Send the FormData to your backend via POST request
      const response = await axios.post(
        "https://gallery.secretstartups.org/upload", // Your backend upload URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the correct content type
            "Authorization": `Bearer ${token}`, // Include the authorization token in the headers
          },
        }
      );
  
      // Log the response to see the structure
      console.log("Upload response:", response.data);
      
      // Check if response.data is an array
      const uploadedImages = Array.isArray(response.data) ? response.data : [];
      
      // Create the new image objects to update the frontend state
      const newImages = uploadedImages.map((uploadedImage: { url: string }, index: number) => ({
        id: `img-${Date.now()}-${index}`,
        title: titles[index] || "Untitled", // Use the provided title or default to "Untitled"
        description: descriptions[index] || "", // Use the provided description or default to ""
        url: uploadedImage.url, // The actual URL from the backend (Cloudflare URL)
        thumbnail: uploadedImage.url, // Use the uploaded URL or generate a thumbnail URL if needed
        uploadDate: new Date().toISOString().split("T")[0], // Get the current date in YYYY-MM-DD format
      }));
  
      // Update the state with the new image objects
      setImages((prevImages) => [...prevImages, ...newImages]);
  
      // Show a success toast notification
      toast.success(`Successfully uploaded ${files.length} images`);
    } catch (error) {
      // Log and show error in case of failure
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      // Set loading state to false once done
      setIsLoading(false);
    }
  };    

  const createGallery = async (name: string, description: string, imageIds: string[]) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to create a gallery
      console.log("Creating gallery at http://localhost/3000/groups");
      console.log("Request body:", { name, description, imageIds });
      
      // Find the first image to use as cover
      const coverImageUrl = images.find(img => imageIds.includes(img.id))?.url || "";
      
      // Simulate successful creation
      const newGallery: ArtistGallery = {
        id: `gal-${Date.now()}`,
        name,
        description,
        imageIds,
        coverImageUrl,
        creationDate: new Date().toISOString().split('T')[0],
        pricing: {
          monthly: 0,
          annual: 0
        }
      };
      
      setGalleries(prevGalleries => [...prevGalleries, newGallery]);
      toast.success("Gallery created successfully");
    } catch (error) {
      console.error("Error creating gallery:", error);
      toast.error("Failed to create gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const updateGalleryImages = async (galleryId: string, imageIds: string[], action: 'add' | 'remove') => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to update gallery images
      console.log(`Updating gallery at https://localhost/3000/groups/${galleryId}`);
      console.log("Request body:", { imageIds, action });
      
      setGalleries(prevGalleries => 
        prevGalleries.map(gallery => {
          if (gallery.id === galleryId) {
            let updatedImageIds = [...gallery.imageIds];
            
            if (action === 'add') {
              // Add new images that aren't already in the gallery
              const newIds = imageIds.filter(id => !gallery.imageIds.includes(id));
              updatedImageIds = [...updatedImageIds, ...newIds];
            } else if (action === 'remove') {
              // Remove specified images
              updatedImageIds = updatedImageIds.filter(id => !imageIds.includes(id));
            }
            
            // Update cover image if needed
            let coverImageUrl = gallery.coverImageUrl;
            if (updatedImageIds.length > 0 && !updatedImageIds.some(id => images.find(img => img.id === id)?.url === coverImageUrl)) {
              const firstImage = images.find(img => updatedImageIds.includes(img.id));
              if (firstImage) {
                coverImageUrl = firstImage.url;
              }
            }
            
            return {
              ...gallery,
              imageIds: updatedImageIds,
              coverImageUrl
            };
          }
          return gallery;
        })
      );
      
      toast.success(`Successfully ${action === 'add' ? 'added' : 'removed'} images from gallery`);
    } catch (error) {
      console.error("Error updating gallery images:", error);
      toast.error("Failed to update gallery images");
    } finally {
      setIsLoading(false);
    }
  };

  const updateGalleryPricing = async (galleryId: string, pricing: { monthly: number, annual: number }) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to update gallery pricing
      console.log(`Updating gallery pricing for ${galleryId}`);
      console.log("New pricing:", pricing);
      
      setGalleries(prevGalleries => 
        prevGalleries.map(gallery => {
          if (gallery.id === galleryId) {
            return {
              ...gallery,
              pricing
            };
          }
          return gallery;
        })
      );
      
      toast.success("Gallery pricing updated successfully");
    } catch (error) {
      console.error("Error updating gallery pricing:", error);
      toast.error("Failed to update gallery pricing");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGallery = async (galleryId: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to delete a gallery
      console.log(`Deleting gallery ${galleryId}`);
      
      setGalleries(prevGalleries => prevGalleries.filter(gallery => gallery.id !== galleryId));
      toast.success("Gallery deleted successfully");
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to delete an image
      console.log(`Deleting image ${imageId}`);
      
      // Remove image from all galleries first
      setGalleries(prevGalleries => 
        prevGalleries.map(gallery => {
          if (gallery.imageIds.includes(imageId)) {
            const updatedImageIds = gallery.imageIds.filter(id => id !== imageId);
            
            // Update cover image if needed
            let coverImageUrl = gallery.coverImageUrl;
            if (images.find(img => img.id === imageId)?.url === coverImageUrl && updatedImageIds.length > 0) {
              const firstImage = images.find(img => updatedImageIds.includes(img.id));
              if (firstImage) {
                coverImageUrl = firstImage.url;
              }
            }
            
            return {
              ...gallery,
              imageIds: updatedImageIds,
              coverImageUrl
            };
          }
          return gallery;
        })
      );
      
      // Then remove the image itself
      setImages(prevImages => prevImages.filter(image => image.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ArtistContext.Provider
      value={{
        images,
        galleries,
        isArtist,
        isLoading,
        uploadImages,
        createGallery,
        updateGalleryImages,
        updateGalleryPricing,
        deleteGallery,
        deleteImage
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};

export const useArtist = () => {
  const context = useContext(ArtistContext);
  if (context === undefined) {
    throw new Error('useArtist must be used within an ArtistProvider');
  }
  return context;
};
