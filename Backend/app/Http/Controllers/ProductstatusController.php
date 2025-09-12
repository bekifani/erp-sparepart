<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productstatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductstatusController extends BaseController
{
    protected $searchableColumns = ['status_key', 'status_name_en', 'status_name_ch', 'status_name_az', 'description'];

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
        $query = Productstatus::orderBy($sortBy, $sortDir);
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
        $productstatus = $query->paginate($perPage); 
        $data = [
            "data" => $productstatus->toArray(), 
            'current_page' => $productstatus->currentPage(),
            'total_pages' => $productstatus->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productstatuss(){
        $data = Productstatus::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productstatus::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for productstatus');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "status_key"=>"required|string|unique:productstatuses,status_key|max:255",
          "status_name_en"=>"required|string|max:255",
          "status_name_ch"=>"nullable|string|max:255",
          "status_name_az"=>"nullable|string|max:255",
          "description"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $productstatus = Productstatus::create($validated);
        return $this->sendResponse($productstatus, "productstatus created succesfully");
    }

    public function show($id)
    {
        $productstatus = Productstatus::findOrFail($id);
        return $this->sendResponse($productstatus, "");
    }


    public function update(Request $request, $id)
    {
        $productstatus = Productstatus::findOrFail($id);
         $validationRules = [
            //for update

          
          "status_key"=>"required|string|unique:productstatuses,status_key," . $id . "|max:255",
          "status_name_en"=>"required|string|max:255",
          "status_name_ch"=>"nullable|string|max:255",
          "status_name_az"=>"nullable|string|max:255",
          "description"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $productstatus->update($validated);
        return $this->sendResponse($productstatus, "productstatus updated successfully");
    }

    public function destroy($id)
    {
        $productstatus = Productstatus::findOrFail($id);
        $productstatus->delete();





        //delete files uploaded
        return $this->sendResponse(1, "productstatus deleted succesfully");
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
