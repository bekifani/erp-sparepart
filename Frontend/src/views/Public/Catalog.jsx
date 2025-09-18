import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
function Catalog() {
  console.log('🎯 Catalog component rendering');
  
  // Simple test to see if component is rendering
  if (typeof window !== 'undefined') {
    console.log('🌍 Window object available - component is rendering');
  }
  
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const media_url = useSelector((state) => state.auth.media_url);
  
  console.log('app_url from Redux:', app_url);
  console.log('media_url from Redux:', media_url);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [crossCodeSearch, setCrossCodeSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  
  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Debug products state changes
  useEffect(() => {
    console.log('📦 Products state changed:', products);
    console.log('📦 Total products:', totalProducts);
  }, [products, totalProducts]);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Update search query from URL params
  useEffect(() => {
    console.log('🚀 Component mounted - fetching categories and products');
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch products when filters or pagination change
  useEffect(() => {
    console.log('🔄 Dependencies changed - fetching products');
    console.log('currentPage:', currentPage);
    console.log('selectedCategory:', selectedCategory);
    console.log('selectedCarModel:', selectedCarModel);
    console.log('searchTerm:', searchTerm);
    console.log('crossCodeSearch:', crossCodeSearch);
    console.log('selectedLanguage:', selectedLanguage);
    fetchProducts();
  }, [currentPage, selectedCategory, selectedCarModel, searchTerm, crossCodeSearch, selectedLanguage]);

  // Handle URL parameters for direct product access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId && products.length > 0) {
      const product = products.find(p => p.id == productId);
      if (product) {
        openProductModal(product);
        // Remove the product parameter from URL without page reload
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('product');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [products]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest('.relative')) {
        setShowShareMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

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

  const fetchProducts = async () => {
    console.log('🔄 fetchProducts called');
    console.log('app_url:', app_url);
    console.log('currentPage:', currentPage);
    console.log('itemsPerPage:', itemsPerPage);
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: itemsPerPage,
        search: searchTerm,
        category: selectedCategory,
        car_model: selectedCarModel,
        cross_code: crossCodeSearch
      });

      const url = `${app_url}/api/catalog/products?${params}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept-Language': selectedLanguage,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Raw response data:', data);
      
      if (data.success && data.data) {
        console.log('Products data:', data.data);
        console.log('Products array:', data.data.data);
        console.log('Total products:', data.data.total);
        setProducts(data.data.data || []);
        setTotalProducts(data.data.total || 0);
      } else {
        console.error('No products data in response:', data);
        alert('No products found in response: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    setLoadingDetails(true);
    try {
      // Fetch product details, specifications, cross cars, cross codes
      const [productRes, specsRes, crossCarsRes, crossCodesRes] = await Promise.all([
        fetch(`${app_url}/api/product/${productId}`, { credentials: 'include' }),
        fetch(`${app_url}/api/productspecification?filter[0][field]=product_id&filter[0][type]=%3D&filter[0][value]=${productId}`, { credentials: 'include' }),
        fetch(`${app_url}/api/crosscar?filter[0][field]=product_id&filter[0][type]=%3D&filter[0][value]=${productId}`, { credentials: 'include' }),
        fetch(`${app_url}/api/crosscode?filter[0][field]=product_id&filter[0][type]=%3D&filter[0][value]=${productId}`, { credentials: 'include' })
      ]);

      const [product, specs, crossCars, crossCodes] = await Promise.all([
        productRes.json(),
        specsRes.json(),
        crossCarsRes.json(),
        crossCodesRes.json()
      ]);

      setProductDetails({
        product: product?.data,
        specifications: specs.data?.data || [],
        crossCars: crossCars.data?.data || [],
        crossCodes: crossCodes.data?.data || []
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    fetchProductDetails(product?.id);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setProductDetails(null);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCarModel("");
    setCrossCodeSearch("");
    setCurrentPage(1);
  };

  const exportToPDF = async () => {
    try {
      const params = new URLSearchParams();
      
      // Add current filters to PDF export
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedCarModel) params.set('car_model', selectedCarModel);
      if (crossCodeSearch) params.set('cross_code', crossCodeSearch);
      
      const response = await fetch(`${app_url}/api/catalog/export-pdf?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `catalog-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const shareProduct = (product) => {
    if (navigator.share) {
      navigator.share({
        title: product?.localized_description || product?.description,
        text: `Check out this product: ${product?.localized_description || product?.description}`,
        url: `${window.location.origin}/public/catalog?product=${product?.id}`
      });
    } else {
      // Show share options modal
      setShowShareMenu(product?.id);
    }
  };

  const downloadProductPDF = async (product, event = null) => {
    console.log('🚀 downloadProductPDF function called!');
    console.log('Product:', product);
    console.log('Event:', event);
    console.log('app_url:', app_url);
    
    try {
      console.log('=== PDF DOWNLOAD START ===');
      console.log('Product:', product);
      console.log('API URL:', `${app_url}/api/catalog/product/${product?.id}/pdf`);
      
      // Show loading indicator
      const originalText = event?.target?.innerHTML;
      if (event?.target) {
        event.target.innerHTML = '<div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>';
        event.target.disabled = true;
      }
      
      const response = await fetch(`${app_url}/api/catalog/product/${product?.id}/pdf`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('Blob size:', blob.size, 'bytes');
        console.log('Blob type:', blob.type);
        
        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `product-${product?.brand_code || product?.id}-${new Date().toISOString().split('T')[0]}.pdf`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 100);
          
          console.log('✅ PDF download initiated successfully');
          alert(t('PDF download started successfully!'));
        } else {
          console.error('❌ PDF blob is empty');
          alert(t('Error: PDF file is empty. Please check the server logs.'));
        }
      } else {
        const errorText = await response.text();
        console.error('❌ PDF download failed:', response.status, errorText);
        alert(t('Error downloading PDF: ') + response.status + '\n' + errorText);
      }
    } catch (error) {
      console.error('❌ Exception during PDF download:', error);
      alert(t('Error downloading PDF: ') + error.message);
    } finally {
      // Restore button state
      if (event?.target) {
        event.target.innerHTML = originalText;
        event.target.disabled = false;
      }
    }
  };

  const copyProductLink = (product) => {
    const url = `${window.location.origin}/public/catalog?product=${product?.id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert(t('Product link copied to clipboard'));
      setShowShareMenu(null);
    });
  };

  const generateQRCode = async (product) => {
    try {
      const response = await fetch(`${app_url}/api/catalog/product/${product?.id}/qr-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: product?.localized_description || product?.description,
          url: `${window.location.origin}/public/catalog?product=${product?.id}`
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qr_code_url);
        setShowQRCode(true);
        setShowShareMenu(null);
      } else {
        alert(t('Error generating QR code'));
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert(t('Error generating QR code'));
    }
  };

  const testProduct = async (product) => {
    try {
      console.log('Testing product:', product?.id);
      
      const response = await fetch(`${app_url}/api/catalog/test-pdf/${product?.id}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('Test response:', data);
      
      if (data.success) {
        alert(`Product test successful!\nID: ${data.product_id}\nBrand Code: ${data.brand_code}\nDescription: ${data.description}\nBrand: ${data.brand_name}\nHas Product Info: ${data.has_product_info}`);
      } else {
        alert(`Product test failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error testing product:', error);
      alert(`Error testing product: ${error.message}`);
    }
  };

  const testPdfGeneration = async (product) => {
    try {
      console.log('Testing PDF generation for product:', product?.id);
      
      const response = await fetch(`${app_url}/api/catalog/test-pdf-generation/${product?.id}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('PDF generation test response:', data);
      
      if (data.success) {
        alert(`PDF generation test successful!\nProduct ID: ${data.product_id}\nMessage: ${data.message}`);
      } else {
        alert(`PDF generation test failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error testing PDF generation:', error);
      alert(`Error testing PDF generation: ${error.message}`);
    }
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

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
    <div className="container mx-auto px-4 ">
      {/* Header */}
      <Navbar />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Product Catalog')}</h1>
        <p className="text-gray-600">{t('Browse our complete product catalog')}</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Language Selector */}
          <div>
            <FormLabel>{t('Language')}</FormLabel>
            <FormSelect
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="az">Azərbaycan</option>
              <option value="ru">Русский</option>
              <option value="cn">中文</option>
            </FormSelect>
          </div>

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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">{t('All Categories')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="text-gray-900">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* <div className="text-xs text-muted-foreground">
            <div>Net Weight: {product?.net_weight}kg</div>
            <div>Gross Weight: {product?.gross_weight}kg</div>
            <div>Volume: {product?.volume ? `${product?.volume}m³` : 'N/A'}</div>
          </div> */}

          {/* <div className="flex gap-2">
            <Link to={`/product/${product?.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Button 
              size="sm" 
              onClick={() => handleAddToCart(product)}
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div> */}
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
          <Button onClick={exportToPDF} variant="outline-primary">
            <Lucide icon="FileText" className="w-4 h-4 mr-2" />
            {t('Get PDF')}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          {t('Showing')} {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalProducts)} {t('of')} {totalProducts} {t('products')}
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingIcon icon="oval" className="w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => {
            console.log('Rendering product card:', product?.id, product?.description);
            return (
            <div key={product?.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div 
                className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setSelectedProduct(product);
                  setShowImageGallery(true);
                  setSelectedImageIndex(0);
                }}
              >
                {(() => {
                  const productInfo = product?.ProductInformation || product?.productinformation || product?.product_information;
                  const technicalImage = productInfo?.technical_image || productInfo?.image;
                  
                  return technicalImage ? (
                    <img
                      src={`${media_url}${technicalImage}`}
                      alt={product?.localized_description || product?.description}
                    className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null;
                })()}
                <div className="w-full h-full flex items-center justify-center" style={{display: (() => {
                  const productInfo = product?.ProductInformation || product?.productinformation || product?.product_information;
                  const technicalImage = productInfo?.technical_image || productInfo?.image;
                  return technicalImage ? 'none' : 'flex';
                })()}}>
                    <Lucide icon="Package" className="w-12 h-12 text-gray-400" />
                  </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <p className="text-sm font-medium text-primary">{product?.brand_name}</p>
                  <p className="text-xs text-gray-500">{product?.brand_code}</p>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {product?.localized_description || product?.description}
                </h3>
                
                {product?.oe_code && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{t('OE Code')}:</span> {product?.oe_code}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openProductModal(product)}
                    className="flex-1"
                  >
                    <Lucide icon="Info" className="w-4 h-4 mr-1" />
                    {t('Info')}
                  </Button>
                  <div className="relative">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => shareProduct(product)}
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                    
                    {/* Share Menu */}
                    {showShareMenu === product?.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => copyProductLink(product)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Lucide icon="Link" className="w-4 h-4 mr-2" />
                            {t('Copy Link')}
                          </button>
                          <button
                            onClick={(e) => downloadProductPDF(product, e)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Lucide icon="Download" className="w-4 h-4 mr-2" />
                            {t('Download PDF')}
                          </button>
                          <button
                            onClick={() => generateQRCode(product)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Lucide icon="QrCode" className="w-4 h-4 mr-2" />
                            {t('Generate QR Code')}
                          </button>
                          <button
                            onClick={() => testProduct(product)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Lucide icon="Bug" className="w-4 h-4 mr-2" />
                            {t('Test Product')}
                          </button>
                          <button
                            onClick={() => testPdfGeneration(product)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Lucide icon="FileText" className="w-4 h-4 mr-2" />
                            {t('Test PDF Generation')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Individual Action Icons */}
                <div className="flex justify-end gap-1 mt-2" style={{backgroundColor: 'rgba(255,0,0,0.1)', padding: '4px'}}>
                  <button
                    onClick={() => {
                      console.log('FileText button clicked!', product);
                      openProductModal(product);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={t('View Details')}
                    style={{backgroundColor: 'rgba(0,255,0,0.2)', border: '1px solid red'}}
                  >
                    <Lucide icon="FileText" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      console.log('Download button clicked!', product);
                      e.preventDefault();
                      e.stopPropagation();
                      downloadProductPDF(product, e);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title={t('Download PDF')}
                    style={{backgroundColor: 'rgba(0,0,255,0.2)', border: '1px solid blue'}}
                  >
                    <Lucide icon="Download" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openProductModal(product)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title={t('View Product')}
                  >
                    <Lucide icon="Eye" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      console.log('Test button clicked!', product);
                      alert('Test button works! Product ID: ' + product?.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Test Button"
                    style={{backgroundColor: 'rgba(255,255,0,0.2)', border: '1px solid yellow'}}
                  >
                    <Lucide icon="AlertCircle" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {selectedProduct?.image ? (
                      <img
                        src={`${media_url}${selectedproduct?.image}`}
                        alt={selectedproduct?.description}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Lucide icon="Package" className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{t('Product Information')}</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">{t('Brand')}:</span> {selectedProduct?.brand_name}</p>
                      <p><span className="font-medium">{t('Brand Code')}:</span> {selectedProduct?.brand_code}</p>
                      <p><span className="font-medium">{t('Description')}:</span> {selectedProduct?.description}</p>
                      {selectedProduct?.oe_code && (
                        <p><span className="font-medium">{t('OE Code')}:</span> {selectedProduct?.oe_code}</p>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  {productDetails.specifications.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{t('Specifications')}</h3>
                      <div className="space-y-2">
                        {productDetails.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="font-medium">{spec.headname}:</span>
                            <span>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cross Cars */}
                  {productDetails.crossCars.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{t('Compatible Vehicles')}</h3>
                      <div className="space-y-1">
                        {productDetails.crossCars.map((car, index) => (
                          <p key={index} className="text-sm">
                            {car.brand} {car.model} ({car.year})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cross Codes */}
                  {productDetails.crossCodes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{t('Alternate Part Numbers')}</h3>
                      <div className="space-y-1">
                        {productDetails.crossCodes.map((code, index) => (
                          <p key={index} className="text-sm">
                            <span className="font-medium">{code.brand_name}:</span> {code.code}
                          </p>
                        ))}
                      </div>
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

      {/* Image Gallery Modal */}
      <Dialog
        open={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        size="4xl"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {selectedProduct?.localized_description || selectedProduct?.description}
              </h2>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Lucide icon="X" className="w-6 h-6" />
              </button>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="mt-4">
              {(() => {
                const productInfo = selectedProduct?.ProductInformation || selectedProduct?.productinformation || selectedProduct?.product_information;
                const images = [];
                
                if (productInfo?.technical_image) {
                  images.push({
                    src: `${media_url}${productInfo.technical_image}`,
                    alt: 'Technical Image',
                    type: 'technical'
                  });
                }
                
                if (productInfo?.image) {
                  images.push({
                    src: `${media_url}${productInfo.image}`,
                    alt: 'Product Image',
                    type: 'product'
                  });
                }
                
                if (productInfo?.pictures && Array.isArray(productInfo.pictures)) {
                  productInfo.pictures.forEach((pic, index) => {
                    if (pic) {
                      images.push({
                        src: `${media_url}${pic}`,
                        alt: `Picture ${index + 1}`,
                        type: 'picture'
                      });
                    }
                  });
                }
                
                if (images.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Lucide icon="Image" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No images available for this product</p>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative">
                      <img
                        src={images[selectedImageIndex]?.src}
                        alt={images[selectedImageIndex]?.alt}
                        className="w-full h-96 object-contain bg-gray-50 rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === 0 ? images.length - 1 : prev - 1
                            )}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                          >
                            <Lucide icon="ChevronLeft" className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === images.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                          >
                            <Lucide icon="ChevronRight" className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Thumbnail Navigation */}
                    {images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === selectedImageIndex 
                                ? 'border-blue-500' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Image Info */}
                    <div className="text-center text-sm text-gray-600">
                      {selectedImageIndex + 1} of {images.length} - {images[selectedImageIndex]?.type}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        size="md"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('QR Code')}</h2>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Lucide icon="X" className="w-6 h-6" />
              </button>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="mt-4 text-center">
              {qrCodeUrl ? (
                <div className="space-y-4">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto w-64 h-64"
                  />
                  <p className="text-sm text-gray-600">
                    {t('Scan this QR code to view the product')}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = qrCodeUrl;
                        link.download = `qr-code-${selectedProduct?.brand_code || selectedProduct?.id}.png`;
                        link.click();
                      }}
                      variant="outline-secondary"
                    >
                      <Lucide icon="Download" className="w-4 h-4 mr-2" />
                      {t('Download')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <Lucide icon="QrCode" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('Generating QR code...')}</p>
                </div>
              )}
            </div>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default Catalog;