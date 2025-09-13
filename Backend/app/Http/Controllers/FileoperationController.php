<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Fileoperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class FileoperationController extends BaseController
{
    protected $searchableColumns = ['user_id', 'product_id', 'file_path', 'operation_type', 'status'];

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
        $query = Fileoperation::orderBy($sortBy, $sortDir);
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
        $fileoperation = $query->paginate($perPage); 
        $data = [
            "data" => $fileoperation->toArray(), 
            'current_page' => $fileoperation->currentPage(),
            'total_pages' => $fileoperation->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_fileoperations(){
        $data = Fileoperation::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Fileoperation::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for fileoperation');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              "user_id"=>"required|exists:users,id",
              "product_id"=>"required|exists:products,id",
              "file_path"=>"required|string|max:255",
              "operation_type"=>"required|string|max:255",
              "status"=>"nullable|string",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Set default values programmatically
            if (!isset($validated['status'])) {
                $validated['status'] = 'success';
            }

            $fileoperation = Fileoperation::create($validated);
            return $this->sendResponse($fileoperation, "fileoperation created succesfully");
        } catch (\Exception $e) {
            Log::error('Error creating fileoperation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the fileoperation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $fileoperation = Fileoperation::findOrFail($id);
        return $this->sendResponse($fileoperation, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $fileoperation = Fileoperation::findOrFail($id);
            $validationRules = [
              "user_id"=>"required|exists:users,id",
              "product_id"=>"required|exists:products,id",
              "file_path"=>"required|string|max:255",
              "operation_type"=>"required|string|max:255",
              "status"=>"nullable|string",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Set default values programmatically
            if (!isset($validated['status'])) {
                $validated['status'] = 'success';
            }

            $fileoperation->update($validated);
            return $this->sendResponse($fileoperation, "fileoperation updated successfully");
        } catch (\Exception $e) {
            Log::error('Error updating fileoperation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the fileoperation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $fileoperation = Fileoperation::findOrFail($id);
            $fileoperation->delete();

            //delete files uploaded
            return $this->sendResponse(1, "fileoperation deleted succesfully");
        } catch (\Exception $e) {
            Log::error('Error deleting fileoperation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the fileoperation.',
                'error' => $e->getMessage()
            ], 500);
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
