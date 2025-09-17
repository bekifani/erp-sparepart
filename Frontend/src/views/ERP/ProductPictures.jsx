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

function ProductPictures() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const media_url = useSelector((state) => state.auth.media_url);
  
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Fetch product pictures from API
  const fetchProductPictures = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching product pictures from:', `${app_url}/api/images/product-pictures`);
      console.log('📋 Request headers:', {
        'Authorization': `Bearer ${localStorage.getItem('token') ? '***TOKEN***' : 'NO_TOKEN'}`,
        'Content-Type': 'application/json',
      });
      
      const response = await fetch(`${app_url}/api/images/product-pictures`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Product pictures data received:', data);
        console.log('📊 Number of images:', data.length);
        setImages(data);
        setFilteredImages(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch product pictures');
        console.error('📄 Response status:', response.status);
        console.error('📄 Response text:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          console.error('📄 Error JSON:', errorJson);
        } catch (e) {
          console.error('📄 Could not parse error as JSON');
        }
      }
    } catch (error) {
      console.error('💥 Network/JS Error fetching product pictures:', error);
      console.error('💥 Error stack:', error.stack);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductPictures();
  }, []);

  // Filter images based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image =>
        image.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.oe_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          {t("Product Pictures")}
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
                  placeholder={t("Search by product code, OE code, description, product name, or brand...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                onClick={fetchProductPictures}
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
              <span className="ml-2">{t("Loading product pictures...")}</span>
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
                      alt={image.product_name || image.description}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 truncate">
                      {image.product_name || image.description || 'N/A'}
                    </h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Product Code:</span> {image.product_code || 'N/A'}</p>
                      <p><span className="font-medium">OE Code:</span> {image.oe_code || 'N/A'}</p>
                      <p><span className="font-medium">Brand:</span> {image.brand_name || 'N/A'}</p>
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
              <Lucide icon="ImageOff" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? t("No product pictures found matching your search.") : t("No product pictures available.")}
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
              {t("Product Picture Details")}
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            {selectedImage && (
              <>
                <div className="col-span-12 lg:col-span-6">
                  <img
                    src={getImageUrl(selectedImage.image)}
                    alt={selectedImage.product_name || selectedImage.description}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6 space-y-4">
                  <div>
                    <FormLabel className="font-semibold">Product Name</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.product_name || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Product Code</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.product_code || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">OE Code</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.oe_code || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Description</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.description || 'N/A'}</p>
                  </div>
                  <div>
                    <FormLabel className="font-semibold">Brand Name</FormLabel>
                    <p className="text-sm text-gray-700">{selectedImage.brand_name || 'N/A'}</p>
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

export default ProductPictures;
