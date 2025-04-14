
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtist } from '@/contexts/ArtistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Image, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const ImageUploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { uploadImages } = useArtist();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Check if adding these files would exceed the 10 file limit
      if (selectedFiles.length + fileArray.length > 10) {
        toast.error('You can only upload up to 10 images at a time');
        return;
      }
      
      const newFiles = [...selectedFiles, ...fileArray];
      setSelectedFiles(newFiles);
      
      // Generate previews
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      
      // Initialize titles and descriptions for new files
      setTitles([...titles, ...fileArray.map(file => file.name.split('.')[0])]);
      setDescriptions([...descriptions, ...fileArray.map(() => '')]);
    }
  };

  const removeFile = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setTitles(prev => prev.filter((_, i) => i !== index));
    setDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateTitle = (index: number, value: string) => {
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const updateDescription = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadImages(selectedFiles, titles, descriptions);
      
      // Clean up and navigate back
      selectedFiles.forEach((_, index) => {
        URL.revokeObjectURL(previews[index]);
      });
      
      navigate('/artist/dashboard');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
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
      
      <h1 className="text-3xl font-bold mb-2">Upload Images</h1>
      <p className="text-gray-600 mb-6">Upload up to 10 images at a time to your portfolio</p>
      
      <div className="mb-8">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div 
              className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 text-center mb-1">
                Drag and drop your images here, or click to browse
              </p>
              <p className="text-xs text-gray-500 text-center">
                Supports JPG, PNG, GIF (Up to 10 MB each, max 10 files)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedFiles.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Selected Images ({selectedFiles.length}/10)</h2>
          
          <div className="space-y-6 mb-8">
            {selectedFiles.map((file, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 relative">
                      <img 
                        src={previews[index]} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={titles[index]}
                        onChange={(e) => updateTitle(index, e.target.value)}
                        placeholder="Image title"
                        disabled={isUploading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={descriptions[index]}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        placeholder="Image description (optional)"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate('/artist/dashboard')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-gallery-primary hover:bg-gallery-primary/90"
            >
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </Button>
          </div>
        </>
      )}
      
      {selectedFiles.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <Image className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No images selected yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
