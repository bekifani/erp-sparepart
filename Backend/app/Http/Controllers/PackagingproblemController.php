<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Packagingproblem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class PackagingproblemController extends BaseController
{
    protected $searchableColumns = ['package_id', 'problems', 'additional_note'];

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
        $query = Packagingproblem::orderBy($sortBy, $sortDir);
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
        $packagingproblem = $query->paginate($perPage); 
        $data = [
            "data" => $packagingproblem->toArray(), 
            'current_page' => $packagingproblem->currentPage(),
            'total_pages' => $packagingproblem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_packagingproblems(){
        $data = Packagingproblem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Packagingproblem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for packagingproblem');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "package_id"=>"required|exists:packagins,id",
          "problems"=>"required|string",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $packagingproblem = Packagingproblem::create($validated);
        return $this->sendResponse($packagingproblem, "packagingproblem created succesfully");
    }

    public function show($id)
    {
        $packagingproblem = Packagingproblem::findOrFail($id);
        return $this->sendResponse($packagingproblem, "");
    }


    public function update(Request $request, $id)
    {
        $packagingproblem = Packagingproblem::findOrFail($id);
         $validationRules = [
            //for update

          
          "package_id"=>"required|exists:packagins,id",
          "problems"=>"required|string",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $packagingproblem->update($validated);
        return $this->sendResponse($packagingproblem, "packagingproblem updated successfully");
    }

    public function destroy($id)
    {
        $packagingproblem = Packagingproblem::findOrFail($id);
        $packagingproblem->delete();





        //delete files uploaded
        return $this->sendResponse(1, "packagingproblem deleted succesfully");
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
