
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HomepageHero: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 px-4 text-center bg-gradient-to-br from-gallery-primary/10 to-gallery-accent/5 rounded-3xl mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
        Discover Beautiful Photography
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Explore our curated collection of high-quality images from professional photographers around the world.
      </p>
      
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Join Now
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      )}
      
      {isAuthenticated && (
        <Link to="/galleries">
          <Button size="lg">
            Explore Galleries
          </Button>
        </Link>
      )}
    </section>
  );
};

export default HomepageHero;
