<?php

namespace App\Http\Controllers;

use App\Models\StockItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class StockItemController
{
    // List all stock items
    // public function index()
    // {
    //     return response()->json(StockItem::with(['user', 'supplier', 'brand'])->get());
    // }

    private function mapField($field)
    {
        $map = [
            'id'            => 'stock_items.id',
            'user_name'     => 'users.name',
            'supplier_name' => 'suppliers.supplier',
            'supplier_code' => 'stock_items.supplier_code',
            'brand_name'    => 'brandnames.brand_name',
            'brand_code'    => 'stock_items.brand_code',
            'oe_code'       => 'stock_items.oe_code',
            'description'   => 'stock_items.description',
            'qty'      => 'stock_items.qty',
            'min_qty'      => 'stock_items.min_qty',
            'purchase_price'         => 'stock_items.purchase_price',
            'extra_cost'      => 'stock_items.extra_cost',
            'cost_basis'      => 'stock_items.cost_basis',
            'note'      => 'stock_items.note',
            'status'        => 'stock_items.status',
        ];

        return $map[$field] ?? 'stock_items.id';
    }

    
    public function index(Request $request)
    {
        $sortBy = 'stock_items.id';
        $sortDir = 'desc';

        // Handle sorting from request
        if (!empty($request['sort'])) {
            $candidate = $request['sort'][0]['field'];
            $sortBy = $this->mapField($candidate);
            $sortDir = $request['sort'][0]['dir'];
        }

        // Pagination size (default 10)
        $perPage = $request->query('size', 10);

        // Filters from request
        $filters = $request['filter'];

        // Build query with joins
        $query = StockItem::with(['user', 'supplier', 'brand'])
            ->leftJoin('users', 'stock_items.user_id', '=', 'users.id')
            ->leftJoin('suppliers', 'stock_items.supplier_id', '=', 'suppliers.id')
            ->leftJoin('brandnames', 'stock_items.brand_id', '=', 'brandnames.id');

        // Select fields
        $selects = [
            'stock_items.*',
            'users.name as user_name',
            'suppliers.supplier as supplier_name',
            'brandnames.brand_name as brand_name',
        ];

        // Conditionally include suppliers.code if exists
        if (Schema::hasColumn('suppliers', 'code')) {
            $selects[] = 'suppliers.code as supplier_code';
        } else {
            $selects[] = DB::raw('NULL as supplier_code');
        }

        $query->select($selects)->orderBy($sortBy, $sortDir);

        // Apply filters if any
        if ($filters) {
            foreach ($filters as $filter) {
                $field = $this->mapField($filter['field']);
                $operator = $filter['type'];
                $searchTerm = $filter['value'];

                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }

                $query->where($field, $operator, $searchTerm);
            }
        }

        // Paginate
        $stockItems = $query->paginate($perPage);

        $data = [
            "data" => $stockItems->toArray(),
            'current_page' => $stockItems->currentPage(),
            'total_pages' => $stockItems->lastPage(),
            'per_page' => $perPage
        ];

        return response()->json($data);
    }

    // Store a new stock item
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'       => 'nullable|exists:users,id',
            'supplier_id'   => 'nullable|exists:suppliers,id',
            'supplier_code' => 'required|string',
            'brand_id'      => 'nullable|exists:brandnames,id',
            'brand_code'    => 'required|string',
            'oe_code'       => 'required|string',
            'description'   => 'required|string',
            'unit_type'   => 'required|string',
            'qty'      => 'required|integer|min:0',
            'min_qty'      => 'required|integer|min:1',
            'purchase_price'         => 'required|numeric|min:0',
            'extra_cost'      => 'required|numeric',
            'cost_basis'      => 'required|numeric',
            'amount'      => 'required|numeric',
            'status'        => 'required|in:In Stock, Out of Stock, In Supplier Warehouse',
            'note' => 'nullable'
        ]);

        $stockItem = StockItem::create($validated);

        return response()->json([
            'message' => 'stock item created successfully',
            'items' => $stockItem
        ], 201);
    }

    public function show($id)
    {
        $stockItem = StockItem::findOrFail($id);
        return response()->json($stockItem->load(['user', 'supplier', 'brand']));
    }

    public function updateItem(Request $request, $id)
    {
        $stockItem = StockItem::findOrFail($id);

        $validated = $request->validate([
            'user_id'       => 'nullable|exists:users,id',
            'supplier_id'   => 'nullable|exists:suppliers,id',
            'supplier_code' => 'sometimes|string',
            'brand_id'      => 'nullable|exists:brandnames,id',
            'brand_code'    => 'sometimes|string',
            'oe_code'       => 'sometimes|string',
            'description'   => 'sometimes|string',
            'qty'      => 'sometimes|integer|min:0',
            'min_qty'      => 'sometimes|integer|min:1',
            'purchase_price'         => 'sometimes|numeric|min:0',
            'extra_cost'      => 'sometimes|string',
            'cost_basis'      => 'sometimes|string',
            'amount'      => 'sometimes|string',
            'note'      => 'sometimes|string',
            'status'        => 'sometimes|in:In Stock, Out of Stock, In Supplier Warehouse',
        ]);

        $stockItem->update($validated);

        return response()->json($stockItem);
    }

    public function destroy($id)
    {
        $stockItem = StockItem::findOrFail($id);
        $stockItem->delete();
        return response()->json(null, 204);
    }

}
