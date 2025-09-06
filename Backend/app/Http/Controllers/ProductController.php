<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
        'products.description',
        // allow searching by products.brand_code as requested
        'products.brand_code',
        // related joined columns
        'product_information.product_code',
        'productnames.name_az',
        'productnames.product_name_code',
        'brandnames.brand_name',
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
            'products.description',
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
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->leftJoin('suppliers', 'products.supplier_id', '=', 'suppliers.id');

        $selects = [
            DB::raw('products.id as value'),
            'product_information.product_code',
            'products.oe_code',
            'products.description',
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
            "description" => "nullable|string|max:255",
        ];

        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated = $validation->validated();

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
            "description" => "nullable|string|max:255",
        ];

        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated = $validation->validated();

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
            $product = Product::findOrFail($id);
            $product->delete();
            return $this->sendResponse(1, "product deleted succesfully");
        } catch (\Exception $e) {
            return $this->sendError("Error deleting product", ['message' => $e->getMessage()]);
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
