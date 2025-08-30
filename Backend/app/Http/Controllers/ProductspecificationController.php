<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productspecification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductspecificationController extends BaseController
{
    protected $searchableColumns = ['product_id', 'headname_id', 'value'];

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
        $query = Productspecification::orderBy($sortBy, $sortDir);
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
        $productspecification = $query->paginate($perPage); 
        $data = [
            "data" => $productspecification->toArray(), 
            'current_page' => $productspecification->currentPage(),
            'total_pages' => $productspecification->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productspecifications(){
        $data = Productspecification::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productspecification::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for productspecification');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "product_id"=>"required|exists:products,id",
          "headname_id"=>"required|exists:specification_headnames,id",
          "value"=>"required|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $productspecification = Productspecification::create($validated);
        return $this->sendResponse($productspecification, "productspecification created succesfully");
    }

    public function show($id)
    {
        $productspecification = Productspecification::findOrFail($id);
        return $this->sendResponse($productspecification, "");
    }


    public function update(Request $request, $id)
    {
        $productspecification = Productspecification::findOrFail($id);
         $validationRules = [
            //for update

          
          "product_id"=>"required|exists:products,id",
          "headname_id"=>"required|exists:specification_headnames,id",
          "value"=>"required|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $productspecification->update($validated);
        return $this->sendResponse($productspecification, "productspecification updated successfully");
    }

    public function destroy($id)
    {
        $productspecification = Productspecification::findOrFail($id);
        $productspecification->delete();





        //delete files uploaded
        return $this->sendResponse(1, "productspecification deleted succesfully");
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
