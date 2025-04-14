
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  galleryId: z.string().min(1, "Please select a gallery"),
  title: z.string().min(1, "Image title is required"),
  description: z.string().optional(),
  // In a real app, we would validate the file type and size
  // Here we just check if it's present
  imageFile: z.any()
    .refine((file) => file?.length > 0, "Image file is required")
});

const ImageUploadPage = () => {
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string, status: 'success' | 'error' }>>([]);
  const [uploading, setUploading] = useState(false);
  
  // Mock galleries
  const galleries = [
    { id: "gallery-1", name: "Nature Landscapes" },
    { id: "gallery-2", name: "Urban Photography" },
    { id: "gallery-3", name: "Wildlife Collection" },
    { id: "gallery-4", name: "Abstract Art" },
  ];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      galleryId: "",
      title: "",
      description: "",
      imageFile: undefined,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the file name from the FileList
      const fileName = values.imageFile[0]?.name || "unknown.jpg";
      
      console.log('Uploading image:', {
        galleryId: values.galleryId,
        title: values.title,
        description: values.description,
        file: fileName
      });
      
      // Add to uploaded images list
      setUploadedImages(prev => [
        ...prev, 
        { name: fileName, status: 'success' }
      ]);
      
      // Reset form
      form.reset({
        galleryId: values.galleryId, // Keep gallery selection
        title: "",
        description: "",
        imageFile: undefined,
      });
      
      // Notify success
      toast.success("Image uploaded successfully");
      
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Add to uploaded images list with error status
      const fileName = values.imageFile[0]?.name || "unknown.jpg";
      setUploadedImages(prev => [
        ...prev, 
        { name: fileName, status: 'error' }
      ]);
      
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Images</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>
                Add images to an existing gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="galleryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gallery</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a gallery" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {galleries.map(gallery => (
                              <SelectItem key={gallery.id} value={gallery.id}>
                                {gallery.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => onChange(event.target.files)}
                              className="hidden"
                              id="image-upload"
                              {...fieldProps}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                              {value && value[0] && (
                                <p className="mt-2 text-sm font-medium text-gallery-primary">
                                  Selected: {value[0].name}
                                </p>
                              )}
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={uploading}
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>
                Recently uploaded images
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedImages.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  No images uploaded yet
                </div>
              ) : (
                <ul className="space-y-2">
                  {uploadedImages.map((image, index) => (
                    <li key={index} className="flex items-center justify-between text-sm p-2 border rounded">
                      <span className="truncate max-w-[180px]">{image.name}</span>
                      {image.status === 'success' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;
