<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Unit;
use App\Models\ProductInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UnitController extends BaseController
{
    protected $searchableColumns = ['name', 'base_unit', 'base_value'];

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
        $query = Unit::orderBy($sortBy, $sortDir);
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
        $unit = $query->paginate($perPage); 
        $data = [
            "data" => $unit->toArray(), 
            'current_page' => $unit->currentPage(),
            'total_pages' => $unit->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_units(){
        $data = Unit::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Unit::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->select('id', 'name as unit_name', 'base_unit', 'base_value')
        ->paginate(20);
        return $this->sendResponse($results , 'search results for unit');
    }


    public function store(Request $request)
    {
        $validationRules = [
          "name"=>"required|string|max:255",
          "base_unit"=>"required|string|max:255",
          "base_value"=>"required|numeric",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Prevent duplicate unit names on create
        $exists = Unit::where('name', $validated['name'])->first();
        if ($exists) {
            return $this->sendError("Unit name already exists", ['errors' => ['name' => ['The unit name has already been taken.']]]);
        }

        $unit = Unit::create($validated);
        return $this->sendResponse($unit, "unit created succesfully");
    }

    public function show($id)
    {
        $unit = Unit::findOrFail($id);
        return $this->sendResponse($unit, "");
    }


    public function update(Request $request, $id)
    {
        $unit = Unit::findOrFail($id);
         $validationRules = [
          "name"=>"required|string|max:255",
          "base_unit"=>"required|string|max:255",
          "base_value"=>"required|numeric",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Merge-on-rename: if new name matches another existing unit, reassign usages and delete this unit
        $target = Unit::where('name', $validated['name'])->where('id', '!=', $unit->id)->first();
        if ($target) {
            DB::transaction(function () use ($unit, $target) {
                // Reassign all product informations to target unit
                ProductInformation::where('unit_id', $unit->id)->update(['unit_id' => $target->id]);
                // Delete current unit
                $unit->delete();
            });
            return $this->sendResponse($target, "unit merged into existing '{$target->name}' and deleted old entry");
        }

        // Normal update
        $unit->update($validated);
        return $this->sendResponse($unit, "unit updated successfully");
    }

    public function destroy($id)
    {
        $unit = Unit::findOrFail($id);
        // Deletion Rule: prevent delete if referenced by any product information
        $references = ProductInformation::where('unit_id', $unit->id)->count();
        if ($references > 0) {
            return $this->sendError("Cannot delete unit: it is assigned to products.", ['errors' => ['unit' => ["Referenced by {$references} product(s)"]]]);
        }
        $unit->delete();

        //delete files uploaded
        return $this->sendResponse(1, "unit deleted succesfully");
    }

    // Seed default units if they don't already exist
    public function seedDefaults()
    {
        $defaults = [
            // Quantity
            ['name' => 'Pcs', 'base_unit' => 'Quantity', 'base_value' => 1],
            ['name' => 'Set', 'base_unit' => 'Quantity', 'base_value' => 1],
            // Length
            ['name' => 'Meter', 'base_unit' => 'Length', 'base_value' => 1],
            ['name' => 'Centimeter (cm)', 'base_unit' => 'Length', 'base_value' => 0.01],
            ['name' => 'Millimeter (mm)', 'base_unit' => 'Length', 'base_value' => 0.001],
            // Weight
            ['name' => 'Kilogram (kg)', 'base_unit' => 'Weight', 'base_value' => 1],
            ['name' => 'Gram (g)', 'base_unit' => 'Weight', 'base_value' => 0.001],
        ];

        $created = [];
        foreach ($defaults as $row) {
            $existing = Unit::where('name', $row['name'])->first();
            if (!$existing) {
                $created[] = Unit::create($row);
            }
        }

        return $this->sendResponse(['created' => count($created)], 'Default units seeded');
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
