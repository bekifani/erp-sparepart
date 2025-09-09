<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Searchresult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SearchresultController extends BaseController
{
    protected $searchableColumns = ['user_id', 'customer_id', 'query_text', 'entity_type', 'entity_id'];

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
        $query = Searchresult::orderBy($sortBy, $sortDir);
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
        $searchresult = $query->paginate($perPage); 
        $data = [
            "data" => $searchresult->toArray(), 
            'current_page' => $searchresult->currentPage(),
            'total_pages' => $searchresult->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_searchresults(){
        $data = Searchresult::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Searchresult::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for searchresult');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "user_id"=>"required|exists:users,id",
          "customer_id"=>"required|exists:customers,id",
          "query_text"=>"required|string|max:255",
          "entity_type"=>"nullable|string|max:255",
          "entity_id"=>"nullable|integer",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $searchresult = Searchresult::create($validated);
        return $this->sendResponse($searchresult, "searchresult created succesfully");
    }

    public function show($id)
    {
        $searchresult = Searchresult::findOrFail($id);
        return $this->sendResponse($searchresult, "");
    }


    public function update(Request $request, $id)
    {
        $searchresult = Searchresult::findOrFail($id);
         $validationRules = [
            //for update

          
          "user_id"=>"required|exists:users,id",
          "customer_id"=>"required|exists:customers,id",
          "query_text"=>"required|string|max:255",
          "entity_type"=>"nullable|string|max:255",
          "entity_id"=>"nullable|integer",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $searchresult->update($validated);
        return $this->sendResponse($searchresult, "searchresult updated successfully");
    }

    public function destroy($id)
    {
        $searchresult = Searchresult::findOrFail($id);
        $searchresult->delete();





        //delete files uploaded
        return $this->sendResponse(1, "searchresult deleted succesfully");
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
