<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Accounttype;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class AccounttypeController extends BaseController
{
    protected $searchableColumns = ['name', 'name_ch', 'name_az', 'status'];

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
        $query = Accounttype::orderBy($sortBy, $sortDir);
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
        $accounttype = $query->paginate($perPage); 
        $data = [
            "data" => $accounttype->toArray(), 
            'current_page' => $accounttype->currentPage(),
            'total_pages' => $accounttype->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_accounttypes(){
        $data = Accounttype::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Accounttype::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for accounttype');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "name"=>"required|string|max:255",
          "name_ch"=>"required|string|max:255",
          "name_az"=>"required|string|max:255",
          "status"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $accounttype = Accounttype::create($validated);
        return $this->sendResponse($accounttype, "accounttype created succesfully");
    }

    public function show($id)
    {
        $accounttype = Accounttype::findOrFail($id);
        return $this->sendResponse($accounttype, "");
    }


    public function update(Request $request, $id)
    {
        $accounttype = Accounttype::findOrFail($id);
         $validationRules = [
            //for update

          
          "name"=>"required|string|max:255",
          "name_ch"=>"required|string|max:255",
          "name_az"=>"required|string|max:255",
          "status"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $accounttype->update($validated);
        return $this->sendResponse($accounttype, "accounttype updated successfully");
    }

    public function destroy($id)
    {
        $accounttype = Accounttype::findOrFail($id);
        $accounttype->delete();





        //delete files uploaded
        return $this->sendResponse(1, "accounttype deleted succesfully");
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
