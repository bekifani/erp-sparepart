<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class LabelController extends BaseController
{
    protected $searchableColumns = ['brand', 'label_name', 'price', 'stock_qty', 'order_qty', 'labels_size_a', 'labels_size_b', 'image', 'design_file', 'additional_note', 'operation_mode', 'is_factory_supplied'];

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
        $query = Label::orderBy($sortBy, $sortDir);
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
        $label = $query->paginate($perPage); 
        $data = [
            "data" => $label->toArray(), 
            'current_page' => $label->currentPage(),
            'total_pages' => $label->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_labels(){
        $data = Label::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Label::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->select('id', 'brand', 'label_name', 'price', 'stock_qty', 'order_qty', 'labels_size_a', 'labels_size_b', 'image', 'design_file', 'additional_note', 'operation_mode', 'is_factory_supplied')
        ->paginate(20);
        return $this->sendResponse($results , 'search results for label');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "brand"=>"required|string|max:255",
          "label_name"=>"required|string|max:255",
          "price"=>"required|numeric",
          "stock_qty"=>"required|numeric",
          "order_qty"=>"nullable|numeric",
          "labels_size_a"=>"nullable|numeric",
          "labels_size_b"=>"nullable|numeric",
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

        $label = Label::create($validated);
        return $this->sendResponse($label, "label created succesfully");
    }

    public function show($id)
    {
        $label = Label::findOrFail($id);
        return $this->sendResponse($label, "");
    }


    public function update(Request $request, $id)
    {
        $label = Label::findOrFail($id);
         $validationRules = [
            //for update

          
          "brand"=>"required|string|max:255",
          "label_name"=>"required|string|max:255",
          "price"=>"required|numeric",
          "stock_qty"=>"required|numeric",
          "order_qty"=>"nullable|numeric",
          "labels_size_a"=>"nullable|numeric",
          "labels_size_b"=>"nullable|numeric",
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

        $label->update($validated);
        return $this->sendResponse($label, "label updated successfully");
    }

    public function destroy($id)
    {
        $label = Label::findOrFail($id);
        $label->delete();



$this->deleteFile($label->image);$this->deleteFile($label->design_file);

        //delete files uploaded
        return $this->sendResponse(1, "label deleted succesfully");
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
