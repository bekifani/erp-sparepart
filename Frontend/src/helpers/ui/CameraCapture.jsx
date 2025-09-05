import React, { useState, useRef, useCallback, useEffect } from 'react';
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";

const CameraCapture = ({ onCapture, capturedImage = null, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setIsOpen(true);
      
      // Set video source after state update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 data URL instead of blob for easier backend handling
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const imageUrl = dataUrl;
      
      // Create a mock blob object with the data URL
      const mockBlob = {
        data: dataUrl,
        type: 'image/jpeg'
      };
      
      onCapture(mockBlob, imageUrl);
      closeCamera();
    }
  };

  const removeImage = () => {
    onCapture(null, null);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline-primary"
          onClick={openCamera}
          className="w-full flex items-center justify-center gap-2"
        >
          <Lucide icon="Camera" className="w-4 h-4" />
          Take Picture
        </Button>

        {/* Display captured image */}
        {capturedImage && (
          <div className="relative group">
            <img
              src={capturedImage.url || capturedImage}
              alt="Captured"
              className="w-full h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Lucide icon="X" className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <Dialog open={isOpen} onClose={closeCamera} size="xl">
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Take Picture</h2>
          </Dialog.Title>
          <Dialog.Description>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-96 bg-black rounded"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {stream && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={capturePhoto}
                    className="rounded-full w-16 h-16 flex items-center justify-center"
                    disabled={false}
                  >
                    <Lucide icon="Camera" className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={closeCamera}
              className="w-20 mr-1"
            >
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default CameraCapture;
