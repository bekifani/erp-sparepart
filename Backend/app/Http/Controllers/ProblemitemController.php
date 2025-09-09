<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Problemitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProblemitemController extends BaseController
{
    protected $searchableColumns = ['problem_id', 'product_id', 'supplier_code', 'brand', 'brand_code', 'oe_code', 'description', 'qty', 'box_name', 'purchase_price', 'customer_price', 'problem_type', 'solution_type'];

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
        $query = Problemitem::orderBy($sortBy, $sortDir);
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
        $problemitem = $query->paginate($perPage); 
        $data = [
            "data" => $problemitem->toArray(), 
            'current_page' => $problemitem->currentPage(),
            'total_pages' => $problemitem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_problemitems(){
        $data = Problemitem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Problemitem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for problemitem');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "problem_id"=>"required|exists:problems,id",
          "product_id"=>"required|exists:products,id",
          "supplier_code"=>"nullable|string|max:255",
          "brand"=>"nullable|string|max:255",
          "brand_code"=>"nullable|string|max:255",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"nullable|string",
          "qty"=>"required|integer",
          "box_name"=>"nullable|string|max:255",
          "purchase_price"=>"nullable|numeric",
          "customer_price"=>"nullable|numeric",
          "problem_type"=>"required|string|max:255",
          "solution_type"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $problemitem = Problemitem::create($validated);
        return $this->sendResponse($problemitem, "problemitem created succesfully");
    }

    public function show($id)
    {
        $problemitem = Problemitem::findOrFail($id);
        return $this->sendResponse($problemitem, "");
    }


    public function update(Request $request, $id)
    {
        $problemitem = Problemitem::findOrFail($id);
         $validationRules = [
            //for update

          
          "problem_id"=>"required|exists:problems,id",
          "product_id"=>"required|exists:products,id",
          "supplier_code"=>"nullable|string|max:255",
          "brand"=>"nullable|string|max:255",
          "brand_code"=>"nullable|string|max:255",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"nullable|string",
          "qty"=>"required|integer",
          "box_name"=>"nullable|string|max:255",
          "purchase_price"=>"nullable|numeric",
          "customer_price"=>"nullable|numeric",
          "problem_type"=>"required|string|max:255",
          "solution_type"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $problemitem->update($validated);
        return $this->sendResponse($problemitem, "problemitem updated successfully");
    }

    public function destroy($id)
    {
        $problemitem = Problemitem::findOrFail($id);
        $problemitem->delete();





        //delete files uploaded
        return $this->sendResponse(1, "problemitem deleted succesfully");
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
