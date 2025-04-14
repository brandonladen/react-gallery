
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">About GalleryNook</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            GalleryNook was founded with a simple mission: to connect photography enthusiasts with stunning, high-quality images from professional photographers around the world.
          </p>
          <p className="text-gray-600 mb-6">
            We believe in the power of visual storytelling and aim to provide a platform where photographers can showcase their work and users can access beautiful imagery for inspiration, enjoyment, and professional use.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Our Team</h2>
          <p className="text-gray-600 mb-6">
            Our dedicated team consists of photography enthusiasts, developers, and designers who are passionate about creating the best possible experience for our users.
          </p>
          <p className="text-gray-600">
            We're constantly working to improve GalleryNook, add new features, and expand our collection of galleries.
          </p>
        </div>
        
        <div>
          <Card className="shadow-lg overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d" 
                alt="Photography equipment"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">The Power of Photography</h3>
              <p className="text-gray-600">
                We believe that photography has the power to inspire, educate, and transform. Our curated galleries showcase the beauty of our world and the talent of the photographers who capture it.
              </p>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              We'd love to hear from you! If you have any questions, feedback, or inquiries, please don't hesitate to reach out.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Email:</strong> contact@gallerynook.com</p>
              <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Gallery Street, Photoville, CA 90210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
