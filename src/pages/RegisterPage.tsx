
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gallery-primary">GalleryNook</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Create a new account
          </h2>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
