
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { UserCheck, ShieldAlert } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleArtistLogin = () => {
    navigate('/artist/login');
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gallery-primary">GalleryNook</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <LoginForm />

        <div className="mt-6 space-y-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleArtistLogin}
          >
            <UserCheck className="mr-2 h-5 w-5" />
            Login as an Artist
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleAdminLogin}
          >
            <ShieldAlert className="mr-2 h-5 w-5" />
            Login as an Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
