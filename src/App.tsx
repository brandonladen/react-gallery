
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { GalleryProvider } from "./contexts/GalleryContext";
import { ArtistProvider } from "./contexts/ArtistContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute";
import MainLayout from "./components/layout/MainLayout";
import ArtistLayout from "./components/artist/ArtistLayout";
import AdminLayout from "./components/admin/AdminLayout";
import HomePage from "./pages/HomePage";
import GalleriesPage from "./pages/GalleriesPage";
import GalleryDetailPage from "./pages/GalleryDetailPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ArtistLoginPage from "./pages/ArtistLoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

// Artist pages
import ArtistDashboardPage from "./pages/artist/ArtistDashboardPage";
import ImageUploadPage from "./pages/artist/ImageUploadPage";
import CreateGalleryPage from "./pages/artist/CreateGalleryPage";
import { default as ArtistGalleryDetailPage } from "./pages/artist/GalleryDetailPage";
import ArtistGalleriesPage from "./pages/artist/GalleriesPage";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { default as AdminImageUploadPage } from "./pages/admin/ImageUploadPage";
import PricingPage from "./pages/admin/PricingPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <GalleryProvider>
            <ArtistProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes in MainLayout */}
                    <Route element={<MainLayout />}>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/artist/login" element={<ArtistLoginPage />} />
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      
                      {/* Protected user routes */}
                      <Route 
                        path="/galleries" 
                        element={
                          <GalleriesPage />
                        } 
                      />
                      <Route 
                        path="/galleries/:id" 
                        element={
                          <ProtectedRoute>
                            <GalleryDetailPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/subscriptions" 
                        element={
                          <ProtectedRoute>
                            <SubscriptionsPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/checkout/:planId" 
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/account" 
                        element={
                          <ProtectedRoute>
                            <AccountPage />
                          </ProtectedRoute>
                        } 
                      />
                    </Route>
                    
                    {/* Artist routes with ArtistLayout */}
                    <Route path="/artist" element={<ArtistLayout />}>
                      <Route path="dashboard" element={<ArtistDashboardPage />} />
                      <Route path="upload" element={<ImageUploadPage />} />
                      <Route path="galleries" element={<ArtistGalleriesPage />} />
                      <Route path="galleries/create" element={<CreateGalleryPage />} />
                      <Route path="galleries/:id" element={<ArtistGalleryDetailPage />} />
                    </Route>
                    
                    {/* Admin routes with AdminLayout */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route 
                        path="dashboard" 
                        element={
                          <ProtectedAdminRoute>
                            <AdminDashboardPage />
                          </ProtectedAdminRoute>
                        } 
                      />
                      <Route 
                        path="upload" 
                        element={
                          <ProtectedAdminRoute>
                            <AdminImageUploadPage />
                          </ProtectedAdminRoute>
                        } 
                      />
                      <Route 
                        path="pricing" 
                        element={
                          <ProtectedAdminRoute>
                            <PricingPage />
                          </ProtectedAdminRoute>
                        } 
                      />
                      <Route 
                        path="analytics" 
                        element={
                          <ProtectedAdminRoute>
                            <AnalyticsPage />
                          </ProtectedAdminRoute>
                        } 
                      />
                      <Route 
                        path="settings" 
                        element={
                          <ProtectedAdminRoute>
                            <SettingsPage />
                          </ProtectedAdminRoute>
                        } 
                      />
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ArtistProvider>
          </GalleryProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
