<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierproduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierproductController extends BaseController
{
    protected $searchableColumns = ['supplier_id', 'product_id', 'is_primary'];

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
        $query = Supplierproduct::orderBy($sortBy, $sortDir);
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
        $supplierproduct = $query->paginate($perPage); 
        $data = [
            "data" => $supplierproduct->toArray(), 
            'current_page' => $supplierproduct->currentPage(),
            'total_pages' => $supplierproduct->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierproducts(){
        $data = Supplierproduct::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierproduct::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierproduct');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "supplier_id"=>"required|exists:suppliers,id",
          "product_id"=>"required|exists:products,id",
          "is_primary"=>"nullable|boolean|default:false",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplierproduct = Supplierproduct::create($validated);
        return $this->sendResponse($supplierproduct, "supplierproduct created succesfully");
    }

    public function show($id)
    {
        $supplierproduct = Supplierproduct::findOrFail($id);
        return $this->sendResponse($supplierproduct, "");
    }


    public function update(Request $request, $id)
    {
        $supplierproduct = Supplierproduct::findOrFail($id);
         $validationRules = [
            //for update

          
          "supplier_id"=>"required|exists:suppliers,id",
          "product_id"=>"required|exists:products,id",
          "is_primary"=>"nullable|boolean|default:false",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplierproduct->update($validated);
        return $this->sendResponse($supplierproduct, "supplierproduct updated successfully");
    }

    public function destroy($id)
    {
        $supplierproduct = Supplierproduct::findOrFail($id);
        $supplierproduct->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplierproduct deleted succesfully");
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
