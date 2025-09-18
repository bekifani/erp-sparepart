import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  Eye,
  Mail
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'shipping' | 'delivery' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  orderId?: string;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'shipping',
    title: 'Order Shipped',
    message: 'Your order #ORD-2024-001 has been shipped and is on its way to your address.',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'medium',
    orderId: 'ORD-2024-001'
  },
  {
    id: '2',
    type: 'delivery',
    title: 'Delivery Completed',
    message: 'Order #ORD-2024-002 has been successfully delivered to your shipping address.',
    timestamp: '1 day ago',
    isRead: false,
    priority: 'high',
    orderId: 'ORD-2024-002'
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Thank you! Your order #ORD-2024-003 has been confirmed and is being processed.',
    timestamp: '2 days ago',
    isRead: true,
    priority: 'medium',
    orderId: 'ORD-2024-003'
  },
  {
    id: '4',
    type: 'system',
    title: 'Price Update',
    message: 'The price for PROTIVADUMANNIK SOL has been updated. Check the new pricing.',
    timestamp: '3 days ago',
    isRead: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'shipping',
    title: 'Shipping Delay',
    message: 'Your order #ORD-2024-004 shipment has been delayed due to weather conditions.',
    timestamp: '5 days ago',
    isRead: true,
    priority: 'high',
    orderId: 'ORD-2024-004'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: false } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5" />;
      case 'shipping':
        return <Truck className="h-5 w-5" />;
      case 'delivery':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-6 min-w-6 rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Stay updated with your order status and system updates
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
          size="sm"
        >
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'All caught up! No unread notifications.' 
                  : 'No notifications to display.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all hover:shadow-md ${
                !notification.isRead ? 'ring-1 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-full ${
                    notification.type === 'delivery' ? 'bg-green-100 text-green-600' :
                    notification.type === 'shipping' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'order' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge 
                          variant={getPriorityColor(notification.priority) as any}
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp}
                        {notification.orderId && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span>Order: {notification.orderId}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.isRead ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 px-2"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsUnread(notification.id)}
                            className="h-8 px-2"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;