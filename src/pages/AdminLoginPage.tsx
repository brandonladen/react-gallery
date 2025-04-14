
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { ShieldAlert } from 'lucide-react';

const AdminLoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gallery-primary">GalleryNook</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 flex items-center justify-center">
            <ShieldAlert className="mr-2 h-6 w-6" />
            Admin Portal
          </h2>
          <p className="mt-2 text-gray-600">
            Secure access for platform administrators
          </p>
        </div>
        
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default AdminLoginPage;
