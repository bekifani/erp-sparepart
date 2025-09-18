import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Trash2, 
  Plus,
  Minus,
  Package,
  ArrowLeft,
  Check,
  FileText,
  Calendar
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { format } from 'date-fns';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, confirmCart } = useCart();
  const [customerNote, setCustomerNote] = useState('');

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart to get started
          </p>
          <Link to="/catalog">
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleConfirmOrder = () => {
    confirmCart();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/catalog">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Customer: {cart.customer}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cart Items ({cart.items.length})
                <Button variant="outline" size="sm" onClick={clearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={`${item.product.id}-${index}`}>
                  {index > 0 && <Separator />}
                  <div className="flex gap-4 py-4">
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.product.description}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{item.product.brand}</Badge>
                            <span className="text-sm text-muted-foreground">
                              OE: {item.product.oe_code}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm text-muted-foreground ml-2">
                            {item.product.unit_id}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">
                            ${((item.customPrice || 0) * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${(item.customPrice || 0).toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <div>Added: {format(item.dateAdded, 'MMM dd, yyyy HH:mm')}</div>
                        <div>Net Weight: {item.product.net_weight * item.quantity} kg</div>
                        {item.product.volume && (
                          <div>Volume: {item.product.volume * item.quantity} m³</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Products:</span>
                <span>{cart.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Weight:</span>
                <span>{cart.totalWeight.toFixed(3)} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Total Volume:</span>
                <span>{cart.totalVolume.toFixed(6)} m³</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div>First added: {format(cart.firstEditDate, 'MMM dd, yyyy HH:mm')}</div>
                <div>Last updated: {format(cart.lastEditDate, 'MMM dd, yyyy HH:mm')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Additional Notes (Optional)
                </label>
                <Input
                  placeholder="Add any special instructions..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleConfirmOrder}>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Order
                </Button>
                
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Proforma Invoice
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Delivery
                </Button>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                <p className="font-medium mb-1">Note:</p>
                <p>Final weight and volume will be confirmed after packaging. All orders are automatically saved.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="capitalize">{cart.status}</span>
              </div>
              {cart.status === 'active' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your order is being prepared. You can still make changes.
                </p>
              )}
              {cart.status === 'confirmed' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your order has been confirmed and sent for processing.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;