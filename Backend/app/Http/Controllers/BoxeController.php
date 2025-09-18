<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Boxe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class BoxeController extends BaseController
{
    protected $searchableColumns = ['brand', 'box_name', 'material', 'stock_qty', 'order_qty', 'price', 'size_a', 'size_b', 'size_c', 'volume', 'label', 'image', 'design_file', 'additional_note'];

    public function index(Request $request)
    {
        try {
            $sortBy = 'id';
            $sortDir = 'desc';
            if($request['sort']){
                $sortBy = $request['sort'][0]['field'];
                $sortDir = $request['sort'][0]['dir'];
            }
            $perPage = $request->query('size', 10); 
            $filters = $request['filter'];
            
            // Simplified query using Eloquent model
            $query = Boxe::query()->orderBy($sortBy, $sortDir);
                
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
        } catch (\Exception $e) {
            \Log::error('Boxe index error:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to load boxes: ' . $e->getMessage()], 500);
        }
    }

    public function all_boxes(){
        try {
            $data = Boxe::all();
            return $this->sendResponse($data, 1);
        } catch (\Exception $e) {
            \Log::error('Boxe all_boxes error:', ['error' => $e->getMessage()]);
            return $this->sendError('Failed to load all boxes', ['error' => $e->getMessage()]);
        }
    }


    public function search(Request $request, $search_term){
        try {
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
            })->limit(20)->get();
            
            // Format results for TomSelectSearch with additional fields for ProductInformation
            $formattedResults = $results->map(function ($item) {
                return [
                    'value' => $item->id,
                    'text' => $item->box_name . ' - ' . $item->brand . ' (' . $item->material . ')',
                    'id' => $item->id,
                    'box_name' => $item->box_name,
                    'brand' => $item->brand,
                    'material' => $item->material,
                    'size_a' => $item->size_a,
                    'size_b' => $item->size_b,
                    'size_c' => $item->size_c,
                    'volume' => $item->volume,
                    'stock_qty' => $item->stock_qty,
                    'order_qty' => $item->order_qty,
                    'price' => $item->price
                ];
            });
            
            return response()->json($formattedResults);
        } catch (\Exception $e) {
            \Log::error('Boxe search error:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Search failed'], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            // Debug: Log incoming request data
            \Log::info('Boxe creation request data:', $request->all());
            error_log('Boxe creation request received: ' . json_encode($request->all()));
            
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
              "image"=>"nullable|string",
              "design_file"=>"nullable|string",
              "additional_note"=>"nullable|string",
              "package_type"=>"nullable|in:3D,2D",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                \Log::error('Boxe validation failed:', $validation->errors()->toArray());
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();
            
            \Log::info('Validated data before mapping:', $validated);

            // Data is ready to save directly since frontend sends names
            $dataForDatabase = $validated;

            \Log::info('Final data for database save:', $dataForDatabase);

            $boxe = Boxe::create($dataForDatabase);
            \Log::info('Boxe created successfully:', $boxe->toArray());
            return $this->sendResponse($boxe, "boxe created succesfully");
        } catch (\Exception $e) {
            \Log::error('Boxe creation failed:', ['error' => $e->getMessage()]);
            return $this->sendError("Database Error", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $boxe = Boxe::findOrFail($id);
        return $this->sendResponse($boxe, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $boxe = Boxe::findOrFail($id);
             $validationRules = [
                //for update
              "brand"=>"nullable|string|max:255",
              "box_name"=>"required|string|unique:boxes,box_name,".$id."|max:255",
              "material"=>"nullable|string|max:255",
              "stock_qty"=>"nullable|numeric",
              "order_qty"=>"nullable|numeric",
              "price"=>"nullable|numeric",
              "size_a"=>"nullable|numeric",
              "size_b"=>"nullable|numeric",
              "size_c"=>"nullable|numeric",
              "volume"=>"nullable|numeric",
              "label"=>"nullable|string|max:255",
              "image"=>"nullable|string",
              "design_file"=>"nullable|string",
              "additional_note"=>"nullable|string",
              "package_type"=>"nullable|in:3D,2D",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Data is ready to save directly since frontend sends names
            $dataForDatabase = $validated;

            $boxe->update($dataForDatabase);
            return $this->sendResponse($boxe, "boxe updated successfully");
        } catch (\Exception $e) {
            \Log::error('Boxe update failed:', ['error' => $e->getMessage()]);
            return $this->sendError("Update failed", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $boxe = Boxe::findOrFail($id);
            
            // Delete associated files before deleting the record
            $this->deleteFile($boxe->image);
            $this->deleteFile($boxe->design_file);
            
            $boxe->delete();
            return $this->sendResponse(1, "boxe deleted successfully");
        } catch (\Exception $e) {
            \Log::error('Boxe deletion failed:', ['error' => $e->getMessage()]);
            return $this->sendError("Deletion failed", ['error' => $e->getMessage()]);
        }
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
