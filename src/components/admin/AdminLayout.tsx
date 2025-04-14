
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Image,
  DollarSign,
  BarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/upload', label: 'Image Upload', icon: <Image className="w-5 h-5" /> },
    { path: '/admin/pricing', label: 'Edit Pricing', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart className="w-5 h-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b sticky top-0 z-40 h-16 flex items-center px-6 justify-between shadow-sm">
        <Link to="/" className="text-2xl font-bold text-gallery-primary flex items-center">
          <ShieldAlert className="mr-2 h-6 w-6" />
          GalleryNook Admin
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-sm mr-2">
                {user.firstName} {user.lastName}
              </span>
              <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside 
          className={`flex flex-col transition-all duration-300 ease-in-out bg-white border-r z-30 h-[calc(100vh-4rem)] sticky top-16 ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="py-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 mb-1 mx-2 rounded-md
                    ${location.pathname === item.path 
                      ? 'bg-gallery-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-3 border-t">
            <button
              onClick={handleLogout}
              className={`
                flex items-center px-3 py-3 w-full rounded-md text-red-500 hover:bg-red-50
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Log out</span>}
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-10 bg-white rounded-full p-1 border shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </aside>
        
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
