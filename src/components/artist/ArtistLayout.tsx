
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ArtistSideNav from './ArtistSideNav';

const ArtistLayout: React.FC = () => {
  const { isAuthenticated, isArtist } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/artist/login" />;
  }
  
  // Redirect to regular user dashboard if authenticated but not an artist
  if (isAuthenticated && !isArtist) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block md:w-64 lg:w-72">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <ArtistSideNav />
        </div>
      </div>
      
      <div className="flex-1">
        <main className="min-h-screen bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ArtistLayout;
