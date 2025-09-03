<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\ProductInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductInformationController extends BaseController
{
    protected $searchableColumns = [
        'product_information.product_code', 
        'product_information.oe_code', 
        'product_information.description',
        'productnames.name_az',
        'productnames.product_name_code',
        'brandnames.brand_name',
        'brandnames.brand_code',
        'boxes.box_name',
        'labels.label_name'
    ];

    public function index(Request $request)
    {
        $sortBy = 'product_information.id';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        
        $query = ProductInformation::with(['productname', 'brandname', 'box', 'label', 'unit'])
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select(
                'product_information.*',
                'productnames.name_az as product_name',
                'productnames.product_name_code',
                'brandnames.brand_name',
                'brandnames.brand_code as brand_code_name',
                'boxes.box_name',
                'labels.label_name',
                'units.name as unit_name'
            )
            ->orderBy($sortBy, $sortDir);
            
        // Debug logging for product_name_id field (commented out to prevent 500 error)
        // \Log::info('ProductInformation Index Debug - Raw product_name_id from database:', [
        //     'sample_data' => ProductInformation::select('product_name_id')->take(3)->get()->toArray()
        // ]);
            
        if($filters){
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
        $productInformation = $query->paginate($perPage); 
        
        // Debug logging for final result (commented out to prevent 500 error)
        // \Log::info('ProductInformation Index Debug - Final result sample:', [
        //     'first_item' => $productInformation->items() ? $productInformation->items()[0] : null
        // ]);
        
        $data = [
            "data" => $productInformation->toArray(), 
            'current_page' => $productInformation->currentPage(),
            'total_pages' => $productInformation->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productInformations(){
        $data = ProductInformation::with(['productname', 'brandname', 'box', 'label', 'unit'])
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select(
                'product_information.*',
                'productnames.name_az as product_name',
                'productnames.product_name_code',
                'brandnames.brand_name',
                'brandnames.brand_code as brand_code_name',
                'boxes.box_name',
                'labels.label_name',
                'units.name as unit_name'
            )
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
        
        $results = ProductInformation::with(['productname', 'brandname', 'box', 'label', 'unit'])
            ->leftJoin('productnames', 'product_information.product_name_id', '=', 'productnames.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select(
                'product_information.*',
                'productnames.name_az as product_name',
                'productnames.product_name_code',
                'brandnames.brand_name',
                'brandnames.brand_code as brand_code_name',
                'boxes.box_name',
                'labels.label_name',
                'units.name as unit_name'
            )
            ->where(function ($query) use ($searchTerm) {
                // Search in product_information table
                $query->where('product_information.product_code', 'like', "%$searchTerm%")
                      ->orWhere('product_information.oe_code', 'like', "%$searchTerm%")
                      ->orWhere('product_information.description', 'like', "%$searchTerm%")
                      // Search in related tables
                      ->orWhere('productnames.name_az', 'like', "%$searchTerm%")
                      ->orWhere('productnames.product_name_code', 'like', "%$searchTerm%")
                      ->orWhere('brandnames.brand_name', 'like', "%$searchTerm%")
                      ->orWhere('brandnames.brand_code', 'like', "%$searchTerm%")
                      ->orWhere('boxes.box_name', 'like', "%$searchTerm%")
                      ->orWhere('labels.label_name', 'like', "%$searchTerm%");
            })
            ->paginate(20);
            
        return $this->sendResponse($results , 'search results for productInformation');
    }


    public function store(Request $request)
    {
        $validationRules = [
          "product_name_id"=>"required|exists:productnames,id",
          "product_code"=>"required|string|unique:product_information,product_code|max:255",
          "brand_code"=>"required|exists:brandnames,id",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"nullable|string|max:255",
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
          "product_name_id"=>"required|exists:productnames,id",
          "product_code"=>"required|string|unique:product_information,product_code,".$id."|max:255",
          "brand_code"=>"required|exists:brandnames,id",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"nullable|string|max:255",
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
