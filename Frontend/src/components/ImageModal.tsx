import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, ZoomIn, ZoomOut, X } from 'lucide-react';

interface ImageModalProps {
  children: React.ReactNode;
  images?: string[];
  productName: string;
}

const ImageModal = ({ children, images = [], productName }: ImageModalProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [zoom, setZoom] = useState(1);

  // For now, we'll show placeholder images since no real images are provided
  const placeholderImages = Array(4).fill(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <Dialog onOpenChange={() => { setZoom(1); setCurrentImage(0); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold truncate">{productName}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-16 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetZoom}>
                Reset
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 overflow-hidden relative bg-muted/20">
            <div 
              className="w-full h-full flex items-center justify-center overflow-auto"
              style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
            >
              <div 
                className="flex items-center justify-center transition-transform duration-200 min-w-full min-h-full"
                style={{ transform: `scale(${zoom})` }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[currentImage]}
                    alt={`${productName} - Image ${currentImage + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-96 h-96 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="p-4 border-t">
            <div className="flex gap-2 justify-center overflow-x-auto">
              {placeholderImages.map((_, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 bg-muted rounded border-2 flex items-center justify-center transition-colors ${
                    currentImage === index 
                      ? 'border-primary' 
                      : 'border-muted-foreground/20 hover:border-primary/50'
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <Package className="h-6 w-6 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;