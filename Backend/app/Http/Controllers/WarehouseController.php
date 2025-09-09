<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class WarehouseController extends BaseController
{
    protected $searchableColumns = ['warehouse_name', 'location', 'capacity', 'remark', 'is_active'];

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
        $query = Warehouse::orderBy($sortBy, $sortDir);
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
        $warehouse = $query->paginate($perPage); 
        $data = [
            "data" => $warehouse->toArray(), 
            'current_page' => $warehouse->currentPage(),
            'total_pages' => $warehouse->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_warehouses(){
        $data = Warehouse::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Warehouse::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for warehouse');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "warehouse_name"=>"required|string|max:255",
          "location"=>"required|string|max:255",
          "capacity"=>"nullable|integer|min:1",
          "remark"=>"nullable|min:2",
          "is_active"=>"required|boolean",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $warehouse = Warehouse::create($validated);
        return $this->sendResponse($warehouse, "warehouse created succesfully");
    }

    public function show($id)
    {
        $warehouse = Warehouse::findOrFail($id);
        return $this->sendResponse($warehouse, "");
    }


    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::findOrFail($id);
         $validationRules = [
            //for update

          
          "warehouse_name"=>"required|string|max:255",
          "location"=>"required|string|max:255",
          "capacity"=>"nullable|integer|min:1",
          "remark"=>"nullable|min:2",
          "is_active"=>"required|boolean",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $warehouse->update($validated);
        return $this->sendResponse($warehouse, "warehouse updated successfully");
    }

    public function destroy($id)
    {
        $warehouse = Warehouse::findOrFail($id);
        $warehouse->delete();





        //delete files uploaded
        return $this->sendResponse(1, "warehouse deleted succesfully");
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
