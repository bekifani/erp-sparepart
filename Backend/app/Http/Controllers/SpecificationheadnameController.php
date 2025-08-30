<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Specificationheadname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SpecificationheadnameController extends BaseController
{
    protected $searchableColumns = ['headname', 'translate_az', 'translate_ru', 'translate_ch'];

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
        $query = Specificationheadname::orderBy($sortBy, $sortDir);
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
        $specificationheadname = $query->paginate($perPage); 
        $data = [
            "data" => $specificationheadname->toArray(), 
            'current_page' => $specificationheadname->currentPage(),
            'total_pages' => $specificationheadname->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_specificationheadnames(){
        $data = Specificationheadname::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Specificationheadname::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for specificationheadname');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "headname"=>"nullable|string|max:255",
          "translate_az"=>"nullable|string|max:255",
          "translate_ru"=>"nullable|string|max:255",
          "translate_ch"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $specificationheadname = Specificationheadname::create($validated);
        return $this->sendResponse($specificationheadname, "specificationheadname created succesfully");
    }

    public function show($id)
    {
        $specificationheadname = Specificationheadname::findOrFail($id);
        return $this->sendResponse($specificationheadname, "");
    }


    public function update(Request $request, $id)
    {
        $specificationheadname = Specificationheadname::findOrFail($id);
         $validationRules = [
            //for update

          
          "headname"=>"nullable|string|max:255",
          "translate_az"=>"nullable|string|max:255",
          "translate_ru"=>"nullable|string|max:255",
          "translate_ch"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $specificationheadname->update($validated);
        return $this->sendResponse($specificationheadname, "specificationheadname updated successfully");
    }

    public function destroy($id)
    {
        $specificationheadname = Specificationheadname::findOrFail($id);
        $specificationheadname->delete();





        //delete files uploaded
        return $this->sendResponse(1, "specificationheadname deleted succesfully");
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
