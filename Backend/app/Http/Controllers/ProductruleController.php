<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productrule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductruleController extends BaseController
{
    protected $searchableColumns = ['customer_id', 'supplier_id', 'product_id', 'price', 'quantity', 'amount', 'note'];

    public function index(Request $request)
    {
        $sortBy = 'productrules.id';
        $sortDir = 'desc';
        if($request['sort']){
            $field = $request['sort'][0]['field'];
            $map = [
                'id' => 'productrules.id',
                'customer_id' => 'productrules.customer_id',
                'supplier_id' => 'productrules.supplier_id',
                'product_id' => 'productrules.product_id',
                'price' => 'productrules.price',
                'quantity' => 'productrules.quantity',
                'amount' => 'productrules.amount',
                'note' => 'productrules.note',
                'customer_name' => 'customers.name_surname',
                'supplier_name' => 'suppliers.supplier',
                'supplier_code' => 'suppliers.code',
                'brand_name' => 'brandnames.brand_name',
                'brand_code_name' => 'products.brand_code',
                'oe_code' => 'products.oe_code',
                'description' => 'products.description',
                'created_at' => 'productrules.created_at',
            ];
            $sortBy = $map[$field] ?? 'productrules.id';
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Productrule::leftJoin('customers', 'customers.id', '=', 'productrules.customer_id')
            ->leftJoin('suppliers', 'suppliers.id', '=', 'productrules.supplier_id')
            ->leftJoin('products', 'products.id', '=', 'productrules.product_id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->select([
                'productrules.*',
                'customers.name_surname as customer_name',
                'suppliers.supplier as supplier_name',
                'suppliers.code as supplier_code',
                'brandnames.brand_name as brand_name',
                'products.brand_code as brand_code_name',
                'products.oe_code',
                'products.description',
            ])
            ->orderBy($sortBy, $sortDir);
        if($filters){
            foreach ($filters as $filter) {
                $field = $filter['field'];
                $fieldMap = [
                    'id' => 'productrules.id',
                    'customer_id' => 'productrules.customer_id',
                    'supplier_id' => 'productrules.supplier_id',
                    'product_id' => 'productrules.product_id',
                    'price' => 'productrules.price',
                    'quantity' => 'productrules.quantity',
                    'amount' => 'productrules.amount',
                    'note' => 'productrules.note',
                    'customer_name' => 'customers.name_surname',
                    'supplier_name' => 'suppliers.supplier',
                    'supplier_code' => 'suppliers.code',
                    'brand_name' => 'brandnames.brand_name',
                    'brand_code_name' => 'products.brand_code',
                    'oe_code' => 'products.oe_code',
                    'description' => 'products.description',
                    'created_at' => 'productrules.created_at',
                ];
                $dbField = $fieldMap[$field] ?? $field;
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                // Special handling for null checks via filter API
                if ($searchTerm === 'null') {
                    if (in_array($operator, ['!=', '<>'])) {
                        $query->whereNotNull($dbField);
                        continue;
                    } elseif ($operator === '=') {
                        $query->whereNull($dbField);
                        continue;
                    }
                }
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                $query->where($dbField, $operator, $searchTerm);
            }
        }
        $productrule = $query->paginate($perPage); 
        $data = [
            "data" => $productrule->toArray(), 
            'current_page' => $productrule->currentPage(),
            'total_pages' => $productrule->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productrules(){
        $data = Productrule::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productrule::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for productrule');
    }


    public function store(Request $request)
    {
        // Log the incoming request for debugging
        \Log::info('Product Rule Creation Request:', [
            'all' => $request->all(),
            'json' => $request->getContent(),
            'headers' => $request->headers->all(),
        ]);

        $validationRules = [
            'customer_id' => 'nullable|exists:customers,id|required_without:supplier_id',
            'supplier_id' => 'nullable|exists:suppliers,id|required_without:customer_id',
            'product_id'  => 'required|exists:products,id',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:1',
            'amount'      => 'nullable|numeric',
            'note'        => 'nullable|string|max:255',
        ];

        $validation = Validator::make($request->all(), $validationRules);
        
        if ($validation->fails()) {
            \Log::error('Validation failed:', $validation->errors()->toArray());
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        
        $validated = $validation->validated();
        \Log::info('Validated data:', $validated);

        // If amount is not provided, compute it as quantity * price
        if (!isset($validated['amount'])) {
            $validated['amount'] = $validated['quantity'] * $validated['price'];
        }

        try {
            $productrule = Productrule::create($validated);
            \Log::info('Product rule created successfully:', $productrule->toArray());
            return $this->sendResponse($productrule, "Product rule created successfully");
        } catch (\Exception $e) {
            \Log::error('Error creating product rule:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->sendError("Error creating product rule: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        $productrule = Productrule::findOrFail($id);
        return $this->sendResponse($productrule, "");
    }


    public function update(Request $request, $id)
    {
        $productrule = Productrule::findOrFail($id);
        $validationRules = [
          'customer_id' => 'nullable|exists:customers,id|required_without:supplier_id',
          'supplier_id' => 'nullable|exists:suppliers,id|required_without:customer_id',
          'product_id'  => 'required|exists:products,id',
          'price'       => 'nullable|numeric',
          'quantity'    => 'required|integer|min:1',
          'amount'      => 'nullable|numeric',
          'note'        => 'nullable|string|max:255',
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        if (!isset($validated['amount'])) {
            $qty = (int)($validated['quantity'] ?? 0);
            $price = (float)($validated['price'] ?? 0);
            $validated['amount'] = $qty * $price;
        }

        $productrule->update($validated);
        return $this->sendResponse($productrule, "productrule updated successfully");
    }

    public function destroy($id)
    {
        $productrule = Productrule::findOrFail($id);
        $productrule->delete();

        //delete files uploaded
        return $this->sendResponse(1, "productrule deleted succesfully");
    }

    public function deleteFile($filePath) {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }
}
