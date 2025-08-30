<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Brandname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class BrandnameController extends BaseController
{
    protected $searchableColumns = ['brand_code', 'brand_name', 'name_az', 'name_ru', 'name_cn', 'number_of_products'];

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
        $query = Brandname::orderBy($sortBy, $sortDir);
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
        $brandname = $query->paginate($perPage); 
        $data = [
            "data" => $brandname->toArray(), 
            'current_page' => $brandname->currentPage(),
            'total_pages' => $brandname->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_brandnames(){
        $data = Brandname::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Brandname::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for brandname');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "brand_code"=>"required|string|unique:brand_names,brand_code|max:255",
          "brand_name"=>"required|string|max:255",
          "name_az"=>"nullable|string|max:255",
          "name_ru"=>"nullable|string|max:255",
          "name_cn"=>"nullable|string|max:255",
          "number_of_products"=>"nullable|numeric",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $brandname = Brandname::create($validated);
        return $this->sendResponse($brandname, "brandname created succesfully");
    }

    public function show($id)
    {
        $brandname = Brandname::findOrFail($id);
        return $this->sendResponse($brandname, "");
    }


    public function update(Request $request, $id)
    {
        $brandname = Brandname::findOrFail($id);
         $validationRules = [
            //for update

          
          "brand_code"=>"required|string|unique:brand_names,brand_code|max:255",
          "brand_name"=>"required|string|max:255",
          "name_az"=>"nullable|string|max:255",
          "name_ru"=>"nullable|string|max:255",
          "name_cn"=>"nullable|string|max:255",
          "number_of_products"=>"nullable|numeric",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $brandname->update($validated);
        return $this->sendResponse($brandname, "brandname updated successfully");
    }

    public function destroy($id)
    {
        $brandname = Brandname::findOrFail($id);
        $brandname->delete();





        //delete files uploaded
        return $this->sendResponse(1, "brandname deleted succesfully");
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
