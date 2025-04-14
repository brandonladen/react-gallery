
import React, { useEffect, useRef, useState } from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import { X, ChevronLeft, ChevronRight, Info, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface ImageViewerProps {
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ onClose }) => {
  const { activeGallery, activeImage, setActiveImage, zoomLevel, setZoomLevel } = useGallery();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Maximum zoom level - increased from 3 to 6 for deeper zoom
  const MAX_ZOOM_LEVEL = 6;
  // Zoom increment - increased from 0.1 to 0.5 for more noticeable zoom steps
  const ZOOM_INCREMENT = 0.5;
  // Wheel zoom sensitivity - increased for more responsive wheel zooming
  const WHEEL_ZOOM_INCREMENT = 0.2;

  // If no active image, close the viewer
  useEffect(() => {
    if (!activeImage) {
      onClose();
    }
  }, [activeImage, onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === '+') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Enable scrolling on image
    const handleWheel = (e: WheelEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
          // Zoom in at mouse position with enhanced increment
          handleZoomAtPosition(WHEEL_ZOOM_INCREMENT, e.clientX, e.clientY);
        } else {
          // Zoom out at mouse position with enhanced increment
          handleZoomAtPosition(-WHEEL_ZOOM_INCREMENT, e.clientX, e.clientY);
        }
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeGallery, activeImage]);

  const showPrevImage = () => {
    if (!activeGallery || !activeImage) return;
    
    const currentIndex = activeGallery.images.findIndex(img => img.id === activeImage.id);
    if (currentIndex > 0) {
      setActiveImage(activeGallery.images[currentIndex - 1]);
      resetView();
    }
  };

  const showNextImage = () => {
    if (!activeGallery || !activeImage) return;
    
    const currentIndex = activeGallery.images.findIndex(img => img.id === activeImage.id);
    if (currentIndex < activeGallery.images.length - 1) {
      setActiveImage(activeGallery.images[currentIndex + 1]);
      resetView();
    }
  };

  const handleZoomIn = () => {
    // More intense zoom step with higher maximum zoom
    const newZoomLevel = Math.min(zoomLevel + ZOOM_INCREMENT, MAX_ZOOM_LEVEL);
    setZoomLevel(newZoomLevel);
  };

  const handleZoomOut = () => {
    // Corresponding zoom out
    const newZoomLevel = Math.max(zoomLevel - ZOOM_INCREMENT, 0.5);
    setZoomLevel(newZoomLevel);
    
    // Reset position if we're zooming back to original size
    if (zoomLevel <= 1.1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomAtPosition = (zoomDelta: number, clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    // Calculate new zoom level with increased maximum
    const newZoomLevel = Math.max(0.5, Math.min(MAX_ZOOM_LEVEL, zoomLevel + zoomDelta));
    
    // Get container bounds
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate position relative to container center
    const containerCenterX = rect.left + rect.width / 2;
    const containerCenterY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center
    const mouseX = clientX - containerCenterX;
    const mouseY = clientY - containerCenterY;
    
    // Calculate new position based on zoom change
    const zoomRatio = newZoomLevel / zoomLevel;
    const newPositionX = mouseX - (mouseX - position.x) * zoomRatio;
    const newPositionY = mouseY - (mouseY - position.y) * zoomRatio;
    
    // Update state
    setZoomLevel(newZoomLevel);
    setPosition({ x: newPositionX, y: newPositionY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const showImageInfo = () => {
    if (!activeImage) return;
    
    toast(activeImage.title, {
      description: activeImage.description,
      duration: 5000,
    });
  };

  const resetView = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  if (!activeImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Top controls */}
      <div className="p-4 flex justify-between items-center">
        <div className="text-white">
          <h3 className="text-lg font-medium">{activeImage.title}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={showImageInfo}
          >
            <Info size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
      </div>
      
      {/* Image container */}
      <div 
        className="flex-1 flex justify-center items-center overflow-hidden relative"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }}
      >
        <img
          src={activeImage.url}
          alt={activeImage.title}
          className="max-h-full max-w-full transition-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
          draggable="false"
        />
        
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 text-white bg-black/30 hover:bg-black/50 h-12 w-12 rounded-full"
          onClick={showPrevImage}
        >
          <ChevronLeft size={24} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 text-white bg-black/30 hover:bg-black/50 h-12 w-12 rounded-full"
          onClick={showNextImage}
        >
          <ChevronRight size={24} />
        </Button>
      </div>
      
      {/* Bottom controls */}
      <div className="p-4 flex justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.5}
        >
          <ZoomOut size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={resetView}
        >
          <span className="text-sm font-mono">{Math.round(zoomLevel * 100)}%</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleZoomIn}
          disabled={zoomLevel >= MAX_ZOOM_LEVEL}
        >
          <ZoomIn size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleRotate}
        >
          <RotateCw size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ImageViewer;
