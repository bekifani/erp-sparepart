<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productrule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductruleController extends BaseController
{
    protected $searchableColumns = ['customer_id', 'product_id', 'fixed_price', 'adjustment_percent', 'qty', 'note'];

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
        $query = Productrule::orderBy($sortBy, $sortDir);
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
        $productrule = $query->paginate($perPage); 
        $data = [
            "data" => $productrule->toArray(), 
            'current_page' => $productrule->currentPage(),
            'total_pages' => $productrule->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productrules(){
        $data = Productrule::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productrule::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for productrule');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "customer_id"=>"required|exists:customers,id",
          "product_id"=>"required|exists:products,id",
          "fixed_price"=>"nullable|numeric",
          "adjustment_percent"=>"nullable|numeric",
          "qty"=>"required|integer",
          "note"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $productrule = Productrule::create($validated);
        return $this->sendResponse($productrule, "productrule created succesfully");
    }

    public function show($id)
    {
        $productrule = Productrule::findOrFail($id);
        return $this->sendResponse($productrule, "");
    }


    public function update(Request $request, $id)
    {
        $productrule = Productrule::findOrFail($id);
         $validationRules = [
            //for update

          
          "customer_id"=>"required|exists:customers,id",
          "product_id"=>"required|exists:products,id",
          "fixed_price"=>"nullable|numeric",
          "adjustment_percent"=>"nullable|numeric",
          "qty"=>"required|integer",
          "note"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $productrule->update($validated);
        return $this->sendResponse($productrule, "productrule updated successfully");
    }

    public function destroy($id)
    {
        $productrule = Productrule::findOrFail($id);
        $productrule->delete();





        //delete files uploaded
        return $this->sendResponse(1, "productrule deleted succesfully");
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
