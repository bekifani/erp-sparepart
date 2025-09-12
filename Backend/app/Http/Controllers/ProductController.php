<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Product;
use App\Models\Brandname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends BaseController
{
    protected $searchableColumns = [
        // product columns
        'products.id',
        'products.supplier_id',
        'products.qty',
        'products.min_qty',
        'products.purchase_price',
        'products.extra_cost',
        'products.cost_basis',
        'products.selling_price',
        'products.additional_note',
        'products.status',
        // moved fields now on products
        'products.oe_code',
        'product_desc.name_az',
        'product_desc.description_en',
        'product_desc.name_ru',
        'product_desc.name_cn',
        // related joined columns
        'product_information.product_code',
        'productnames.name_az',
        'productnames.product_name_code',
        'boxes.box_name',
        'labels.label_name',
        'units.name',
        'suppliers.supplier',
        // suppliers.code will be conditionally added to selects with alias supplier_code
    ];

    // Map frontend alias fields to real database columns
    private function mapField(string $field): string
    {
        $map = [
            // aliases used in SELECT as ...
            'product_name' => 'productnames.name_az',
            'product_name_code' => 'productnames.product_name_code',
            'brand_name' => 'brandnames.brand_name',
            'brand_code_name' => 'products.brand_code',
            'box_name' => 'boxes.box_name',
            'label_name' => 'labels.label_name',
            'unit_name' => 'units.name',
            'supplier' => 'suppliers.supplier',
            // front-end uses supplier_code, DB column is suppliers.code
            'supplier_code' => 'suppliers.code',
            'oe_code' => 'products.oe_code',
            'description' => 'products.description',
            'product_code' => 'product_information.product_code',
        ];
        return $map[$field] ?? $field;
    }

    public function index(Request $request)
    {
        $sortBy = 'products.id';
        $sortDir = 'desc';
        if (!empty($request['sort'])) {
            $candidate = $request['sort'][0]['field'];
            $sortBy = $this->mapField($candidate);
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10);
        $filters = $request['filter'];

        $query = Product::with(['ProductInformation'])
            ->leftJoin('product_information', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('productnames as product_desc', 'products.productname_id', '=', 'product_desc.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->leftJoin('suppliers', 'products.supplier_id', '=', 'suppliers.id');

        $selects = [
            'products.*',
            'product_information.product_code',
            // moved fields now selected from products
            'products.oe_code',
            'product_desc.name_az as description',
            'productnames.name_az as product_name',
            'productnames.product_name_code',
            'brandnames.brand_name',
            'products.brand_code as brand_code_name',
            'boxes.box_name',
            'labels.label_name',
            'units.name as unit_name',
            'suppliers.supplier as supplier',
        ];
        // Conditionally include suppliers.code as supplier_code alias if column exists; otherwise NULL alias
        if (Schema::hasColumn('suppliers', 'code')) {
            $selects[] = 'suppliers.code as supplier_code';
        } else {
            $selects[] = DB::raw('NULL as supplier_code');
        }

        $query->select($selects)
            ->orderBy($sortBy, $sortDir);

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

        $product = $query->paginate($perPage);
        $data = [
            "data" => $product->toArray(),
            'current_page' => $product->currentPage(),
            'total_pages' => $product->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_products()
    {
        $data = Product::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term)
    {
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }

        $query = Product::with(['ProductInformation'])
            ->leftJoin('product_information', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('productnames as product_desc', 'products.productname_id', '=', 'product_desc.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->leftJoin('suppliers', 'products.supplier_id', '=', 'suppliers.id');

        $selects = [
            DB::raw('products.id as value'),
            'product_information.product_code',
            'products.oe_code',
            'product_desc.name_az as description',
            'products.brand_code as brand_code_name',
            'productnames.name_az as product_name',
            'productnames.product_name_code',
            'brandnames.brand_name',
            'boxes.box_name',
            'labels.label_name',
            'units.name as unit_name',
            'suppliers.supplier as supplier',
        ];
        if (Schema::hasColumn('suppliers', 'code')) {
            $selects[] = 'suppliers.code as supplier_code';
        } else {
            $selects[] = DB::raw('NULL as supplier_code');
        }
        $query->select($selects);

        $searchable = $this->searchableColumns;
        // nothing to remove since we didn't include supplier_code here

        $results = $query->where(function ($q) use ($searchTerm, $searchable) {
                foreach ($searchable as $column) {
                    $q->orWhere($column, 'like', "%$searchTerm%");
                }
            })
            ->get()
            ->map(function ($item) {
                $brandCode = $item->brand_code_name;
                $parts = [];
                if ($item->brand_name) { $parts[] = $item->brand_name; }
                if ($brandCode) { $parts[] = '(' . $brandCode . ')'; }
                if ($item->oe_code) { $parts[] = '- ' . $item->oe_code; }
                if ($item->description) { $parts[] = '- ' . $item->description; }
                if ($item->product_code) { $parts[] = '- ' . $item->product_code; }
                $text = trim(preg_replace('/\s+/', ' ', implode(' ', $parts)));
                 return [
                     'value' => $item->value,
                     'text' => $text ?: (string)$item->value,
                     'product_code' => $item->product_code,
                     'product_name' => $item->product_name,
                     'brand_name' => $item->brand_name,
                     'brand_code_name' => $item->brand_code_name,
                     'oe_code' => $item->oe_code,
                     'description' => $item->description
                 ];
            });

        return response()->json($results);
    }

    public function store(Request $request)
    {
        $validationRules = [
            "supplier_id" => "required|exists:suppliers,id",
            "qty" => "required|numeric",
            "min_qty" => "nullable|numeric",
            "purchase_price" => "nullable|numeric",
            "extra_cost" => "nullable|numeric",
            "cost_basis" => "nullable|numeric",
            "selling_price" => "nullable|numeric",
            "additional_note" => "nullable|string",
            "status" => "nullable|string|max:255",
            // new fields on products
            "brand_id" => "nullable|exists:brandnames,id",
            "brand_code" => "nullable|string|max:255",
            "oe_code" => "nullable|string|max:255",
            "description" => "nullable|exists:productnames,id",
            "productname_id" => "nullable|exists:productnames,id",
            // virtual field from frontend to support find-or-create brand
            "brand_name" => "nullable|string|max:255",
        ];

        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated = $validation->validated();

        // If brand_name is provided, find-or-create the brand and set brand_id
        if (!empty($validated['brand_name'])) {
            // Build creation attributes conditionally (brandnames.brand_code may not exist)
            $creationAttributes = [];
            if (Schema::hasColumn('brandnames', 'brand_code') && array_key_exists('brand_code', $validated)) {
                $creationAttributes['brand_code'] = $validated['brand_code'];
            }
            $brand = Brandname::firstOrCreate(
                ['brand_name' => $validated['brand_name']],
                $creationAttributes
            );
            $validated['brand_id'] = $brand->id;
            // do not persist brand_name on products
            unset($validated['brand_name']);
        }

        // Map description field to productname_id
        if (!empty($validated['description'])) {
            $validated['productname_id'] = $validated['description'];
            unset($validated['description']);
        }

        try {
            $product = Product::create($validated);
            return $this->sendResponse($product, "product created succesfully");
        } catch (\Exception $e) {
            return $this->sendError("Error creating product", ['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return $this->sendResponse($product, "");
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validationRules = [
            "supplier_id" => "required|exists:suppliers,id",
            "qty" => "required|numeric",
            "min_qty" => "nullable|numeric",
            "purchase_price" => "nullable|numeric",
            "extra_cost" => "nullable|numeric",
            "cost_basis" => "nullable|numeric",
            "selling_price" => "nullable|numeric",
            "additional_note" => "nullable|string",
            "status" => "nullable|string|max:255",
            // new fields on products
            "brand_id" => "nullable|exists:brandnames,id",
            "brand_code" => "nullable|string|max:255",
            "oe_code" => "nullable|string|max:255",
            "description" => "nullable|exists:productnames,id",
            "productname_id" => "nullable|exists:productnames,id",
            // virtual field from frontend to support find-or-create brand
            "brand_name" => "nullable|string|max:255",
        ];

        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated = $validation->validated();

        // If brand_name is provided, find-or-create the brand and set brand_id
        if (!empty($validated['brand_name'])) {
            $creationAttributes = [];
            if (Schema::hasColumn('brandnames', 'brand_code') && array_key_exists('brand_code', $validated)) {
                $creationAttributes['brand_code'] = $validated['brand_code'];
            }
            $brand = Brandname::firstOrCreate(
                ['brand_name' => $validated['brand_name']],
                $creationAttributes
            );
            $validated['brand_id'] = $brand->id;
            unset($validated['brand_name']);
        }

        // Map description field to productname_id
        if (!empty($validated['description'])) {
            $validated['productname_id'] = $validated['description'];
            unset($validated['description']);
        }

        try {
            $product->update($validated);
            return $this->sendResponse($product, "product updated successfully");
        } catch (\Exception $e) {
            return $this->sendError("Error updating product", ['message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('ProductController@destroy called', ['id' => $id]);
            
            $product = Product::findOrFail($id);
            
            // Define tables in deletion order (respecting foreign key constraints)
            // Tables that reference other tables should be deleted first
            $relatedTablesInOrder = [
                // First: Delete tables that reference orderdetails
                'supplierorderdetails', // References orderdetails.id
                'packinglistboxitems',  // May reference orderdetails
                
                // Second: Delete tables that reference other related tables
                'problemitems',
                'customerinvoiceitems',
                'supplierinvoiceitems',
                'fileoperations',
                
                // Third: Delete direct product references
                'orderdetails',
                'basketitems',
                'productspecifications',
                'crosscodes',
                'crosscars',
                'productrules',
                'customerproductvisibilits',
                'supplierproducts',
                'producthistors',
                'product_information'
            ];
            
            // Check for foreign key constraints and handle cascade deletion
            $deletionSummary = [];
            
            foreach ($relatedTablesInOrder as $table) {
                $count = DB::table($table)->where('product_id', $id)->count();
                if ($count > 0) {
                    $deletionSummary[$table] = $count;
                }
            }
            
            if (!empty($deletionSummary)) {
                Log::info('Cascade deleting related records', [
                    'product_id' => $id,
                    'related_records' => $deletionSummary
                ]);
                
                // Delete related records in proper order
                foreach ($relatedTablesInOrder as $table) {
                    try {
                        $deleted = DB::table($table)->where('product_id', $id)->delete();
                        if ($deleted > 0) {
                            Log::info("Deleted $deleted records from $table");
                        }
                    } catch (\Exception $e) {
                        Log::error("Error deleting from $table: " . $e->getMessage());
                        // Continue with other tables
                    }
                }
                
                Log::info('Related records deleted successfully', [
                    'product_id' => $id,
                    'deleted_records' => $deletionSummary
                ]);
            }
            
            $product->delete();
            
            Log::info('Product deleted successfully', ['id' => $id]);
            return $this->sendResponse(1, "product deleted successfully");
        } catch (\Exception $e) {
            Log::error('Error deleting product', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Handle foreign key constraint violations with user-friendly messages
            if (str_contains($e->getMessage(), 'Integrity constraint violation') || str_contains($e->getMessage(), 'foreign key constraint fails')) {
                return $this->sendError("Cannot delete product", [
                    'message' => "This product is being used in other records and cannot be deleted. Please remove those references first."
                ], 409);
            }
            
            return $this->sendError("Error deleting product", ['message' => $e->getMessage()], 500);
        }
    }

    public function deleteFile($filePath)
    {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }
}
