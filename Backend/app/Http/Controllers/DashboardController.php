<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Auth;
use DB;
use App\Models\Compan;
use App\Models\Contact;
use App\Models\Employee;
use App\Models\Addressbook;
use App\Models\Ad;
use App\Models\Sector;
use App\Models\Categorie;
use App\Models\Order;
use App\Models\Orderdetail;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Productname;
use App\Models\Crosscar;

class DashboardController extends BaseController
{
    /**
     * Get dashboard data including notifications and product statistics
     */
    public function dashboard_data(Request $request)
    {
        $user = Auth::user();
        
        // Get user notifications
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            });

        // Get top 1000 cars in catalog
        $topCars = $this->getTopCars(1000);
        
        // Get top 100 products
        $topProducts = $this->getTopProducts(100);

        return $this->sendResponse([
            'notifications' => $notifications,
            'top_cars' => $topCars,
            'top_products' => $topProducts,
        ], __('messages.dashboard_data_retrieved_successfully'));
    }

    /**
     * Get notifications for authenticated user
     */
    public function getNotifications(Request $request)
    {
        $user = Auth::user();
        $limit = $request->get('limit', 20);
        $unreadOnly = $request->get('unread_only', false);

        $query = $user->notifications()->orderBy('created_at', 'desc');
        
        if ($unreadOnly) {
            $query->whereNull('read_at');
        }
        
        $notifications = $query->limit($limit)->get()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ];
        });

        return $this->sendResponse([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ], __('messages.notifications_retrieved_successfully'));
    }

    /**
     * Get filtered product list based on criteria
     */
    public function getFilteredProducts(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'metric' => 'nullable|in:all,sold,not_sold',
            'country_id' => 'nullable|integer|exists:customers,country',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'description' => 'nullable|string',
            'columns' => 'nullable|array',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return $this->sendError(__('messages.invalid_input'), $validator->errors());
        }

        $metric = $request->get('metric', 'all');
        $countryId = $request->get('country_id');
        $customerId = $request->get('customer_id');
        $description = $request->get('description');
        $columns = $request->get('columns', ['country', 'customer', 'brand', 'brand_code', 'description', 'category', 'min_qty', 'price']);
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 20);

        $query = Product::with(['brand', 'productname', 'supplier'])
            ->join('orderdetails', 'products.id', '=', 'orderdetails.product_id')
            ->join('orders', 'orderdetails.order_id', '=', 'orders.id')
            ->join('customers', 'orders.customer_id', '=', 'customers.id')
            ->select([
                'products.*',
                'customers.country',
                'customers.name_surname as customer_name',
                'orders.id as order_id',
                'orderdetails.qty as sold_qty',
                'orderdetails.unit_price as sold_price'
            ]);

        // Apply metric filter
        if ($metric === 'sold') {
            $query->where('orderdetails.qty', '>', 0);
        } elseif ($metric === 'not_sold') {
            $query->where('orderdetails.qty', '=', 0);
        }

        // Apply country filter
        if ($countryId) {
            $query->where('customers.country', $countryId);
        }

        // Apply customer filter
        if ($customerId) {
            $query->where('customers.id', $customerId);
        }

        // Apply description filter
        if ($description) {
            $query->where('products.description', 'like', '%' . $description . '%');
        }

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        // Get filter options
        $filterOptions = $this->getFilterOptions();

        return $this->sendResponse([
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
            'filter_options' => $filterOptions,
            'available_columns' => [
                'country' => __('messages.country'),
                'customer' => __('messages.customer'),
                'brand' => __('messages.brand'),
                'brand_code' => __('messages.brand_code'),
                'description' => __('messages.description'),
                'category' => __('messages.category'),
                'min_qty' => __('messages.min_qty'),
                'price' => __('messages.price'),
            ],
        ], __('messages.products_retrieved_successfully'));
    }

    /**
     * Get top cars in catalog
     */
    public function getTopCars(Request $request)
    {
        $limit = $request->get('limit', 1000);
        
        $topCars = Crosscar::with(['product', 'product.brand'])
            ->select('car_name', DB::raw('COUNT(*) as product_count'))
            ->groupBy('car_name')
            ->orderBy('product_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($car) {
                return [
                    'car_name' => $car->car_name,
                    'product_count' => $car->product_count,
                ];
            });

        return $this->sendResponse($topCars, __('messages.top_cars_retrieved_successfully'));
    }

    /**
     * Get top products by name
     */
    public function getTopProducts(Request $request)
    {
        $limit = $request->get('limit', 100);
        
        $topProducts = Productname::withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'product_count' => $product->products_count,
                ];
            });

        return $this->sendResponse($topProducts, __('messages.top_products_retrieved_successfully'));
    }

    /**
     * Get filter options for dropdowns
     */
    private function getFilterOptions()
    {
        return [
            'countries' => Customer::select('country')
                ->distinct()
                ->whereNotNull('country')
                ->orderBy('country')
                ->pluck('country'),
            'customers' => Customer::select('id', 'name_surname')
                ->orderBy('name_surname')
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name_surname,
                    ];
                }),
            'metrics' => [
                ['value' => 'all', 'label' => __('messages.all')],
                ['value' => 'sold', 'label' => __('messages.sold')],
                ['value' => 'not_sold', 'label' => __('messages.not_sold')],
            ],
        ];
    }

    /**
     * Mark notifications as read
     */
    public function markNotificationsAsRead(Request $request)
    {
        $user = Auth::user();
        $notificationIds = $request->get('notification_ids', []);

        if (empty($notificationIds)) {
            $user->unreadNotifications->markAsRead();
        } else {
            $user->notifications()
                ->whereIn('id', $notificationIds)
                ->update(['read_at' => now()]);
        }

        return $this->sendResponse([], __('messages.notifications_marked_as_read'));
    }
}
