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
      console.log('Product information:', products[0].productinformation);
      console.log('Image field:', products[0].productinformation?.image);
      console.log('Media URL:', media_url);
      console.log('Full image path:', `${media_url}${products[0].productinformation?.image}`);
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
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedCarModel) filters.car_model = selectedCarModel;
      if (crossCodeSearch) filters.cross_code = crossCodeSearch;
      
      const result = await exportPdf(filters).unwrap();
      
      // Handle PDF download
      const blob = new Blob([result], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `catalog-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setToastMessage(t('PDF exported successfully'));
    } catch (error) {
      setToastMessage(t('Error exporting PDF'));
    }
    basicStickyNotification.current?.showToast();
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
              customDataMapping={(item) => ({ value: item.id, text: `${item.brand} ${item.model} (${item.year})` })}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900">Brand: {product.brand?.brand_name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Code: {product.brand_code || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Name: {product.description || 'N/A'}</p>
                    {product.oe_code && (
                      <p className="text-sm text-gray-600">Compatible OEM: {product.oe_code}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => shareProduct(product)}
                    className="p-2"
                  >
                    <Lucide icon="Share2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => openProductModal(product)}
                  className="text-xs"
                >
                  Information
                </Button>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline-secondary" className="p-1">
                    <Lucide icon="FileText" className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline-secondary" className="p-1">
                    <Lucide icon="Download" className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline-secondary" className="p-1">
                    <Lucide icon="Eye" className="w-3 h-3" />
                  </Button>
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
              {selectedProduct?.description}
            </h2>
          </Dialog.Title>
          <Dialog.Description>
            {loadingDetails ? (
              <div className="flex justify-center py-8">
                <LoadingIcon icon="oval" className="w-8 h-8" />
              </div>
            ) : productDetails ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Product Images */}
                <div className="lg:col-span-1 space-y-4">
                  {(() => {
                    // Collect all available images
                    const images = [];
                    if (productDetails?.data?.productinformation?.image) {
                      images.push({
                        src: `${media_url}${productDetails.data.productinformation.image}`,
                        alt: selectedProduct.description,
                        type: 'main'
                      });
                    }
                    if (productDetails?.data?.productinformation?.technical_image) {
                      images.push({
                        src: `${media_url}${productDetails.data.productinformation.technical_image}`,
                        alt: 'Technical Drawing',
                        type: 'technical'
                      });
                    }

                    return images.length > 0 ? (
                      <>
                        {/* Main Large Image */}
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={images[selectedImageIndex]?.src}
                            alt={images[selectedImageIndex]?.alt}
                            className="w-full h-full object-cover cursor-pointer"
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                            <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                          </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex space-x-2 justify-center">
                          {images.map((image, index) => (
                            <div 
                              key={index}
                              className={`w-16 h-16 bg-gray-100 rounded border cursor-pointer transition-colors ${
                                selectedImageIndex === index 
                                  ? 'border-primary border-2' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover rounded"
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
                          {/* Add placeholder thumbnails to match design */}
                          {Array.from({length: Math.max(0, 3 - images.length)}).map((_, index) => (
                            <div key={`placeholder-${index}`} className="w-16 h-16 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                              <Lucide icon="Camera" className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      // No images available
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                        <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                      </div>
                    );
                  })()}
                </div>

                {/* Right Side - Product Information and Specifications */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Product Header */}
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Specification</h2>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Band:</span> {selectedProduct?.brand?.brand_name || 'N/A'}</div>
                      <div><span className="font-medium">Code:</span> {selectedProduct?.brand_code || 'N/A'}</div>
                      <div><span className="font-medium">Name:</span> {selectedProduct?.description || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2">
                    {loadingSpecs ? (
                      <div className="flex justify-center py-4">
                        <LoadingIcon icon="oval" className="w-5 h-5" />
                      </div>
                    ) : productSpecifications?.data?.length > 0 ? (
                      productSpecifications.data.map((spec, index) => (
                        <div key={index} className="flex justify-between text-sm py-1">
                          <span className="font-medium text-gray-700">
                            {spec.specificationheadname?.headname || spec.headname || 'N/A'}:
                          </span>
                          <span className="text-gray-900">{spec.value || 'N/A'}</span>
                        </div>
                      ))
                    ) : null}

                    {/* Physical Properties from Product Information */}
                    {productDetails?.data?.productinformation && (
                      <>
                        {productDetails.data.productinformation.net_weight && (
                          <div className="flex justify-between text-sm py-1">
                            <span className="font-medium text-gray-700">Length-1:</span>
                            <span className="text-gray-900">{productDetails.data.productinformation.product_size_a || 'N/A'}</span>
                          </div>
                        )}
                        {productDetails.data.productinformation.product_size_b && (
                          <div className="flex justify-between text-sm py-1">
                            <span className="font-medium text-gray-700">Width-1:</span>
                            <span className="text-gray-900">{productDetails.data.productinformation.product_size_b}</span>
                          </div>
                        )}
                        {productDetails.data.productinformation.product_size_c && (
                          <div className="flex justify-between text-sm py-1">
                            <span className="font-medium text-gray-700">Thickness-1:</span>
                            <span className="text-gray-900">{productDetails.data.productinformation.product_size_c}</span>
                          </div>
                        )}
                        {productDetails.data.productinformation.additional_note && (
                          <div className="flex justify-between text-sm py-1">
                            <span className="font-medium text-gray-700">Pcs in Set:</span>
                            <span className="text-gray-900">{productDetails.data.productinformation.additional_note}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Compatible Models */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">Compatible models:</h3>
                    {loadingCrossCars ? (
                      <div className="flex justify-center py-4">
                        <LoadingIcon icon="oval" className="w-5 h-5" />
                      </div>
                    ) : productCrossCars?.data?.length > 0 ? (
                      <div className="space-y-1">
                        {productCrossCars.data.slice(0, 7).map((crosscar, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                            {crosscar.carmodel?.car_model || 'N/A'} {crosscar.year_from && crosscar.year_to ? `${crosscar.year_from}-${crosscar.year_to}` : ''}
                          </div>
                        ))}
                        {productCrossCars.data.length > 7 && (
                          <div className="text-center text-sm text-gray-500 mt-2">
                            <span>{'< 1 '}</span>
                            <span className="bg-primary text-white px-2 py-1 rounded text-xs">2</span>
                            <span>{' ...12 >'}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No compatible models available</div>
                    )}
                  </div>

                  {/* Cross Reference */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">Cross Reference</h3>
                    {loadingCrossCodes ? (
                      <div className="flex justify-center py-4">
                        <LoadingIcon icon="oval" className="w-5 h-5" />
                      </div>
                    ) : productCrossCodes?.data?.length > 0 ? (
                      <div className="text-sm text-gray-700">
                        {productCrossCodes.data.slice(0, 3).map((crosscode, index) => (
                          <div key={index} className="mb-1">
                            {crosscode.brandname?.brand_name || 'N/A'}: {crosscode.cross_code || 'N/A'}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No cross references available</div>
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
              <Button
                type="button"
                variant="primary"
                onClick={() => shareProduct(selectedProduct)}
                className="w-20"
              >
                <Lucide icon="Share2" className="w-4 h-4 mr-1" />
                {t("Share")}
              </Button>
            )}
          </Dialog.Footer>
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
