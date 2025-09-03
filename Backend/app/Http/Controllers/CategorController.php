<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Categor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategorController extends BaseController
{
    protected $searchableColumns = ['category_en', 'category_ru', 'category_cn', 'category_az', 'category_code'];

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
        $query = Categor::orderBy($sortBy, $sortDir);
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
        $categor = $query->paginate($perPage); 
        $data = [
            "data" => $categor->toArray(), 
            'current_page' => $categor->currentPage(),
            'total_pages' => $categor->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_categors(){
        $data = Categor::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Categor::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for categor');
    }


    public function store(Request $request)
    {

        $validationRules = [
          
          "category_en"=>"required|string|max:255",
          "category_ru"=>"required|string|max:255",
          "category_cn"=>"required|string|max:255",
          "category_az"=>"required|string|max:255",
          "category_code"=>"required|string|unique:categors,category_code|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            // Return first validation error as message and use 422 status
            return $this->sendError($validation->errors()->first(), ['errors' => $validation->errors()], 422);
        }
        $validated=$validation->validated();



        
        //file uploads

        $categor = Categor::create($validated);
        return $this->sendResponse($categor, "categor created succesfully");
    }

    public function show($id)
    {
        $categor = Categor::findOrFail($id);
        return $this->sendResponse($categor, "");
    }


    public function update(Request $request, $id)
    {
        
        $categor = Categor::findOrFail($id);
        $validationRules = [
            //for update

          
          "category_en"=>"required|string|max:255",
          "category_ru"=>"required|string|max:255",
          "category_cn"=>"required|string|max:255",
          "category_az"=>"required|string|max:255",
          // ignore current record's id for unique check
          "category_code"=>"required|string|unique:categors,category_code,".$id."|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            // Return first validation error as message and use 422 status
            return $this->sendError($validation->errors()->first(), ['errors' => $validation->errors()], 422);
        }
        $validated=$validation->validated();




        //file uploads update

        $categor->update($validated);
        return $this->sendResponse($categor, "categor updated successfully");
    }

    public function destroy($id)
    {
        $categor = Categor::findOrFail($id);
        $categor->delete();





        //delete files uploaded
        return $this->sendResponse(1, "categor deleted succesfully");
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
