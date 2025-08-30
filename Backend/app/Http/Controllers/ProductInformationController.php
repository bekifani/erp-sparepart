<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\ProductInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductInformationController extends BaseController
{
    protected $searchableColumns = ['product_name_id', 'product_code', 'brand_code', 'oe_code', 'description', 'net_weight', 'gross_weight', 'unit_id', 'box_id', 'product_size_a', 'product_size_b', 'product_size_c', 'volume', 'label_id', 'qr_code', 'properties', 'technical_image', 'image', 'size_mode', 'additional_note'];

    public function index(Request $request)
    {
        $sortBy = 'id';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = ProductInformation::orderBy($sortBy, $sortDir);
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
        $data = [
            "data" => $productInformation->toArray(), 
            'current_page' => $productInformation->currentPage(),
            'total_pages' => $productInformation->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productInformations(){
        $data = ProductInformation::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = ProductInformation::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for productInformation');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "product_name_id"=>"required|exists:product_names,id",
          "product_code"=>"required|string|unique:product_information,product_code|max:255",
          "brand_code"=>"required|exists:brand_names,brand_code",
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
          "technical_image"=>"nullable|",
          "image"=>"nullable|",
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
            //for update

          
          "product_name_id"=>"required|exists:product_names,id",
          "product_code"=>"required|string|unique:product_information,product_code|max:255",
          "brand_code"=>"required|exists:brand_names,brand_code",
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
          "technical_image"=>"nullable|",
          "image"=>"nullable|",
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
