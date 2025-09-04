<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Carmodel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
class CarmodelController extends BaseController
{
    protected $searchableColumns = ['car_model', 'additional_note'];

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
        
        $query = Carmodel::select(
            'carmodels.*',
            DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
        )
        ->leftJoin(
            DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
            'carmodels.id', '=', 'crosscar_counts.car_model_id'
        )
        ->orderBy($sortBy, $sortDir);
        
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
        $carmodel = $query->paginate($perPage); 
        $data = [
            "data" => $carmodel->toArray(), 
            'current_page' => $carmodel->currentPage(),
            'total_pages' => $carmodel->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_carmodels(){
        $data = Carmodel::select(
            'carmodels.*',
            DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
        )
        ->leftJoin(
            DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
            'carmodels.id', '=', 'crosscar_counts.car_model_id'
        )
        ->get();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Carmodel::select(
                'carmodels.id as value',
                'carmodels.car_model',
                'carmodels.additional_note',
                DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
            )
            ->leftJoin(
                DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
                'carmodels.id', '=', 'crosscar_counts.car_model_id'
            )
            ->where(function ($query) use ($searchTerm) {
                foreach ($this->searchableColumns as $column) {
                    $query->orWhere('carmodels.' . $column, 'like', "%$searchTerm%");
                }
            })
            ->get()
            ->map(function ($item) {
                return [
                    'value' => $item->value,
                    'text' => $item->car_model,
                    'car_model' => $item->car_model,
                    'additional_note' => $item->additional_note,
                    'product_qty' => $item->product_qty
                ];
            });

        return response()->json($results);
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "car_model"=>"required|string|max:255",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $carmodel = Carmodel::create($validated);
        return $this->sendResponse($carmodel, "carmodel created succesfully");
    }

    public function show($id)
    {
        $carmodel = Carmodel::select(
            'carmodels.*',
            DB::raw('COALESCE(crosscar_counts.product_qty, 0) as product_qty')
        )
        ->leftJoin(
            DB::raw('(SELECT car_model_id, COUNT(*) as product_qty FROM crosscars GROUP BY car_model_id) as crosscar_counts'),
            'carmodels.id', '=', 'crosscar_counts.car_model_id'
        )
        ->where('carmodels.id', $id)
        ->firstOrFail();
        return $this->sendResponse($carmodel, "");
    }


    public function update(Request $request, $id)
    {
        $carmodel = Carmodel::findOrFail($id);
         $validationRules = [
            //for update

          
          "car_model"=>"required|string|max:255",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $carmodel->update($validated);
        return $this->sendResponse($carmodel, "carmodel updated successfully");
    }

    public function destroy($id)
    {
        $carmodel = Carmodel::findOrFail($id);
        $carmodel->delete();





        //delete files uploaded
        return $this->sendResponse(1, "carmodel deleted succesfully");
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
