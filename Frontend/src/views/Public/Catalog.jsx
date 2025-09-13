import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch products when filters or pagination change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, selectedCarModel, searchTerm, crossCodeSearch]);

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
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: itemsPerPage,
      });

      // Add filters if they exist
      let filterIndex = 0;
      if (searchTerm) {
        params.set(`filter[${filterIndex}][field]`, 'description');
        params.set(`filter[${filterIndex}][type]`, 'like');
        params.set(`filter[${filterIndex}][value]`, searchTerm);
        filterIndex++;
      }
      if (selectedCategory) {
        params.set(`filter[${filterIndex}][field]`, 'category_id');
        params.set(`filter[${filterIndex}][type]`, '=');
        params.set(`filter[${filterIndex}][value]`, selectedCategory);
        filterIndex++;
      }
      if (crossCodeSearch) {
        params.set(`filter[${filterIndex}][field]`, 'brand_code');
        params.set(`filter[${filterIndex}][type]`, 'like');
        params.set(`filter[${filterIndex}][value]`, crossCodeSearch);
        filterIndex++;
      }

      const response = await fetch(`${app_url}/api/product?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.data) {
        setProducts(data.data.data || []);
        setTotalProducts(data.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
        product: product.data,
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
    fetchProductDetails(product.id);
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
        title: product.description,
        text: `Check out this product: ${product.description}`,
        url: `${window.location.origin}/catalog/product/${product.id}`
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/catalog/product/${product.id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert(t('Product link copied to clipboard'));
      });
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Product Catalog')}</h1>
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
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                {product.image ? (
                  <img
                    src={`${media_url}${product.image}`}
                    alt={product.description}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Lucide icon="Package" className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <p className="text-sm font-medium text-primary">{product.brand_name}</p>
                  <p className="text-xs text-gray-500">{product.brand_code}</p>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.description}
                </h3>
                
                {product.oe_code && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{t('OE Code')}:</span> {product.oe_code}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openProductModal(product)}
                    className="flex-1"
                  >
                    <Lucide icon="Info" className="w-4 h-4 mr-1" />
                    {t('Info')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => shareProduct(product)}
                  >
                    <Lucide icon="Share2" className="w-4 h-4" />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {selectedProduct?.image ? (
                      <img
                        src={`${media_url}${selectedProduct.image}`}
                        alt={selectedProduct.description}
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
    </div>
  );
}

export default Catalog;
