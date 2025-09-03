<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class UnitController extends BaseController
{
    protected $searchableColumns = ['name', 'base_unit', 'base_value'];

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
        $query = Unit::orderBy($sortBy, $sortDir);
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
        $unit = $query->paginate($perPage); 
        $data = [
            "data" => $unit->toArray(), 
            'current_page' => $unit->currentPage(),
            'total_pages' => $unit->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_units(){
        $data = Unit::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Unit::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->select('id', 'name as unit_name', 'base_unit', 'base_value')
        ->paginate(20);
        return $this->sendResponse($results , 'search results for unit');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "name"=>"required|string|max:255",
          "base_unit"=>"required|string|max:255",
          "base_value"=>"required|numeric",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $unit = Unit::create($validated);
        return $this->sendResponse($unit, "unit created succesfully");
    }

    public function show($id)
    {
        $unit = Unit::findOrFail($id);
        return $this->sendResponse($unit, "");
    }


    public function update(Request $request, $id)
    {
        $unit = Unit::findOrFail($id);
         $validationRules = [
            //for update

          
          "name"=>"required|string|max:255",
          "base_unit"=>"required|string|max:255",
          "base_value"=>"required|numeric",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $unit->update($validated);
        return $this->sendResponse($unit, "unit updated successfully");
    }

    public function destroy($id)
    {
        $unit = Unit::findOrFail($id);
        $unit->delete();





        //delete files uploaded
        return $this->sendResponse(1, "unit deleted succesfully");
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
