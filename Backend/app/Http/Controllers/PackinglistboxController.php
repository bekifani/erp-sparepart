<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Packinglistbox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class PackinglistboxController extends BaseController
{
    protected $searchableColumns = ['packing_list_id', 'box_no', 'net_weight', 'gross_weight', 'volume', 'number_of_products', 'additional_note'];

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
        $query = Packinglistbox::orderBy($sortBy, $sortDir);
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
        $packinglistbox = $query->paginate($perPage); 
        $data = [
            "data" => $packinglistbox->toArray(), 
            'current_page' => $packinglistbox->currentPage(),
            'total_pages' => $packinglistbox->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_packinglistboxs(){
        $data = Packinglistbox::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Packinglistbox::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for packinglistbox');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              
              "packing_list_id"=>"required|exists:packinglists,id",
              "box_no"=>"required|string|max:255",
              "net_weight"=>"nullable|numeric",
              "gross_weight"=>"nullable|numeric",
              "volume"=>"nullable|numeric",
              "number_of_products"=>"nullable|integer",
              "additional_note"=>"nullable|string",
              

            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();



            
            //file uploads

            $packinglistbox = Packinglistbox::create($validated);
            return $this->sendResponse($packinglistbox, "packinglistbox created succesfully");
        } catch (\Exception $e) {
            Log::error('PackinglistboxController store error: ' . $e->getMessage());
            return $this->sendError("Error creating packinglistbox", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $packinglistbox = Packinglistbox::findOrFail($id);
        return $this->sendResponse($packinglistbox, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $packinglistbox = Packinglistbox::findOrFail($id);
             $validationRules = [
                //for update

              
              "packing_list_id"=>"required|exists:packinglists,id",
              "box_no"=>"required|string|max:255",
              "net_weight"=>"nullable|numeric",
              "gross_weight"=>"nullable|numeric",
              "volume"=>"nullable|numeric",
              "number_of_products"=>"nullable|integer",
              "additional_note"=>"nullable|string",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();




            //file uploads update

            $packinglistbox->update($validated);
            return $this->sendResponse($packinglistbox, "packinglistbox updated successfully");
        } catch (\Exception $e) {
            Log::error('PackinglistboxController update error: ' . $e->getMessage());
            return $this->sendError("Error updating packinglistbox", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $packinglistbox = Packinglistbox::findOrFail($id);
        $packinglistbox->delete();





        //delete files uploaded
        return $this->sendResponse(1, "packinglistbox deleted succesfully");
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
