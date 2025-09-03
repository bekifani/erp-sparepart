<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductnameController extends BaseController
{
    protected $searchableColumns = ['hs_code', 'name_az', 'description_en', 'name_ru', 'name_cn', 'categories', 'product_name_code', 'additional_note', 'product_qty'];

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
        $query = Productname::orderBy($sortBy, $sortDir);
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
        $productname = $query->paginate($perPage); 
        $data = [
            "data" => $productname->toArray(), 
            'current_page' => $productname->currentPage(),
            'total_pages' => $productname->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productnames(){
        $data = Productname::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productname::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->select('id', 'hs_code', 'name_az', 'description_en', 'name_ru', 'name_cn', 'categories', 'product_name_code', 'additional_note', 'product_qty')
        ->paginate(20);
        return $this->sendResponse($results , 'search results for productname');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "hs_code"=>"nullable|string|max:255",
          "name_az"=>"required|string|max:255",
          "description_en"=>"required|string|max:255",
          "name_ru"=>"required|string|max:255",
          "name_cn"=>"required|string|max:255",
          "categories"=>"required|string|max:255",
          "product_name_code"=>"required|string|unique:productnames,product_name_code|max:255",
          "additional_note"=>"nullable|string",
          "product_qty"=>"nullable|numeric",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $productname = Productname::create($validated);
        return $this->sendResponse($productname, "productname created succesfully");
    }

    public function show($id)
    {
        $productname = Productname::findOrFail($id);
        return $this->sendResponse($productname, "");
    }


    public function update(Request $request, $id)
    {
        $productname = Productname::findOrFail($id);
         $validationRules = [
          "hs_code"=>"nullable|string|max:255",
          "name_az"=>"required|string|max:255",
          "description_en"=>"required|string|max:255",
          "name_ru"=>"required|string|max:255",
          "name_cn"=>"required|string|max:255",
          "categories"=>"required|string|max:255",
          "product_name_code"=>"required|string|unique:productnames,product_name_code,".$id."|max:255",
          "additional_note"=>"nullable|string",
          "product_qty"=>"nullable|numeric",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $productname->update($validated);
        return $this->sendResponse($productname, "productname updated successfully");
    }

    public function destroy($id)
    {
        $productname = Productname::findOrFail($id);
        $productname->delete();





        //delete files uploaded
        return $this->sendResponse(1, "productname deleted succesfully");
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
