<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierpricingrule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierpricingruleController extends BaseController
{
    protected $searchableColumns = ['supplier_id', 'adjustment_percent', 'adjustment_type', 'scope', 'active', 'valid_from', 'valid_to'];

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
        $query = Supplierpricingrule::orderBy($sortBy, $sortDir);
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
        $supplierpricingrule = $query->paginate($perPage); 
        $data = [
            "data" => $supplierpricingrule->toArray(), 
            'current_page' => $supplierpricingrule->currentPage(),
            'total_pages' => $supplierpricingrule->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierpricingrules(){
        $data = Supplierpricingrule::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierpricingrule::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierpricingrule');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "supplier_id"=>"required|exists:suppliers,id",
          "adjustment_percent"=>"required|numeric",
          "adjustment_type"=>"required|in:markup,discount",
          "scope"=>"required|in:all,selected|default:all",
          "active"=>"required|boolean|default:true",
          "valid_from"=>"nullable|date",
          "valid_to"=>"nullable|date",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplierpricingrule = Supplierpricingrule::create($validated);
        return $this->sendResponse($supplierpricingrule, "supplierpricingrule created succesfully");
    }

    public function show($id)
    {
        $supplierpricingrule = Supplierpricingrule::findOrFail($id);
        return $this->sendResponse($supplierpricingrule, "");
    }


    public function update(Request $request, $id)
    {
        $supplierpricingrule = Supplierpricingrule::findOrFail($id);
         $validationRules = [
            //for update

          
          "supplier_id"=>"required|exists:suppliers,id",
          "adjustment_percent"=>"required|numeric",
          "adjustment_type"=>"required|in:markup,discount",
          "scope"=>"required|in:all,selected|default:all",
          "active"=>"required|boolean|default:true",
          "valid_from"=>"nullable|date",
          "valid_to"=>"nullable|date",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplierpricingrule->update($validated);
        return $this->sendResponse($supplierpricingrule, "supplierpricingrule updated successfully");
    }

    public function destroy($id)
    {
        $supplierpricingrule = Supplierpricingrule::findOrFail($id);
        $supplierpricingrule->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplierpricingrule deleted succesfully");
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
