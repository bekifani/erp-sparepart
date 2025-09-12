<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Packinglistboxitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class PackinglistboxitemController extends BaseController
{
    protected $searchableColumns = ['packing_list_box_id', 'product_id', 'qty', 'description'];

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
        $query = Packinglistboxitem::orderBy($sortBy, $sortDir);
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
        $packinglistboxitem = $query->paginate($perPage); 
        $data = [
            "data" => $packinglistboxitem->toArray(), 
            'current_page' => $packinglistboxitem->currentPage(),
            'total_pages' => $packinglistboxitem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_packinglistboxitems(){
        $data = Packinglistboxitem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Packinglistboxitem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for packinglistboxitem');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              
              "packing_list_box_id"=>"required|exists:packinglistboxes,id",
              "product_id"=>"required|exists:products,id",
              "qty"=>"required|integer",
              "description"=>"nullable|string",
              

            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();



            
            //file uploads

            $packinglistboxitem = Packinglistboxitem::create($validated);
            return $this->sendResponse($packinglistboxitem, "packinglistboxitem created succesfully");
        } catch (\Exception $e) {
            Log::error('PackinglistboxitemController store error: ' . $e->getMessage());
            return $this->sendError("Error creating packinglistboxitem", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $packinglistboxitem = Packinglistboxitem::findOrFail($id);
        return $this->sendResponse($packinglistboxitem, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $packinglistboxitem = Packinglistboxitem::findOrFail($id);
             $validationRules = [
                //for update

              
              "packing_list_box_id"=>"required|exists:packinglistboxes,id",
              "product_id"=>"required|exists:products,id",
              "qty"=>"required|integer",
              "description"=>"nullable|string",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();




            //file uploads update

            $packinglistboxitem->update($validated);
            return $this->sendResponse($packinglistboxitem, "packinglistboxitem updated successfully");
        } catch (\Exception $e) {
            Log::error('PackinglistboxitemController update error: ' . $e->getMessage());
            return $this->sendError("Error updating packinglistboxitem", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $packinglistboxitem = Packinglistboxitem::findOrFail($id);
        $packinglistboxitem->delete();





        //delete files uploaded
        return $this->sendResponse(1, "packinglistboxitem deleted succesfully");
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
