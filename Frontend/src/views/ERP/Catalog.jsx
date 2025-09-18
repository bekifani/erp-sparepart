import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom"; // Add this line
import Button from "@/components/Base/Button";
import { FormInput, FormLabel } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import Notification from "@/components/Base/Notification";
import {
  useGetCatalogProductsQuery,
  useExportCatalogPdfMutation,
  useGetProductDetailsQuery,
  useGetProductSpecificationsQuery,
  useGetProductCrossCarsQuery,
  useGetProductCrossCodesQuery
} from "@/stores/apiSlice";

function Catalog() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const media_url = useSelector((state) => state.auth.media_url);
  const token = useSelector((state) => state.auth.token);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [crossCodeSearch, setCrossCodeSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 products per page
  
  // Data state
  const [categories, setCategories] = useState([]);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [fullScreenImageSrc, setFullScreenImageSrc] = useState("");
  
  // Notifications
  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  
  // API hooks
  const { data: productsData, isLoading: loading, refetch } = useGetCatalogProductsQuery({
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    category: selectedCategory,
    carModel: selectedCarModel,
    crossCode: crossCodeSearch
  });

  const { data: allProductsData } = useGetCatalogProductsQuery({
    page: 1,
    size: 10000, // Large number to get all products
    search: "",
    category: "",
    carModel: "",
    crossCode: ""
  });

  const { data: productDetails, isLoading: loadingDetails, error: detailsError } = useGetProductDetailsQuery(
    selectedProduct?.id,
    { skip: !selectedProduct }
  );

  const { data: productSpecifications, isLoading: loadingSpecs } = useGetProductSpecificationsQuery(
    selectedProduct?.id,
    { skip: !selectedProduct }
  );

  const { data: productCrossCars, isLoading: loadingCrossCars } = useGetProductCrossCarsQuery(
    selectedProduct?.id,
    { skip: !selectedProduct }
  );

  const { data: productCrossCodes, isLoading: loadingCrossCodes } = useGetProductCrossCodesQuery(
    selectedProduct?.id,
    { skip: !selectedProduct }
  );

  // Debug logging
  useEffect(() => {
    if (selectedProduct) {
      console.log('Selected product:', selectedProduct);
      console.log('Loading details:', loadingDetails);
      console.log('Product details:', productDetails);
      console.log('Details error:', detailsError);
    }
  }, [selectedProduct, loadingDetails, productDetails, detailsError]);

  const [exportPdf, { isLoading: exporting }] = useExportCatalogPdfMutation();

  // Extract products data
  const products = productsData?.data?.data || [];
  const allProducts = allProductsData?.data?.data || [];
  const total = productsData?.data?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Debug products data to see image fields
  useEffect(() => {
    if (products.length > 0) {
      console.log('First product data:', products[0]);
      console.log('Available fields:', Object.keys(products[0]));
      console.log('ProductInformation (capital):', products[0].ProductInformation);
      console.log('productinformation (lowercase):', products[0].productinformation);
      console.log('product_information (underscore):', products[0].product_information);
      
      // Check all possible image fields
      const productInfo = products[0].ProductInformation || products[0].productinformation || products[0].product_information;
      console.log('Resolved product info:', productInfo);
      console.log('Technical image field:', productInfo?.technical_image);
      console.log('Image field:', productInfo?.image);
      console.log('Media URL:', media_url);
      
      if (productInfo?.technical_image) {
        console.log('Full technical image path:', `${media_url}${productInfo.technical_image}`);
      }
    }
  }, [products]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${app_url}/api/all_categors`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Categories response:', data); // Debug log
      
      // Handle different response formats from the API
      if (data.success && data.data) {
        // BaseController format: {success: true, data: [...]}
        setCategories(data.data);
      } else if (Array.isArray(data.data)) {
        // Direct array in data property
        setCategories(data.data);
      } else if (Array.isArray(data)) {
        // Direct array response
        setCategories(data);
      } else {
        console.error('Categories fetch failed:', data.message || 'Unknown format');
        console.log('Full response:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    setActiveTab("specifications"); // Reset to first tab
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCarModel("");
    setCrossCodeSearch("");
    setCurrentPage(1);
  };

  // Auto-trigger search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || selectedCategory || selectedCarModel || crossCodeSearch) {
        handleSearch();
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedCarModel, crossCodeSearch]);

  const handleExportPDF = async () => {
    try {
      console.log('Starting PDF export...');
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedCarModel) filters.car_model = selectedCarModel;
      if (crossCodeSearch) filters.cross_code = crossCodeSearch;
      
      console.log('Export filters:', filters);
      
      // Build URL with filters
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.car_model) params.set('car_model', filters.car_model);
      if (filters.cross_code) params.set('cross_code', filters.cross_code);
      
      const exportUrl = `${app_url}/api/catalog/export-pdf?${params}`;
      console.log('Export URL:', exportUrl);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `catalog-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToastMessage(t('PDF export started'));
      basicStickyNotification.current?.showToast();
      
    } catch (error) {
      console.error('PDF export error:', error);
      setToastMessage(t('Error exporting PDF'));
      basicStickyNotification.current?.showToast();
    }
  };

  const shareProduct = (product) => {
    if (navigator.share) {
      navigator.share({
        title: product.description,
        text: `Check out this product: ${product.description}`,
        url: `${window.location.origin}/menu/catalog?product=${product.id}`
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/menu/catalog?product=${product.id}`;
      navigator.clipboard.writeText(url).then(() => {
        setToastMessage(t('Product link copied to clipboard'));
        basicStickyNotification.current?.showToast();
      });
    }
  };

  const downloadProductPDF = async (productId) => {
    try {
      console.log('Downloading product PDF for ID:', productId);
      const downloadUrl = `${app_url}/api/catalog/product/${productId}/pdf`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `product-${productId}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToastMessage(t('Product PDF download started'));
      basicStickyNotification.current?.showToast();
      
    } catch (error) {
      console.error('Product PDF download error:', error);
      setToastMessage(t('Error downloading product PDF'));
      basicStickyNotification.current?.showToast();
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 mx-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          {t('Previous')}
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 mx-1 text-sm border rounded ${
            i === currentPage
              ? 'bg-primary text-white border-primary'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 mx-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          {t('Next')}
        </button>
      );
    }

    return <div className="flex justify-center mt-6">{pages}</div>;
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest('.share-dropdown')) {
        setShowShareMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Close full screen image on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showFullScreenImage) {
        setShowFullScreenImage(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showFullScreenImage]);

  // Handle URL parameters for shared product links
  useEffect(() => {
    const productId = searchParams.get('product');
    console.log('URL productId:', productId);
    console.log('Products loaded:', products?.length);
    console.log('Available product IDs:', products?.map(p => p.id));
    
    if (productId && allProducts && allProducts.length > 0) {
      const product = allProducts.find((product) => product.id === parseInt(productId));
      console.log('Found product:', product);
      
      if (product) {
        console.log('Opening product modal for:', product.description);
        openProductModal(product);
        
        // Remove the product parameter from URL after opening modal
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('product');
        setSearchParams(newSearchParams, { replace: true });
      } else {
        // Product not found on current page, need to search for it
        console.log('Product not found on current page, searching...');
        searchForProduct(parseInt(productId));
      }
    }
  }, [searchParams, allProducts, setSearchParams]);

  const searchForProduct = async (productId) => {
    // Implement search logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Product Catalog')}</h1> */}
        <p className="text-gray-600">{t('Browse our complete product catalog')}</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Product Name/Description Search */}
          <div>
            <FormLabel>{t('Search Products')}</FormLabel>
            <FormInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('Product name or description')}
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full">
            <FormLabel>{t('Category')}</FormLabel>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkmode-700 dark:border-darkmode-600 dark:text-white appearance-none bg-transparent"
                style={{
                  paddingRight: '2.5rem',
                }}
              >
                <option value="" className="text-gray-900 dark:text-white bg-white dark:bg-darkmode-700">
                  {t('All Categories')}
                </option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                    className="text-gray-900 dark:text-white bg-white dark:bg-darkmode-700 hover:bg-gray-100 dark:hover:bg-darkmode-600"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Car Model Search */}
          <div>
            <FormLabel>{t('Car Model')}</FormLabel>
            <TomSelectSearch
              apiUrl={`${app_url}/api/search_carmodel`}
              setValue={() => {}}
              variable="car_model_id"
              minQueryLength={2}
              customDataMapping={(item) => ({ 
                value: item.id, 
                text: `${item.brand || ''} ${item.model || item.car_model || ''} ${item.year ? `(${item.year})` : ''}`.trim() 
              })}
              onSelectionChange={(item) => setSelectedCarModel(item?.value || "")}
              placeholder={t('Search car models')}
            />
          </div>

          {/* Cross Code Search */}
          <div>
            <FormLabel>{t('Cross Code')}</FormLabel>
            <FormInput
              value={crossCodeSearch}
              onChange={(e) => setCrossCodeSearch(e.target.value)}
              placeholder={t('Alternate part number')}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSearch} variant="primary">
            <Lucide icon="Search" className="w-4 h-4 mr-2" />
            {t('Search')}
          </Button>
          <Button onClick={clearFilters} variant="secondary">
            <Lucide icon="X" className="w-4 h-4 mr-2" />
            {t('Clear Filters')}
          </Button>
          <Button onClick={handleExportPDF} variant="outline-primary" disabled={exporting}>
            <Lucide icon="FileText" className="w-4 h-4 mr-2" />
            {exporting ? t('Exporting...') : t('Get PDF')}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          {t('Showing')} {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, total)} {t('of')} {total} {t('products')}
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingIcon icon="oval" className="w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                {/* Product Image - Left Side */}
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const productInfo = product.ProductInformation || product.productinformation || product.product_information;
                    const technicalImage = productInfo?.technical_image || productInfo?.image;
                    
                    return technicalImage ? (
                      <img
                        src={`${media_url}${technicalImage}`}
                        alt={product.description || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null;
                  })()}
                  <div className="w-full h-full flex items-center justify-center" style={{display: (() => {
                    const productInfo = product.ProductInformation || product.productinformation || product.product_information;
                    const technicalImage = productInfo?.technical_image || productInfo?.image;
                    return technicalImage ? 'none' : 'flex';
                  })()}}>
                    <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                {/* Product Details - Right Side */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">Brand: <span className="font-medium text-gray-900">{product.brand?.brand_name || 'N/A'}</span></p>
                      <p className="text-sm text-gray-600 mb-1">Code: <span className="font-medium text-gray-900">{product.brand_code || 'N/A'}</span></p>
                      <p className="text-sm text-gray-600 mb-2">Name: <span className="font-medium text-gray-900">{product.localized_description || product.description || 'N/A'}</span></p>
                      {product.oe_code && (
                        <p className="text-sm text-gray-600">Compatible OEM: <span className="font-medium text-gray-900">{product.oe_code}</span></p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openProductModal(product)}
                      className="text-xs flex items-center gap-1"
                    >
                      <Lucide icon="Info" className="w-3 h-3" />
                      Information
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => downloadProductPDF(product.id)}
                      className="text-xs flex items-center gap-1"
                    >
                      <Lucide icon="Download" className="w-3 h-3" />
                      Download
                    </Button>
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => setShowShareMenu(showShareMenu === product.id ? null : product.id)}
                        className="p-2"
                      >
                        <Lucide icon="Share2" className="w-3 h-3" />
                      </Button>
                      {showShareMenu === product.id && (
                        <div className="share-dropdown absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[150px]">
                          <button
                            onClick={() => {
                              shareProduct(product);
                              setShowShareMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Lucide icon="Link" className="w-3 h-3" />
                            Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}

      {/* Product Details Modal */}
      <Dialog
        open={showProductModal}
        onClose={closeProductModal}
        size="5xl"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              {selectedProduct?.description || 'Product Details'}
            </h2>
          </Dialog.Title>
          <Dialog.Description>
            {loadingDetails ? (
              <div className="flex justify-center py-8">
                <LoadingIcon icon="oval" className="w-8 h-8" />
              </div>
            ) : productDetails ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Product Images */}
                <div className="space-y-4">
                  {(() => {
                    // Collect all available images from productinformation
                    const images = [];
                    const productInfo = productDetails?.data?.productinformation;
                    
                    // Add main image
                    if (productInfo?.image) {
                      images.push({
                        src: `${media_url}${productInfo.image}`,
                        alt: selectedProduct.description,
                        type: 'main'
                      });
                    }
                    
                    // Add technical image
                    if (productInfo?.technical_image) {
                      images.push({
                        src: `${media_url}${productInfo.technical_image}`,
                        alt: 'Technical Drawing',
                        type: 'technical'
                      });
                    }
                    
                    // Add images from the pictures column
                    if (productInfo?.pictures) {
                      console.log('Pictures data found:', productInfo.pictures, 'Type:', typeof productInfo.pictures);
                      
                      try {
                        let picturesData;
                        
                        // Handle different formats of pictures data
                        if (typeof productInfo.pictures === 'string') {
                          // If it's a JSON string, parse it
                          if (productInfo.pictures.startsWith('[') || productInfo.pictures.startsWith('{')) {
                            picturesData = JSON.parse(productInfo.pictures);
                          } else {
                            // If it's a single image path or comma-separated paths
                            picturesData = productInfo.pictures.split(',').map(img => img.trim()).filter(Boolean);
                          }
                        } else if (Array.isArray(productInfo.pictures)) {
                          // If it's already an array
                          picturesData = productInfo.pictures;
                        } else if (typeof productInfo.pictures === 'object') {
                          // If it's an object, try to extract image paths
                          picturesData = Object.values(productInfo.pictures).filter(Boolean);
                        }
                        
                        console.log('Processed pictures data:', picturesData);
                        
                        // Add each picture to the images array
                        if (Array.isArray(picturesData)) {
                          picturesData.forEach((picture, index) => {
                            if (picture && typeof picture === 'string' && picture.trim() !== '') {
                              const imagePath = picture.trim();
                              let imageSrc;
                              
                              // Check if it's base64 data
                              if (imagePath.startsWith('data:image/')) {
                                // It's already a complete base64 data URL
                                imageSrc = imagePath;
                              } else if (imagePath.startsWith('/9j/') || 
                                        imagePath.startsWith('iVBORw0KGgo') || 
                                        imagePath.startsWith('R0lGODlh') ||
                                        (imagePath.length > 100 && imagePath.match(/^[A-Za-z0-9+/]+=*$/) && !imagePath.includes('.'))) {
                                // Likely base64 image data (JPEG starts with /9j/, PNG with iVBORw0KGgo, GIF with R0lGODlh)
                                imageSrc = `data:image/jpeg;base64,${imagePath}`;
                              } else {
                                // It's a regular file path
                                imageSrc = `${media_url}${imagePath}`;
                              }
                              
                              images.push({
                                src: imageSrc,
                                alt: `Product Picture ${index + 1}`,
                                type: 'picture'
                              });
                            } else if (picture?.path || picture?.url || picture?.src) {
                              const imageSrc = picture.path || picture.url || picture.src;
                              let finalSrc;
                              
                              // Check if it's base64 data
                              if (imageSrc.startsWith('data:image/')) {
                                finalSrc = imageSrc;
                              } else if (imageSrc.startsWith('/9j/') || 
                                        imageSrc.startsWith('iVBORw0KGgo') || 
                                        imageSrc.startsWith('R0lGODlh') ||
                                        (imageSrc.length > 100 && imageSrc.match(/^[A-Za-z0-9+/]+=*$/) && !imageSrc.includes('.'))) {
                                finalSrc = `data:image/jpeg;base64,${imageSrc}`;
                              } else {
                                finalSrc = `${media_url}${imageSrc}`;
                              }
                              
                              images.push({
                                src: finalSrc,
                                alt: picture.alt || `Product Picture ${index + 1}`,
                                type: 'picture'
                              });
                            }
                          });
                        }
                      } catch (error) {
                        console.log('Error parsing pictures data:', error, productInfo.pictures);
                        // If parsing fails, try to use it as a single image path
                        if (typeof productInfo.pictures === 'string' && productInfo.pictures.length > 0) {
                          const imagePath = productInfo.pictures.trim();
                          let imageSrc;
                          
                          // Check if it's base64 data
                          if (imagePath.startsWith('data:image/')) {
                            imageSrc = imagePath;
                          } else if (imagePath.startsWith('/9j/') || 
                                    imagePath.startsWith('iVBORw0KGgo') || 
                                    imagePath.startsWith('R0lGODlh') ||
                                    (imagePath.length > 100 && imagePath.match(/^[A-Za-z0-9+/]+=*$/) && !imagePath.includes('.'))) {
                            imageSrc = `data:image/jpeg;base64,${imagePath}`;
                          } else {
                            imageSrc = `${media_url}${imagePath}`;
                          }
                          
                          images.push({
                            src: imageSrc,
                            alt: 'Product Picture',
                            type: 'picture'
                          });
                        }
                      }
                    }
                    
                    console.log('Final images array:', images);

                    return images.length > 0 ? (
                      <>
                        {/* Main Large Image */}
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border relative">
                          <img
                            src={images[selectedImageIndex]?.src}
                            alt={images[selectedImageIndex]?.alt}
                            className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              setFullScreenImageSrc(images[selectedImageIndex]?.src);
                              setShowFullScreenImage(true);
                            }}
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                            <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                          </div>
                          {/* Click indicator */}
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded text-xs">
                            <Lucide icon="Maximize2" className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex flex-wrap gap-2 justify-start mt-4">
                          {images.map((image, index) => (
                            <div 
                              key={index}
                              className={`w-16 h-16 bg-gray-100 rounded border cursor-pointer transition-colors ${
                                selectedImageIndex === index 
                                  ? 'border-blue-500 border-2' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => setSelectedImageIndex(index)}
                              title={image.alt}
                            >
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-contain rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full flex items-center justify-center rounded" style={{display: 'none'}}>
                                <Lucide icon={image.type === 'technical' ? 'FileText' : 'Package'} className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          ))}
                          {/* Show message if no images found */}
                          {images.length === 0 && (
                            <div className="w-16 h-16 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                              <Lucide icon="Camera" className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      // No images available
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                        <div className="text-center">
                          <Lucide icon="Package" className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">{t('No images available')}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Side - Product Information and Specifications */}
                <div className="space-y-6">
                  {/* Specification Header */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Specification')}</h2>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">{t('Brand')}:</span> <span className="text-gray-900">{selectedProduct?.brand?.brand_name || 'N/A'}</span></div>
                      <div><span className="font-medium text-gray-700">{t('Code')}:</span> <span className="text-gray-900">{selectedProduct?.brand_code || 'N/A'}</span></div>
                      <div><span className="font-medium text-gray-700">{t('Name')}:</span> <span className="text-gray-900">{selectedProduct?.localized_description || selectedProduct?.description || 'N/A'}</span></div>
                      {productDetails?.data?.productinformation?.product_size_a && (
                        <div><span className="font-medium text-gray-700">{t('Length')}:</span> <span className="text-gray-900">{productDetails.data.productinformation.product_size_a}</span></div>
                      )}
                      {productDetails?.data?.productinformation?.product_size_b && (
                        <div><span className="font-medium text-gray-700">{t('Width')}:</span> <span className="text-gray-900">{productDetails.data.productinformation.product_size_b}</span></div>
                      )}
                      {productDetails?.data?.productinformation?.product_size_c && (
                        <div><span className="font-medium text-gray-700">{t('Thickness')}:</span> <span className="text-gray-900">{productDetails.data.productinformation.product_size_c}</span></div>
                      )}
                      {productSpecifications?.data?.length > 0 && productSpecifications.data.slice(0, 2).map((spec, index) => (
                        <div key={index}><span className="font-medium text-gray-700">{spec.specificationheadname?.headname || spec.headname || 'Spec'}:</span> <span className="text-gray-900">{spec.value || 'N/A'}</span></div>
                      ))}
                    </div>
                  </div>


                  {/* Compatible Models */}
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-gray-900 mb-3">{t('Compatible Vehicle Models')}</h3>
                    {loadingCrossCars ? (
                      <div className="flex justify-center py-4">
                        <LoadingIcon icon="oval" className="w-5 h-5" />
                      </div>
                    ) : productCrossCars?.data?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {productCrossCars.data.slice(0, 12).map((crosscar, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded border">
                            <div className="font-medium">{crosscar.carmodel?.car_model || 'N/A'}</div>
                            {(crosscar.year_from || crosscar.year_to) && (
                              <div className="text-xs text-gray-600">
                                {crosscar.year_from && crosscar.year_to 
                                  ? `${crosscar.year_from} - ${crosscar.year_to}`
                                  : crosscar.year_from || crosscar.year_to
                                }
                              </div>
                            )}
                          </div>
                        ))}
                        {productCrossCars.data.length > 12 && (
                          <div className="col-span-full text-center text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                            {t('And')} {productCrossCars.data.length - 12} {t('more models...')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">{t('No compatible models available')}</div>
                    )}
                  </div>

                  {/* Cross Reference */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">{t('Cross Reference / Alternative Part Numbers')}</h3>
                    {loadingCrossCodes ? (
                      <div className="flex justify-center py-4">
                        <LoadingIcon icon="oval" className="w-5 h-5" />
                      </div>
                    ) : productCrossCodes?.data?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {productCrossCodes.data.map((crosscode, index) => (
                          <div key={index} className="text-sm bg-blue-50 border border-blue-200 px-3 py-2 rounded">
                            <div className="font-medium text-blue-900">{crosscode.brandname?.brand_name || 'N/A'}</div>
                            <div className="text-blue-700">{crosscode.cross_code || crosscode.cross_band || 'N/A'}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">{t('No cross references available')}</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={closeProductModal}
              className="w-20 mr-1"
            >
              {t("Close")}
            </Button>
            {selectedProduct && (
              <>
                <Button
                  type="button"
                  variant="outline-primary"
                  onClick={() => downloadProductPDF(selectedProduct.id)}
                  className="mr-2"
                >
                  <Lucide icon="Download" className="w-4 h-4 mr-1" />
                  {t("Download PDF")}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => shareProduct(selectedProduct)}
                  className="w-20"
                >
                  <Lucide icon="Share2" className="w-4 h-4 mr-1" />
                  {t("Share")}
                </Button>
              </>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      {/* Full Screen Image Modal */}
      <Dialog
        open={showFullScreenImage}
        onClose={() => setShowFullScreenImage(false)}
        size="6xl"
      >
        <Dialog.Panel className="p-0">
          <div className="relative bg-black">
            {/* Close Button */}
            <button
              onClick={() => setShowFullScreenImage(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <Lucide icon="X" className="w-6 h-6" />
            </button>
            
            {/* Full Screen Image */}
            <div className="flex items-center justify-center min-h-[80vh]">
              <img
                src={fullScreenImageSrc}
                alt="Full Screen View"
                className="max-w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  console.log('Full screen image failed to load:', e.target.src);
                }}
              />
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Notification */}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        options={{ duration: 3000 }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
    </div>
  );
}

export default Catalog;
