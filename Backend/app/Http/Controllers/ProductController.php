<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductController extends BaseController
{
    protected $searchableColumns = ['product_information_id', 'supplier_id', 'qty', 'min_qty', 'purchase_price', 'extra_cost', 'cost_basis', 'selling_price', 'additional_note', 'status'];

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
        $query = Product::orderBy($sortBy, $sortDir);
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
        $product = $query->paginate($perPage); 
        $data = [
            "data" => $product->toArray(), 
            'current_page' => $product->currentPage(),
            'total_pages' => $product->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_products(){
        $data = Product::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Product::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for product');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "product_information_id"=>"required|exists:product_information,id",
          "supplier_id"=>"required|exists:suppliers,id",
          "qty"=>"required|numeric",
          "min_qty"=>"nullable|numeric",
          "purchase_price"=>"nullable|numeric",
          "extra_cost"=>"nullable|numeric",
          "cost_basis"=>"nullable|numeric",
          "selling_price"=>"nullable|numeric",
          "additional_note"=>"nullable|string",
          "status"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

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
            //for update

          
          "product_information_id"=>"required|exists:product_information,id",
          "supplier_id"=>"required|exists:suppliers,id",
          "qty"=>"required|numeric",
          "min_qty"=>"nullable|numeric",
          "purchase_price"=>"nullable|numeric",
          "extra_cost"=>"nullable|numeric",
          "cost_basis"=>"nullable|numeric",
          "selling_price"=>"nullable|numeric",
          "additional_note"=>"nullable|string",
          "status"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $product->update($validated);
        return $this->sendResponse($product, "product updated successfully");
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();





        //delete files uploaded
        return $this->sendResponse(1, "product deleted succesfully");
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
