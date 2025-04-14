
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtist } from '@/contexts/ArtistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, Images, Plus } from 'lucide-react';

const ArtistDashboardPage = () => {
  const { images, galleries, isLoading } = useArtist();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 artist-dashboard">
      <h1 className="text-3xl font-bold mb-2">Artist Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your images and galleries</p>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="galleries">Galleries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Images</CardTitle>
                <CardDescription>Manage your uploaded images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{images.length}</div>
                <p className="text-sm text-gray-500">Total images in your portfolio</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/artist/upload')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Galleries</CardTitle>
                <CardDescription>Manage your created galleries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{galleries.length}</div>
                <p className="text-sm text-gray-500">Public gallery collections</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/artist/galleries/create')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Gallery
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/artist/upload')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Images
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/artist/galleries/create')}
                >
                  <Images className="w-4 h-4 mr-2" />
                  Create New Gallery
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/artist/galleries')}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Manage Existing Galleries
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.slice(0, 6).map((image) => (
                <div 
                  key={image.id} 
                  className="aspect-square rounded-md overflow-hidden relative group cursor-pointer"
                  onClick={() => navigate('/artist/images')}
                >
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-center py-12 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No images uploaded yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => navigate('/artist/upload')}
                  >
                    Upload Your First Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Galleries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleries.slice(0, 3).map((gallery) => (
                <Card key={gallery.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={gallery.coverImageUrl} 
                      alt={gallery.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{gallery.name}</CardTitle>
                    <CardDescription>{gallery.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        {gallery.imageIds.length} {gallery.imageIds.length === 1 ? 'image' : 'images'}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${gallery.pricing.monthly}/month
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/artist/galleries/${gallery.id}`)}
                    >
                      Manage Gallery
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {galleries.length === 0 && (
                <div className="col-span-full text-center py-12 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No galleries created yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => navigate('/artist/galleries/create')}
                  >
                    Create Your First Gallery
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Images</h2>
            <Button onClick={() => navigate('/artist/upload')}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative">
                <div className="aspect-square rounded-md overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium truncate">{image.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{image.description}</p>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-md flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigate(`/artist/images/${image.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <p className="text-gray-500">No images uploaded yet</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/artist/upload')}
              >
                Upload Your First Image
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="galleries">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Galleries</h2>
            <Button onClick={() => navigate('/artist/galleries/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Gallery
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Card key={gallery.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={gallery.coverImageUrl} 
                    alt={gallery.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{gallery.name}</CardTitle>
                  <CardDescription>{gallery.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {gallery.imageIds.length} {gallery.imageIds.length === 1 ? 'image' : 'images'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${gallery.pricing.monthly}/month
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/artist/galleries/${gallery.id}`)}
                  >
                    Manage Gallery
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {galleries.length === 0 && (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <p className="text-gray-500">No galleries created yet</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/artist/galleries/create')}
              >
                Create Your First Gallery
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDashboardPage;
