import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import React, { useState, useEffect } from "react";
import Notification from "@/components/Base/Notification";
import { FormInput, FormLabel } from "@/components/Base/Form";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import { useSelector } from "react-redux";
import { Dialog } from "@/components/Base/Headless";
import Can from "@/helpers/PermissionChecker/index.js";

function LabelImages() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const media_url = useSelector((state) => state.auth.media_url);
  
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Fetch label images from API
  const fetchLabelImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${app_url}/api/images/label-images`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setImages(data);
        setFilteredImages(data);
      } else {
        console.error('Failed to fetch label images');
      }
    } catch (error) {
      console.error('Error fetching label images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabelImages();
  }, []);

  // Filter images based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image =>
        image.label_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.price?.toString().includes(searchTerm.toLowerCase()) ||
        image.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.image_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchTerm, images]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${media_url}/${imagePath}`;
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {t("Label Images")}
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 lg:col-span-12">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <FormLabel htmlFor="search">{t("Search")}</FormLabel>
                <FormInput
                  id="search"
                  type="text"
                  placeholder={t("Search by label name, price, brand, or image type...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                onClick={fetchLabelImages}
                className="mt-6"
              >
                <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                {t("Refresh")}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <LoadingIcon icon="oval" className="w-8 h-8" />
              <span className="ml-2">{t("Loading label images...")}</span>
            </div>
          )}

          {/* Images Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={getImageUrl(image.image)}
                      alt={image.label_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 truncate">
                      {image.label_name || 'N/A'}
                    </h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Price:</span> {image.price || 'N/A'}</p>
                      <p><span className="font-medium">Brand:</span> {image.brand_name || 'N/A'}</p>
                      <p><span className="font-medium">Type:</span> {image.image_type || 'N/A'}</p>
                      <p><span className="font-medium">Created:</span> {new Date(image.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <Lucide icon="Tag" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? t("No label images found matching your search.") : t("No label images available.")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onClose={() => setShowImageModal(false)} size="xl">
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              {t("Label Image Details")}
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            {selectedImage && (
              <>
                <div className="col-span-12 lg:col-span-6">
                  <img
                    src={getImageUrl(selectedImage.image)}
                    alt={selectedImage.label_name}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6 space-y-4">
                  <div>
                    <FormLabel className="font-semibold">Label Name</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.label_name || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Price</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.price || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Brand Name</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.brand_name || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Image Type</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.image_type || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Source Table</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.source_table || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Created Date</FormLabel>
                    <p className="text-sm text-gray-700">{new Date(selectedImage.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </>
            )}
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => setShowImageModal(false)}
              className="w-20 mr-1"
            >
              {t("Close")}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default LabelImages;
