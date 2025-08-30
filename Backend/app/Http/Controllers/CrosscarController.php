<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Crosscar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CrosscarController extends BaseController
{
    protected $searchableColumns = ['product_id', 'car_model_id', 'cross_code', 'is_visible', 'created_at', 'updated_at'];

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
        $query = Crosscar::orderBy($sortBy, $sortDir);
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
        $crosscar = $query->paginate($perPage); 
        $data = [
            "data" => $crosscar->toArray(), 
            'current_page' => $crosscar->currentPage(),
            'total_pages' => $crosscar->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_crosscars(){
        $data = Crosscar::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Crosscar::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for crosscar');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "product_id"=>"required|exists:products,id",
          "car_model_id"=>"required|exists:car_models,id",
          "cross_code"=>"required|string|max:255",
          "is_visible"=>"required|boolean",
          "created_at"=>"required|date",
          "updated_at"=>"required|date",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $crosscar = Crosscar::create($validated);
        return $this->sendResponse($crosscar, "crosscar created succesfully");
    }

    public function show($id)
    {
        $crosscar = Crosscar::findOrFail($id);
        return $this->sendResponse($crosscar, "");
    }


    public function update(Request $request, $id)
    {
        $crosscar = Crosscar::findOrFail($id);
         $validationRules = [
            //for update

          
          "product_id"=>"required|exists:products,id",
          "car_model_id"=>"required|exists:car_models,id",
          "cross_code"=>"required|string|max:255",
          "is_visible"=>"required|boolean",
          "created_at"=>"required|date",
          "updated_at"=>"required|date",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $crosscar->update($validated);
        return $this->sendResponse($crosscar, "crosscar updated successfully");
    }

    public function destroy($id)
    {
        $crosscar = Crosscar::findOrFail($id);
        $crosscar->delete();





        //delete files uploaded
        return $this->sendResponse(1, "crosscar deleted succesfully");
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
