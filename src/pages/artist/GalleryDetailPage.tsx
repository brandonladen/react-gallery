
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtist } from '@/contexts/ArtistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, Trash, Edit, X, Plus, Image, Save } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const GalleryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { galleries, images, updateGalleryImages, updateGalleryPricing, deleteGallery } = useArtist();
  
  const [gallery, setGallery] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [annualPrice, setAnnualPrice] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addImagesDialogOpen, setAddImagesDialogOpen] = useState(false);
  const [imagesToAdd, setImagesToAdd] = useState<string[]>([]);
  
  // Find the gallery and initialize state
  useEffect(() => {
    if (!id) return;
    
    const foundGallery = galleries.find(g => g.id === id);
    if (foundGallery) {
      setGallery(foundGallery);
      setEditedName(foundGallery.name);
      setEditedDescription(foundGallery.description);
      setMonthlyPrice(foundGallery.pricing.monthly);
      setAnnualPrice(foundGallery.pricing.annual);
      setSelectedImages(foundGallery.imageIds);
    }
    setIsLoading(false);
  }, [id, galleries]);
  
  // Get images that are in the gallery
  const galleryImages = images.filter(img => gallery?.imageIds.includes(img.id));
  
  // Get images that are not in the gallery (for adding images)
  const availableImages = images.filter(img => !gallery?.imageIds.includes(img.id));
  
  const handleToggleImageToAdd = (imageId: string) => {
    setImagesToAdd(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };
  
  const handleAddImages = async () => {
    if (!id || !imagesToAdd.length) return;
    
    try {
      await updateGalleryImages(id, imagesToAdd, 'add');
      setAddImagesDialogOpen(false);
      setImagesToAdd([]);
    } catch (error) {
      console.error('Error adding images:', error);
      toast.error('Failed to add images to gallery');
    }
  };
  
  const handleRemoveImage = async (imageId: string) => {
    if (!id) return;
    
    try {
      await updateGalleryImages(id, [imageId], 'remove');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image from gallery');
    }
  };
  
  const handleSavePricing = async () => {
    if (!id) return;
    
    try {
      await updateGalleryPricing(id, {
        monthly: monthlyPrice,
        annual: annualPrice
      });
      toast.success('Pricing updated successfully');
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update pricing');
    }
  };
  
  const handleDeleteGallery = async () => {
    if (!id) return;
    
    try {
      await deleteGallery(id);
      navigate('/artist/dashboard');
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast.error('Failed to delete gallery');
    }
  };
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading gallery...</div>;
  }
  
  if (!gallery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Gallery Not Found</h1>
        <p className="text-gray-600 mb-6">The gallery you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/artist/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{gallery.name}</h1>
          <p className="text-gray-600">Created on {gallery.creationDate}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete Gallery
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="images" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gallery Images ({galleryImages.length})</h2>
            <Button onClick={() => setAddImagesDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Images
            </Button>
          </div>
          
          {galleryImages.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <p className="text-gray-500">No images in this gallery</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setAddImagesDialogOpen(true)}
              >
                Add Your First Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium truncate">{image.title}</h3>
                  </div>
                  <Button 
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="details">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gallery Details</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>Cancel</>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  // Edit mode
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Gallery Name</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Gallery Description</Label>
                      <Textarea
                        id="description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <Button className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  // View mode
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Gallery Name</h3>
                      <p className="mt-1">{gallery.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{gallery.description || "No description provided"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Number of Images</h3>
                      <p className="mt-1">{gallery.imageIds.length}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Creation Date</h3>
                      <p className="mt-1">{gallery.creationDate}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthly-price">Monthly Price ($)</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="monthly-price"
                      type="number"
                      value={monthlyPrice}
                      onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Set the price users will pay for monthly access to this gallery.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="annual-price">Annual Price ($)</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="annual-price"
                      type="number"
                      value={annualPrice}
                      onChange={(e) => setAnnualPrice(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Set the price users will pay for annual access to this gallery. Consider offering a discount compared to the monthly price.
                  </p>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button
                    className="w-full bg-gallery-primary hover:bg-gallery-primary/90"
                    onClick={handleSavePricing}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete Gallery Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gallery</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this gallery? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteGallery}
            >
              Delete Gallery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Images Dialog */}
      <Dialog open={addImagesDialogOpen} onOpenChange={setAddImagesDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add Images to Gallery</DialogTitle>
            <DialogDescription>
              Select images to add to "{gallery.name}"
            </DialogDescription>
          </DialogHeader>
          
          {availableImages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No additional images available</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/artist/upload')}
              >
                Upload New Images
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto py-4">
              {availableImages.map((image) => (
                <div key={image.id} className="group relative">
                  <div 
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      imagesToAdd.includes(image.id) 
                        ? 'border-gallery-primary' 
                        : 'border-transparent'
                    }`}
                    onClick={() => handleToggleImageToAdd(image.id)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.title} 
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={imagesToAdd.includes(image.id)}
                        onCheckedChange={() => handleToggleImageToAdd(image.id)}
                        className="h-5 w-5 border-2 data-[state=checked]:bg-gallery-primary data-[state=checked]:text-white"
                      />
                    </div>
                  </div>
                  <p className="text-sm truncate mt-1">{image.title}</p>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-500">
                {imagesToAdd.length} {imagesToAdd.length === 1 ? 'image' : 'images'} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAddImagesDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddImages}
                  disabled={imagesToAdd.length === 0}
                  className="bg-gallery-primary hover:bg-gallery-primary/90"
                >
                  Add to Gallery
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryDetailPage;
