<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Specificationheadname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SpecificationheadnameController extends BaseController
{
    protected $searchableColumns = ['headname', 'translate_az', 'translate_ru', 'translate_ch'];

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
        $query = Specificationheadname::orderBy($sortBy, $sortDir);
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
        $specificationheadname = $query->paginate($perPage); 
        $data = [
            "data" => $specificationheadname->toArray(), 
            'current_page' => $specificationheadname->currentPage(),
            'total_pages' => $specificationheadname->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_specificationheadnames(){
        $data = Specificationheadname::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Specificationheadname::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for specificationheadname');
    }


    public function store(Request $request)
    {
        $validationRules = [
          // headname must be unique
          "headname"=>"required|string|max:255|unique:specificationheadnames,headname",
          "translate_az"=>"nullable|string|max:255",
          "translate_ru"=>"nullable|string|max:255",
          "translate_ch"=>"nullable|string|max:255",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        try {
            $specificationheadname = Specificationheadname::create($validated);
            return $this->sendResponse($specificationheadname, "specificationheadname created succesfully");
        } catch (\Exception $e) {
            return $this->sendError("Error creating specificationheadname", ['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $specificationheadname = Specificationheadname::findOrFail($id);
        return $this->sendResponse($specificationheadname, "");
    }


    public function update(Request $request, $id)
    {
        $specificationheadname = Specificationheadname::findOrFail($id);
         $validationRules = [
             //for update

          // enforce uniqueness excluding current row
          "headname"=>"required|string|max:255|unique:specificationheadnames,headname,".$id,
          "translate_az"=>"nullable|string|max:255",
          "translate_ru"=>"nullable|string|max:255",
          "translate_ch"=>"nullable|string|max:255",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        try {
            $specificationheadname->update($validated);
            return $this->sendResponse($specificationheadname, "specificationheadname updated successfully");
        } catch (\Exception $e) {
            return $this->sendError("Error updating specificationheadname", ['message' => $e->getMessage()]);
        }
    }

    public function merge(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'source_ids' => 'required|array|min:1',
            'source_ids.*' => 'integer|exists:specificationheadnames,id',
            'target_id' => 'nullable|integer|exists:specificationheadnames,id',
            'target_name' => 'nullable|string|max:255',
        ]);
        if ($validator->fails()) {
            return $this->sendError('Invalid merge parameters', ['errors' => $validator->errors()]);
        }

        $sourceIds = array_values(array_unique($data['source_ids']));
        $targetId = $data['target_id'] ?? null;
        $targetName = trim((string)($data['target_name'] ?? ''));

        if (empty($targetId) && $targetName === '') {
            return $this->sendError('Missing target', ['errors' => ['target' => ['Provide target_id or target_name']]]);
        }

        try {
            return DB::transaction(function () use ($sourceIds, $targetId, $targetName) {
                // Resolve or create target
                if (!$targetId) {
                    $existing = Specificationheadname::where('headname', $targetName)->first();
                    if ($existing) {
                        $targetId = $existing->id;
                    } else {
                        $created = Specificationheadname::create(['headname' => $targetName]);
                        $targetId = $created->id;
                    }
                }

                // Remove target from source list if accidentally included
                $sources = array_values(array_diff($sourceIds, [$targetId]));
                if (empty($sources)) {
                    return $this->sendResponse(['updated' => 0, 'deleted' => 0, 'target_id' => $targetId], 'Nothing to merge');
                }

                // Repoint all product specs from sources -> target
                $updated = DB::table('productspecifications')
                    ->whereIn('headname_id', $sources)
                    ->update(['headname_id' => $targetId]);

                // Delete merged headnames
                $deleted = Specificationheadname::whereIn('id', $sources)->delete();

                return $this->sendResponse([
                    'updated' => $updated,
                    'deleted' => $deleted,
                    'target_id' => $targetId,
                ], 'Specification headnames merged successfully');
            });
        } catch (\Throwable $e) {
            return $this->sendError('Failed to merge headnames', ['message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $specificationheadname = Specificationheadname::findOrFail($id);
        // Protect if used by any product specification
        $inUse = DB::table('productspecifications')->where('headname_id', $id)->exists();
        if ($inUse) {
            return $this->sendError('Cannot delete: Header Name is in use by product specifications. Use Merge instead.', [
                'errors' => ['headname' => ['Header Name in use']]
            ]);
        }
        $specificationheadname->delete();
        return $this->sendResponse(1, "specificationheadname deleted succesfully");
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
