import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter,
  Grid,
  List,
  Package,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { sampleProducts, categories, brands } from '@/data/products';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart } = useCart();

  // Update search query from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.oe_code.toLowerCase().includes(query) ||
        product.brand_code.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.description.localeCompare(b.description);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card key={product.id} className="card-hover h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary">{product.brand}</Badge>
          <div className="flex gap-1">
            {product.size_mode && <Badge variant="outline">{product.size_mode}</Badge>}
          </div>
        </div>
        <CardTitle className="text-base line-clamp-2">{product.description}</CardTitle>
        <CardDescription className="text-sm">
          <div>OE: {product.oe_code}</div>
          <div>Brand Code: {product.brand_code}</div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="warning">Price on Request</Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>Net Weight: {product.net_weight}kg</div>
            <div>Gross Weight: {product.gross_weight}kg</div>
            <div>Volume: {product.volume ? `${product.volume}m³` : 'N/A'}</div>
          </div>

          <div className="flex gap-2">
            <Link to={`/product/${product.id}`} className="flex-1">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card key={product.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{product.brand}</Badge>
                  {product.size_mode && <Badge variant="outline">{product.size_mode}</Badge>}
                </div>
                <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2">{product.description}</h3>
                <div className="text-xs sm:text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2">
                  <div>OE: {product.oe_code}</div>
                  <div>Brand Code: {product.brand_code}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="warning" className="mb-2">Price on Request</Badge>
                <div className="flex gap-2">
                  <Link to={`/product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse our extensive collection of automotive parts and components
        </p>
      </div>

    </div>
  );
};

export default Catalog;