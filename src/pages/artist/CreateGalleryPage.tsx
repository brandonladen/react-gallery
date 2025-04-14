
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtist } from '@/contexts/ArtistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const CreateGalleryPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { images, createGallery } = useArtist();

  const handleToggleImage = (imageId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleCreateGallery = async () => {
    if (!name.trim()) {
      toast.error('Please enter a gallery name');
      return;
    }
    
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image for your gallery');
      return;
    }
    
    setIsCreating(true);
    
    try {
      await createGallery(name, description, selectedImages);
      navigate('/artist/dashboard');
    } catch (error) {
      console.error('Error creating gallery:', error);
      toast.error('Failed to create gallery. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/artist/dashboard')}
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Dashboard
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">Create New Gallery</h1>
      <p className="text-gray-600 mb-6">Create a new gallery by grouping your images together</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Gallery Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter gallery name"
                    disabled={isCreating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Gallery Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your gallery (optional)"
                    disabled={isCreating}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Selected Images</Label>
                  <p className="text-sm text-gray-500">
                    {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} selected
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button
                    className="w-full bg-gallery-primary hover:bg-gallery-primary/90"
                    onClick={handleCreateGallery}
                    disabled={isCreating || selectedImages.length === 0}
                  >
                    {isCreating ? 'Creating...' : 'Create Gallery'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Select Images for Gallery</h2>
          
          {images.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <p className="text-gray-500">No images available</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/artist/upload')}
              >
                Upload Images First
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative">
                  <div 
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImages.includes(image.id) 
                        ? 'border-gallery-primary' 
                        : 'border-transparent'
                    }`}
                    onClick={() => handleToggleImage(image.id)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.title} 
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => handleToggleImage(image.id)}
                        className="h-5 w-5 border-2 data-[state=checked]:bg-gallery-primary data-[state=checked]:text-white"
                      />
                    </div>
                  </div>
                  <p className="text-sm truncate mt-1">{image.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGalleryPage;
