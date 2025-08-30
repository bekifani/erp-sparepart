<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Boxe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class BoxeController extends BaseController
{
    protected $searchableColumns = ['brand', 'box_name', 'material', 'stock_qty', 'order_qty', 'price', 'size_a', 'size_b', 'size_c', 'volume', 'label', 'image', 'design_file', 'additional_note', 'operation_mode', 'is_factory_supplied'];

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
        $query = Boxe::orderBy($sortBy, $sortDir);
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
        $boxe = $query->paginate($perPage); 
        $data = [
            "data" => $boxe->toArray(), 
            'current_page' => $boxe->currentPage(),
            'total_pages' => $boxe->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_boxes(){
        $data = Boxe::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Boxe::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for boxe');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "brand"=>"nullable|string|max:255",
          "box_name"=>"required|string|unique:boxes,box_name|max:255",
          "material"=>"nullable|string|max:255",
          "stock_qty"=>"nullable|numeric",
          "order_qty"=>"nullable|numeric",
          "price"=>"nullable|numeric",
          "size_a"=>"nullable|numeric",
          "size_b"=>"nullable|numeric",
          "size_c"=>"nullable|numeric",
          "volume"=>"nullable|numeric",
          "label"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "design_"=>"nullable|",
          "additional_note"=>"nullable|string",
          "operation_mode"=>"nullable|string|max:255",
          "is_factory_supplied"=>"required|boolean",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $boxe = Boxe::create($validated);
        return $this->sendResponse($boxe, "boxe created succesfully");
    }

    public function show($id)
    {
        $boxe = Boxe::findOrFail($id);
        return $this->sendResponse($boxe, "");
    }


    public function update(Request $request, $id)
    {
        $boxe = Boxe::findOrFail($id);
         $validationRules = [
            //for update

          
          "brand"=>"nullable|string|max:255",
          "box_name"=>"required|string|unique:boxes,box_name|max:255",
          "material"=>"nullable|string|max:255",
          "stock_qty"=>"nullable|numeric",
          "order_qty"=>"nullable|numeric",
          "price"=>"nullable|numeric",
          "size_a"=>"nullable|numeric",
          "size_b"=>"nullable|numeric",
          "size_c"=>"nullable|numeric",
          "volume"=>"nullable|numeric",
          "label"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "design_"=>"nullable|",
          "additional_note"=>"nullable|string",
          "operation_mode"=>"nullable|string|max:255",
          "is_factory_supplied"=>"required|boolean",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $boxe->update($validated);
        return $this->sendResponse($boxe, "boxe updated successfully");
    }

    public function destroy($id)
    {
        $boxe = Boxe::findOrFail($id);
        $boxe->delete();



$this->deleteFile($boxe->image);$this->deleteFile($boxe->design_file);

        //delete files uploaded
        return $this->sendResponse(1, "boxe deleted succesfully");
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
