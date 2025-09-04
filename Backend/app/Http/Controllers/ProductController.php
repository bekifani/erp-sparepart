<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends BaseController
{
    protected $searchableColumns = [
        // product columns
        'products.product_information_id',
        'products.supplier_id',
        'products.qty',
        'products.min_qty',
        'products.purchase_price',
        'products.extra_cost',
        'products.cost_basis',
        'products.selling_price',
        'products.additional_note',
        'products.status',
        // product_information and related joined columns
        'product_information.product_code',
        'product_information.oe_code',
        'product_information.description',
        'productnames.name_az',
        'productnames.product_name_code',
        'brandnames.brand_name',
        'brandnames.brand_code',
        'boxes.box_name',
        'labels.label_name',
        'units.name',
        'suppliers.supplier'
    ];

    public function index(Request $request)
    {
        $sortBy = 'products.id';
        $sortDir = 'desc';
        if ($request['sort']) {
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10);
        $filters = $request['filter'];

        $query = Product::with(['ProductInformation'])
            ->leftJoin('product_information', 'products.product_information_id', '=', 'product_information.id')
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->leftJoin('suppliers', 'products.supplier_id', '=', 'suppliers.id')
            ->select(
                'products.*',
                'product_information.product_code',
                'product_information.oe_code',
                'product_information.description',
                'productnames.name_az as product_name',
                'productnames.product_name_code',
                'brandnames.brand_name',
                'brandnames.brand_code as brand_code_name',
                'boxes.box_name',
                'labels.label_name',
                'units.name as unit_name',
                'suppliers.supplier as supplier'
            )
            ->orderBy($sortBy, $sortDir);

        if ($filters) {
            foreach ($filters as $filter) {
                $field = $filter['field'];
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

        $results = Product::with(['ProductInformation'])
            ->leftJoin('product_information', 'products.product_information_id', '=', 'product_information.id')
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->leftJoin('suppliers', 'products.supplier_id', '=', 'suppliers.id')
            ->select(
                'products.id as value',
                'product_information.product_code',
                'product_information.oe_code',
                'product_information.description',
                'productnames.name_az as product_name',
                'productnames.product_name_code',
                'brandnames.brand_name',
                'brandnames.brand_code as brand_code_name',
                'boxes.box_name',
                'labels.label_name',
                'units.name as unit_name',
                'suppliers.supplier as supplier'
            )
            ->where(function ($query) use ($searchTerm) {
                foreach ($this->searchableColumns as $column) {
                    $query->orWhere($column, 'like', "%$searchTerm%");
                }
            })
            ->get()
            ->map(function ($item) {
                return [
                    'value' => $item->value,
                    'text' => $item->product_name . ' (' . $item->product_code . ')',
                    'product_code' => $item->product_code,
                    'product_name' => $item->product_name,
                    'brand_name' => $item->brand_name,
                    'description' => $item->description
                ];
            });

        return response()->json($results);
    }

    public function store(Request $request)
    {
        $validationRules = [
            "product_information_id" => "required|exists:product_information,id",
            "supplier_id" => "required|exists:suppliers,id",
            "qty" => "required|numeric",
            "min_qty" => "nullable|numeric",
            "purchase_price" => "nullable|numeric",
            "extra_cost" => "nullable|numeric",
            "cost_basis" => "nullable|numeric",
            "selling_price" => "nullable|numeric",
            "additional_note" => "nullable|string",
            "status" => "nullable|string|max:255",
        ];

        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated = $validation->validated();

        $product = Product::create($validated);
        return $this->sendResponse($product, "product created succesfully");
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
            "product_information_id" => "required|exists:product_information,id",
            "supplier_id" => "required|exists:suppliers,id",
            "qty" => "required|numeric",
            "min_qty" => "nullable|numeric",
            "purchase_price" => "nullable|numeric",
            "extra_cost" => "nullable|numeric",
            "cost_basis" => "nullable|numeric",
            "selling_price" => "nullable|numeric",
            "additional_note" => "nullable|string",
            "status" => "nullable|string|max:255",
        ];

        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated = $validation->validated();

        $product->update($validated);
        return $this->sendResponse($product, "product updated successfully");
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return $this->sendResponse(1, "product deleted succesfully");
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
