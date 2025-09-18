import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Eye, 
  Download, 
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const sampleOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-05-23',
    status: 'delivered',
    totalAmount: 2410,
    totalItems: 5,
    totalWeight: 29.216,
    totalVolume: 0.0768,
    trackingNumber: 'TRK123456789',
    deliveryDate: '2024-05-25',
    items: [
      {
        id: '1',
        brand: 'Kanoya',
        brandCode: 'K10402',
        oeCode: '26150-89926',
        description: 'PROTIVADUMANNIK SOL',
        quantity: 25,
        unitPrice: 20,
        totalPrice: 500
      },
      {
        id: '2',
        brand: 'Kanoya',
        brandCode: 'K10302', 
        oeCode: '26155-89926',
        description: 'PROTIVADUMANNIK SAG',
        quantity: 22,
        unitPrice: 20,
        totalPrice: 440
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-05-20',
    status: 'shipped',
    totalAmount: 1850,
    totalItems: 3,
    totalWeight: 18.75,
    totalVolume: 0.059,
    trackingNumber: 'TRK987654321',
    items: [
      {
        id: '3',
        brand: 'Foudroyant',
        brandCode: 'K39X01',
        oeCode: '27277-4M400',
        description: 'FILTER SALON KONDENSANER',
        quantity: 100,
        unitPrice: 6,
        totalPrice: 600
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-05-18',
    status: 'processing',
    totalAmount: 720,
    totalItems: 2,
    totalWeight: 8.25,
    totalVolume: 0,
    items: [
      {
        id: '4',
        brand: 'Kanoya',
        brandCode: 'P35X01',
        oeCode: '54668-8H300',
        description: 'LINK STABILIZATOR ON QABAQ SOL',
        quantity: 50,
        unitPrice: 15,
        totalPrice: 750
      }
    ]
  }
];

const MyOrders = () => {
  const [orders] = useState(sampleOrders);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const OrderReceipt = ({ order }) => (
    <div className="space-y-6 text-sm">
      {/* Receipt Header */}
      <div className="text-center border-b pb-4">
        <h3 className="text-lg font-bold">Komiparts Receipt</h3>
        <p className="text-muted-foreground">Order #{order.orderNumber}</p>
      </div>

      {/* Order Details */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Date:</span>
          <span>{new Date(order.date).toLocaleDateString()}</span>
        </div>
        {order.deliveryDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Date:</span>
            <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
          </div>
        )}
        {order.trackingNumber && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tracking Number:</span>
            <span>{order.trackingNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <h4 className="font-semibold mb-3">Order Items</h4>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.brand} • OE: {item.oeCode} • Brand Code: {item.brandCode}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>{item.quantity} × ${item.unitPrice.toFixed(2)}</span>
                <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Items:</span>
          <span>{order.totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Weight:</span>
          <span>{order.totalWeight} kg</span>
        </div>
        <div className="flex justify-between">
          <span>Total Volume:</span>
          <span>{order.totalVolume} m³</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount:</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View and track your order history
          </p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto">
          {orders.length} Total Orders
        </Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
            className="whitespace-nowrap"
          >
            {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <Badge variant="secondary" className="ml-2 h-4">
                {orders.filter(o => o.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'You haven\'t placed any orders yet.' 
                  : `No ${filter} orders found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-2">
                      Order {order.orderNumber}
                      <Badge variant={getStatusColor(order.status)} className="gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.totalItems} items • {order.totalWeight} kg
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Order Items Preview */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm bg-muted/30 rounded p-2">
                        <div className="flex-1">
                          <span className="font-medium">{item.description}</span>
                          <div className="text-xs text-muted-foreground">
                            {item.brand} • {item.oeCode}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>{item.quantity} × ${item.unitPrice.toFixed(2)}</div>
                          <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Receipt - {order.orderNumber}</DialogTitle>
                      </DialogHeader>
                      <OrderReceipt order={order} />
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Print Receipt
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {order.status === 'shipped' && order.trackingNumber && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Truck className="h-4 w-4" />
                      Track Package
                    </Button>
                  )}

                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Package className="h-4 w-4" />
                      Reorder Items
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default MyOrders;
