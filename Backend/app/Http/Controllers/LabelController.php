<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class LabelController extends BaseController
{
    protected $searchableColumns = ['brand', 'label_name', 'price', 'stock_qty', 'order_qty', 'labels_size_a', 'labels_size_b', 'image', 'design_file', 'additional_note', 'operation_mode'];

    public function index(Request $request)
    {
        $sortBy = 'labels.id';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
            if($sortBy === 'brand') {
                $sortBy = 'brandnames.brand_name';
            } else {
                $sortBy = 'labels.' . $sortBy;
            }
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Label::leftJoin('brandnames', 'labels.brand', '=', 'brandnames.id')
            ->select('labels.*', 'brandnames.brand_name as brand_name')
            ->orderBy($sortBy, $sortDir);
        if($filters){
            foreach ($filters as $filter) {
                $field = $filter['field'];
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                if($field === 'brand') {
                    $query->where('brandnames.brand_name', $operator, $searchTerm);
                } else {
                    $query->where('labels.' . $field, $operator, $searchTerm);
                }
            }
        }
        $label = $query->paginate($perPage);
        
        // Transform the data to replace brand ID with brand name
        $transformedData = $label->toArray();
        foreach($transformedData['data'] as &$item) {
            $item['brand'] = $item['brand_name'] ?? $item['brand'];
            unset($item['brand_name']);
        }
        
        $data = [
            "data" => $transformedData, 
            'current_page' => $label->currentPage(),
            'total_pages' => $label->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_labels(){
        $data = Label::leftJoin('brandnames', 'labels.brand', '=', 'brandnames.id')
            ->select('labels.*', 'brandnames.brand_name as brand_name')
            ->get()
            ->map(function($item) {
                $item->brand = $item->brand_name ?? $item->brand;
                unset($item->brand_name);
                return $item;
            });
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Label::leftJoin('brandnames', 'labels.brand', '=', 'brandnames.id')
            ->select('labels.*', 'brandnames.brand_name as brand_name')
            ->where(function ($query) use ($searchTerm) {
                foreach ($this->searchableColumns as $column) {
                    if($column === 'brand') {
                        $query->orWhere('brandnames.brand_name', 'like', "%$searchTerm%");
                    } else {
                        $query->orWhere('labels.' . $column, 'like', "%$searchTerm%");
                    }
                }
            })
            ->paginate(20);
            
        // Transform the data to replace brand ID with brand name
        $transformedResults = $results->toArray();
        foreach($transformedResults['data'] as &$item) {
            $item['brand'] = $item['brand_name'] ?? $item['brand'];
            unset($item['brand_name']);
        }
        $results->setCollection(collect($transformedResults['data']));
        
        return $this->sendResponse($results , 'search results for label');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "brand"=>"required|exists:brandnames,brand_name",
          "label_name"=>"required|string|max:255",
          "price"=>"required|numeric",
          "stock_qty"=>"required|numeric",
          "order_qty"=>"nullable|numeric",
          "labels_size_a"=>"nullable|numeric",
          "labels_size_b"=>"nullable|numeric",
          "image"=>"nullable|string",
          "design_file"=>"nullable|string",
          "additional_note"=>"nullable|string",
          "operation_mode"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Convert brand name to brand ID
        $brandname = \App\Models\Brandname::where('brand_name', $validated['brand'])->first();
        if($brandname) {
            $validated['brand'] = $brandname->id;
        }

        //file uploads

        $label = Label::create($validated);
        return $this->sendResponse($label, "label created succesfully");
    }

    public function show($id)
    {
        $label = Label::leftJoin('brandnames', 'labels.brand', '=', 'brandnames.id')
            ->select('labels.*', 'brandnames.brand_name as brand_name')
            ->where('labels.id', $id)
            ->first();
        if($label) {
            $label->brand = $label->brand_name ?? $label->brand;
            unset($label->brand_name);
        }
        return $this->sendResponse($label, "");
    }


    public function update(Request $request, $id)
    {
        $label = Label::findOrFail($id);
         $validationRules = [
            //for update

          
          "brand"=>"required|exists:brandnames,brand_name",
          "label_name"=>"required|string|max:255",
          "price"=>"required|numeric",
          "stock_qty"=>"required|numeric",
          "order_qty"=>"nullable|numeric",
          "labels_size_a"=>"nullable|numeric",
          "labels_size_b"=>"nullable|numeric",
          "image"=>"nullable|string",
          "design_file"=>"nullable|string",
          "additional_note"=>"nullable|string",
          "operation_mode"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Convert brand name to brand ID
        $brandname = \App\Models\Brandname::where('brand_name', $validated['brand'])->first();
        if($brandname) {
            $validated['brand'] = $brandname->id;
        }

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
