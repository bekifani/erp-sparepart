<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Basketfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class BasketfileController extends BaseController
{
    protected $searchableColumns = ['file'];

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
        $query = Basketfile::orderBy($sortBy, $sortDir);
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
        $basketfile = $query->paginate($perPage); 
        $data = [
            "data" => $basketfile->toArray(), 
            'current_page' => $basketfile->currentPage(),
            'total_pages' => $basketfile->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_basketfiles(){
        $data = Basketfile::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Basketfile::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for basketfile');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              "file"=>"required|string|max:255",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            $basketfile = Basketfile::create($validated);
            return $this->sendResponse($basketfile, "basketfile created succesfully");
        } catch (\Throwable $e) {
            Log::error('Basketfile@store failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to create basketfile', ['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $basketfile = Basketfile::findOrFail($id);
        return $this->sendResponse($basketfile, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $basketfile = Basketfile::findOrFail($id);
             $validationRules = [
                "file"=>"required|string|max:255",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            $basketfile->update($validated);
            return $this->sendResponse($basketfile, "basketfile updated successfully");
        } catch (\Throwable $e) {
            Log::error('Basketfile@update failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to update basketfile', ['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $basketfile = Basketfile::findOrFail($id);
            $filePath = $basketfile->file;
            $basketfile->delete();

            if($filePath) {
                $this->deleteFile($filePath);
            }

            return $this->sendResponse(1, "basketfile deleted succesfully");
        } catch (\Throwable $e) {
            Log::error('Basketfile@destroy failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to delete basketfile', ['message' => $e->getMessage()], 500);
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
