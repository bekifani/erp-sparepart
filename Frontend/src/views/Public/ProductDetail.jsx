import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Package, 
  Truck,
  Scale,
  Box,
  Info,
  Building,
  Tag,
  Hash,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { sampleProducts } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import ImageModal from '@/components/ImageModal';
import Navbar from '@/components/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const { addToCart } = useCart();

  const product = sampleProducts.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/catalog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const price = customPrice ? parseFloat(customPrice) : undefined;
    if (customPrice && isNaN(price)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    addToCart(product, quantity, price);
  };

  const handleQuantityChange = (value) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1) {
      setQuantity(num);
    }
  };

  // Find related products (same brand)
  const relatedProducts = sampleProducts
    .filter(p => p.id !== product.id && p.brand === product.brand)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-primary">Catalog</Link>
        <span>/</span>
        <span className="text-foreground">{product.description}</span>
      </div>

      {/* Back Button */}
      <Link to="/catalog" className="inline-flex items-center mb-6">
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
        {/* Product Image Placeholder */}
        <div className="space-y-4">
          <ImageModal productName={product.description}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-3 sm:p-6">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center group">
                  <div className="text-center">
                    <Package className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Click to view full size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ImageModal>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <ImageModal key={i} productName={product.description}>
                <div className="aspect-square bg-muted rounded border cursor-pointer hover:border-primary transition-colors">
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                </div>
              </ImageModal>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4 lg:space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {product.size_mode && <Badge variant="outline">{product.size_mode}</Badge>}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{product.description}</h1>
            <p className="text-muted-foreground">
              High-quality automotive part from {product.brand}
            </p>
          </div>

          <Separator />

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning">Price on Request</Badge>
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>

            {/* Custom Price Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Specify Price (Optional)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter custom price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange((quantity - 1).toString())}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange((quantity + 1).toString())}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specifications">Technical Info</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions & Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Product Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm leading-relaxed">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Brand</div>
                      <div className="font-medium">{product.brand}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Unit</div>
                      <div className="font-medium">{product.unit_id}</div>
                    </div>
                  </div>
                </div>

                {product.properties && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Properties & Features</h4>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm leading-relaxed">{product.properties}</p>
                    </div>
                  </div>
                )}

                {product.additional_note && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Additional Note</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">{product.additional_note}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Product Codes & IDs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">OE Code</div>
                      <div className="text-xs text-muted-foreground">Original Equipment</div>
                    </div>
                    <Badge variant="outline" className="font-mono">{product.oe_code}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Brand Code</div>
                      <div className="text-xs text-muted-foreground">Manufacturer Part Number</div>
                    </div>
                    <Badge variant="outline" className="font-mono">{product.brand_code}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Product Code</div>
                      <div className="text-xs text-muted-foreground">Internal Reference</div>
                    </div>
                    <Badge variant="outline" className="font-mono">{product.product_code}</Badge>
                  </div>

                  {product.qr_code && (
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">QR Code</div>
                        <div className="text-xs text-muted-foreground">Quick Identification</div>
                      </div>
                      <Badge variant="outline" className="font-mono">{product.qr_code}</Badge>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {product.product_name_id && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Name ID</div>
                      <div className="font-medium">{product.product_name_id}</div>
                    </div>
                  )}
                  {product.box_id && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Box ID</div>
                      <div className="font-medium">{product.box_id}</div>
                    </div>
                  )}
                  {product.label_id && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Label ID</div>
                      <div className="font-medium">{product.label_id}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Technical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {product.size_mode && (
                    <div className="flex items-center gap-3">
                      <Box className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Size Mode</div>
                        <div className="font-medium capitalize">{product.size_mode}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Unit Type</div>
                      <div className="font-medium">{product.unit_id}</div>
                    </div>
                  </div>

                  {product.technical_image && (
                    <div className="flex items-center gap-3">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Technical Image</div>
                        <div className="font-medium">Available</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {product.image && (
                    <div className="flex items-center gap-3">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Product Image</div>
                        <div className="font-medium">Available</div>
                      </div>
                    </div>
                  )}

                  {product.qr_code && (
                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">QR Code</div>
                        <div className="font-medium font-mono">{product.qr_code}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {product.properties && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Product Properties</h4>
                  <p className="text-sm leading-relaxed">{product.properties}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="dimensions" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Dimensions & Weight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(product.product_size_a || product.product_size_b || product.product_size_c) && (
                  <div>
                    <h4 className="font-medium mb-3">Product Dimensions</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {product.product_size_a && (
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{product.product_size_a}</div>
                          <div className="text-xs text-muted-foreground">Length (mm)</div>
                        </div>
                      )}
                      {product.product_size_b && (
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{product.product_size_b}</div>
                          <div className="text-xs text-muted-foreground">Width (mm)</div>
                        </div>
                      )}
                      {product.product_size_c && (
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{product.product_size_c}</div>
                          <div className="text-xs text-muted-foreground">Height (mm)</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Net Weight</div>
                      <div className="font-medium">{product.net_weight} kg</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Gross Weight</div>
                      <div className="font-medium">{product.gross_weight} kg</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Volume</div>
                      <div className="font-medium">
                        {product.volume ? `${product.volume} m³` : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {product.size_mode && (
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Size Category</div>
                        <div className="font-medium capitalize">{product.size_mode}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-3">Shipping Information</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Standard Shipping:</span>
                      <span className="font-medium">3-5 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Shipping:</span>
                      <span className="font-medium">1-2 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>International:</span>
                      <span className="font-medium">5-10 business days</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Shipping Benefits</h4>
                  <div className="text-sm text-green-700 dark:text-green-200 space-y-1">
                    <div>• Professional packaging included</div>
                    <div>• Free shipping on orders over $500</div>
                    <div>• Secure handling guaranteed</div>
                    <div>• Tracking number provided</div>
                  </div>
                </div>

                {product.additional_note && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Additional Information</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">{product.additional_note}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{relatedProduct.brand}</Badge>
                    {relatedProduct.size_mode && <Badge variant="outline">{relatedProduct.size_mode}</Badge>}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{relatedProduct.description}</CardTitle>
                  <CardDescription>
                    OE: {relatedProduct.oe_code}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="warning">Price on Request</Badge>
                    </div>
                  </div>
                  <Link to={`/product/${relatedProduct.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductDetail;
