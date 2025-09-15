import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import Notification from "@/components/Base/Notification";
import {
  useGetCatalogProductsQuery,
  useExportCatalogPdfMutation,
  useGetProductDetailsQuery
} from "@/stores/apiSlice";

function Catalog() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const media_url = useSelector((state) => state.auth.media_url);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [crossCodeSearch, setCrossCodeSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 products per page
  
  // Data state
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
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
  
  const { data: productDetails, isLoading: loadingDetails, error: detailsError } = useGetProductDetailsQuery(
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
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
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
        url: `${window.location.origin}/catalog/product/${product.id}`
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/catalog/product/${product.id}`;
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
          <div>
            <FormLabel>{t('Category')}</FormLabel>
            <FormSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{t('All Categories')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>
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
                  {(() => {
                    const productInfo = product.ProductInformation || product.productinformation || product.product_information;
                    const technicalImage = productInfo?.technical_image || productInfo?.image;
                    
                    return technicalImage ? (
                      <img
                        src={`${media_url}${technicalImage}`}
                        alt={product.description || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', e.target.src);
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
        size="2xl"
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
            ) : (productDetails && selectedProduct) ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {(() => {
                      const productInfo = productDetails?.data?.ProductInformation || productDetails?.data?.productinformation || productDetails?.data?.product_information;
                      const technicalImage = productInfo?.technical_image || productInfo?.image;
                      
                      return technicalImage ? (
                        <img
                          src={`${media_url}${technicalImage}`}
                          alt={selectedProduct?.description || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Modal image failed to load:', e.target.src);
                            console.log('Product details:', productDetails);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={(e) => {
                            console.log('Modal image loaded successfully:', e.target.src);
                          }}
                        />
                      ) : null;
                    })()}
                    <div className="w-full h-full flex items-center justify-center" style={{display: (() => {
                      const productInfo = productDetails?.data?.ProductInformation || productDetails?.data?.productinformation || productDetails?.data?.product_information;
                      const technicalImage = productInfo?.technical_image || productInfo?.image;
                      return technicalImage ? 'none' : 'flex';
                    })()}}>
                      <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  {/* Basic Product Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">{t('Product Information')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Brand')}:</span> 
                          <span className="text-gray-900">{selectedProduct?.brand?.brand_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Brand Code')}:</span> 
                          <span className="text-gray-900">{selectedProduct?.brand_code || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Description')}:</span> 
                          <span className="text-gray-900">{selectedProduct?.description || 'N/A'}</span>
                        </div>
                        {selectedProduct?.oe_code && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('OE Code')}:</span> 
                            <span className="text-gray-900">{selectedProduct.oe_code}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Quantity')}:</span> 
                          <span className="text-gray-900">{selectedProduct?.qty || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Min Quantity')}:</span> 
                          <span className="text-gray-900">{selectedProduct?.min_qty || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Selling Price')}:</span> 
                          <span className="text-gray-900">${selectedProduct?.selling_price || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">{t('Status')}:</span> 
                          <span className="text-gray-900">{selectedProduct?.status || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Product Information */}
                  {productDetails?.data?.ProductInformation && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">{t('Detailed Information')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Product Code')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.product_code || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('QR Code')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.qr_code || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Net Weight')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.net_weight || 'N/A'} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Gross Weight')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.gross_weight || 'N/A'} kg</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Size A')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.product_size_a || 'N/A'} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Size B')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.product_size_b || 'N/A'} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Size C')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.product_size_c || 'N/A'} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">{t('Volume')}:</span> 
                            <span className="text-gray-900">{productDetails.data.ProductInformation.volume || 'N/A'} cm³</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Properties and Additional Notes */}
                      {(productDetails.data.ProductInformation.properties || productDetails.data.ProductInformation.additional_note) && (
                        <div className="mt-4 space-y-3">
                          {productDetails.data.ProductInformation.properties && (
                            <div>
                              <span className="font-medium text-gray-600 block mb-2">{t('Properties')}:</span>
                              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{productDetails.data.ProductInformation.properties}</p>
                            </div>
                          )}
                          {productDetails.data.ProductInformation.additional_note && (
                            <div>
                              <span className="font-medium text-gray-600 block mb-2">{t('Additional Notes')}:</span>
                              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{productDetails.data.ProductInformation.additional_note}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
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
