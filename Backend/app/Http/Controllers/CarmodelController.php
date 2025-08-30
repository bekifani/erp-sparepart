<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Carmodel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CarmodelController extends BaseController
{
    protected $searchableColumns = ['car_model', 'additional_note', 'product_qty'];

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
        $query = Carmodel::orderBy($sortBy, $sortDir);
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
        $carmodel = $query->paginate($perPage); 
        $data = [
            "data" => $carmodel->toArray(), 
            'current_page' => $carmodel->currentPage(),
            'total_pages' => $carmodel->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_carmodels(){
        $data = Carmodel::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Carmodel::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for carmodel');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "car_model"=>"required|string|max:255",
          "additional_note"=>"nullable|string",
          "product_qty"=>"nullable|numeric",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $carmodel = Carmodel::create($validated);
        return $this->sendResponse($carmodel, "carmodel created succesfully");
    }

    public function show($id)
    {
        $carmodel = Carmodel::findOrFail($id);
        return $this->sendResponse($carmodel, "");
    }


    public function update(Request $request, $id)
    {
        $carmodel = Carmodel::findOrFail($id);
         $validationRules = [
            //for update

          
          "car_model"=>"required|string|max:255",
          "additional_note"=>"nullable|string",
          "product_qty"=>"nullable|numeric",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $carmodel->update($validated);
        return $this->sendResponse($carmodel, "carmodel updated successfully");
    }

    public function destroy($id)
    {
        $carmodel = Carmodel::findOrFail($id);
        $carmodel->delete();





        //delete files uploaded
        return $this->sendResponse(1, "carmodel deleted succesfully");
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
