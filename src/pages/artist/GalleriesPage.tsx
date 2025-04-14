
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtist } from '@/contexts/ArtistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Images, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const ArtistGalleriesPage = () => {
  const { galleries, deleteGallery, updateGalleryPricing } = useArtist();
  const navigate = useNavigate();
  
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState<string>('');
  const [annualPrice, setAnnualPrice] = useState<string>('');
  
  const handleDeleteGallery = async (galleryId: string) => {
    if (confirm("Are you sure you want to delete this gallery? This action cannot be undone.")) {
      try {
        await deleteGallery(galleryId);
        toast.success("Gallery deleted successfully");
      } catch (error) {
        toast.error("Failed to delete gallery");
        console.error(error);
      }
    }
  };
  
  const handlePricingUpdate = async (galleryId: string) => {
    try {
      const monthly = parseFloat(monthlyPrice);
      const annual = parseFloat(annualPrice);
      
      if (isNaN(monthly) || isNaN(annual)) {
        toast.error("Please enter valid prices");
        return;
      }
      
      await updateGalleryPricing(galleryId, { monthly, annual });
      toast.success("Gallery pricing updated successfully");
      setSelectedGallery(null);
    } catch (error) {
      toast.error("Failed to update pricing");
      console.error(error);
    }
  };
  
  const openPricingDialog = (galleryId: string) => {
    const gallery = galleries.find(g => g.id === galleryId);
    if (gallery) {
      setMonthlyPrice(gallery.pricing.monthly.toString());
      setAnnualPrice(gallery.pricing.annual.toString());
      setSelectedGallery(galleryId);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Galleries</h1>
        <Button 
          onClick={() => navigate('/artist/galleries/create')}
        >
          <Plus size={16} className="mr-2" />
          Create New Gallery
        </Button>
      </div>
      
      {galleries.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Images className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">No galleries yet</h2>
          <p className="text-gray-500 mb-6">Create your first gallery to showcase your work</p>
          <Button 
            onClick={() => navigate('/artist/galleries/create')}
          >
            Create Your First Gallery
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="overflow-hidden">
              <div className="aspect-video relative cursor-pointer" onClick={() => navigate(`/artist/galleries/${gallery.id}`)}>
                <img 
                  src={gallery.coverImageUrl} 
                  alt={gallery.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 w-full p-4">
                    <p className="text-white text-sm">
                      {gallery.imageIds.length} {gallery.imageIds.length === 1 ? 'image' : 'images'}
                    </p>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle>{gallery.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{gallery.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {gallery.pricing.monthly > 0 ? (
                      <span className="text-green-600 font-medium">${gallery.pricing.monthly}/month</span>
                    ) : (
                      <span className="text-gray-500">No pricing set</span>
                    )}
                  </span>
                  <span className="text-gray-500">Created: {gallery.creationDate}</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-2">
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => navigate(`/artist/galleries/${gallery.id}`)}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => openPricingDialog(gallery.id)}
                  >
                    <DollarSign size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteGallery(gallery.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pricing Dialog */}
      <Dialog open={!!selectedGallery} onOpenChange={(open) => !open && setSelectedGallery(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Gallery Pricing</DialogTitle>
            <DialogDescription>
              Set the pricing for your gallery. Viewers will need to subscribe to access this content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyPrice">Monthly Subscription Price ($)</Label>
              <Input
                id="monthlyPrice"
                type="number"
                min="0"
                step="0.01"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                placeholder="e.g. 4.99"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualPrice">Annual Subscription Price ($)</Label>
              <Input
                id="annualPrice"
                type="number"
                min="0"
                step="0.01"
                value={annualPrice}
                onChange={(e) => setAnnualPrice(e.target.value)}
                placeholder="e.g. 49.99"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Annual plans typically offer a discount compared to paying monthly.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={() => selectedGallery && handlePricingUpdate(selectedGallery)}
            >
              Save Pricing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistGalleriesPage;
