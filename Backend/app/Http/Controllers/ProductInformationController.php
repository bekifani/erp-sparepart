<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\ProductInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductInformationController extends BaseController
{
    protected $searchableColumns = [
        'products.description',
        'brandnames.brand_name',
        'products.brand_code',
        'boxes.box_name',
        'labels.label_name'
    ];

    // Map frontend alias fields to actual DB columns for filtering/sorting
    private function mapField(string $field): string
    {
        $map = [
            'brand_name' => 'brandnames.brand_name',
            'brand_code_name' => 'products.brand_code',
            'box_name' => 'boxes.box_name',
            'label_name' => 'labels.label_name',
            'unit_name' => 'units.name',
            'description' => 'products.description',
        ];
        return $map[$field] ?? $field;
    }

    public function index(Request $request)
    {
        $sortBy = 'product_information.id';
        $sortDir = 'desc';
        if(!empty($request['sort'])){
            $candidate = $request['sort'][0]['field'];
            $sortBy = $this->mapField($candidate);
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        
        $query = ProductInformation::with(['brandname', 'box', 'label', 'unit'])
            // switch to products and brandnames via products
            ->leftJoin('products', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select([
                'product_information.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                'boxes.box_name',
                'labels.label_name',
                DB::raw('units.name as unit_name'),
                DB::raw('products.description as description'),
                DB::raw('products.oe_code as oe_code'),
            ])
            ->orderBy($sortBy, $sortDir);
            
        if($filters){
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
        $productInformation = $query->paginate($perPage); 
        
        $data = [
            "data" => $productInformation->toArray(), 
            'current_page' => $productInformation->currentPage(),
            'total_pages' => $productInformation->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productInformations(){
        $data = ProductInformation::with(['brandname', 'box', 'label', 'unit'])
            ->leftJoin('products', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select([
                'product_information.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                'boxes.box_name',
                'labels.label_name',
                DB::raw('units.name as unit_name'),
                DB::raw('products.description as description'),
                DB::raw('products.oe_code as oe_code'),
            ])
            ->get();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        
        $results = ProductInformation::with(['brandname', 'box', 'label', 'unit'])
            ->leftJoin('products', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select([
                'product_information.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                'boxes.box_name',
                'labels.label_name',
                DB::raw('units.name as unit_name'),
                DB::raw('products.description as description'),
                DB::raw('products.oe_code as oe_code'),
            ])
            ->where(function ($query) use ($searchTerm) {
                $query->where('products.description', 'like', "%$searchTerm%")
                      ->orWhere('brandnames.brand_name', 'like', "%$searchTerm%")
                      ->orWhere('products.brand_code', 'like', "%$searchTerm%")
                      ->orWhere('boxes.box_name', 'like', "%$searchTerm%")
                      ->orWhere('labels.label_name', 'like', "%$searchTerm%");
            })
            ->paginate(20);
            
        return $this->sendResponse($results , 'search results for productInformation');
    }


    public function store(Request $request)
    {
        $validationRules = [
          // now product_id is required
          "product_id"=>"required|exists:products,id",
          // product_name_id is not required anymore
          "product_name_id"=>"nullable|exists:productnames,id",
          // moved fields removed from validation
          "net_weight"=>"nullable|numeric",
          "gross_weight"=>"nullable|numeric",
          "unit_id"=>"required|exists:units,id",
          "box_id"=>"nullable|exists:boxes,id",
          "product_size_a"=>"nullable|numeric",
          "product_size_b"=>"nullable|numeric",
          "product_size_c"=>"nullable|numeric",
          "volume"=>"nullable|numeric",
          "label_id"=>"nullable|exists:labels,id",
          "qr_code"=>"nullable|string|max:255",
          "properties"=>"nullable|string|max:255",
          "technical_image"=>"nullable|string",
          "image"=>"nullable|string",
          "size_mode"=>"nullable|string|max:255",
          "additional_note"=>"nullable|string",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        //file uploads

        // TEMP HOTFIX: DB has product_information.product_code as NOT NULL. Auto-generate if missing.
        if (!array_key_exists('product_code', $validated) || $validated['product_code'] === null) {
            $validated['product_code'] = 'PI-' . ($validated['product_id'] ?? 'X') . '-' . time();
        }

        $productInformation = ProductInformation::create($validated);
        return $this->sendResponse($productInformation, "productInformation created succesfully");
    }

    public function show($id)
    {
        $productInformation = ProductInformation::findOrFail($id);
        return $this->sendResponse($productInformation, "");
    }


    public function update(Request $request, $id)
    {
        $productInformation = ProductInformation::findOrFail($id);
         $validationRules = [
          // now product_id is required
          "product_id"=>"required|exists:products,id",
          // product_name_id is not required anymore
          "product_name_id"=>"nullable|exists:productnames,id",
          // moved fields removed from validation
          "net_weight"=>"nullable|numeric",
          "gross_weight"=>"nullable|numeric",
          "unit_id"=>"required|exists:units,id",
          "box_id"=>"nullable|exists:boxes,id",
          "product_size_a"=>"nullable|numeric",
          "product_size_b"=>"nullable|numeric",
          "product_size_c"=>"nullable|numeric",
          "volume"=>"nullable|numeric",
          "label_id"=>"nullable|exists:labels,id",
          "qr_code"=>"nullable|string|max:255",
          "properties"=>"nullable|string|max:255",
          "technical_image"=>"nullable|string",
          "image"=>"nullable|string",
          "size_mode"=>"nullable|string|max:255",
          "additional_note"=>"nullable|string",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        //file uploads update

        $productInformation->update($validated);
        return $this->sendResponse($productInformation, "productInformation updated successfully");
    }

    public function destroy($id)
    {
        $productInformation = ProductInformation::findOrFail($id);
        $productInformation->delete();

        $this->deleteFile($productInformation->technical_image);$this->deleteFile($productInformation->image);

        //delete files uploaded
        return $this->sendResponse(1, "productInformation deleted succesfully");
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
