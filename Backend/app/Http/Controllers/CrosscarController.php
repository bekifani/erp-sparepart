<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Crosscar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CrosscarController extends BaseController
{
    protected $searchableColumns = [
        'brandnames.brand_name',
        'brandnames.brand_code',
        'carmodels.car_model'
    ];

    public function index(Request $request)
    {
        $sortBy = 'brand_name';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Crosscar::leftJoin('products', 'crosscars.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('carmodels', 'crosscars.car_model_id', '=', 'carmodels.id')
            ->select(
                'brandnames.brand_name',
                'products.brand_code',
                'carmodels.car_model as car_model_name'
            )
            ->distinct()
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
        $crosscar = $query->paginate($perPage); 
        $data = [
            "data" => $crosscar->toArray(), 
            'current_page' => $crosscar->currentPage(),
            'total_pages' => $crosscar->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_crosscars(){
        $data = Crosscar::leftJoin('products', 'crosscars.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('carmodels', 'crosscars.car_model_id', '=', 'carmodels.id')
            ->select(
                'brandnames.brand_name',
                'products.brand_code',
                'carmodels.car_model as car_model_name'
            )
            ->distinct()
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
        $results = Crosscar::leftJoin('products', 'crosscars.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('carmodels', 'crosscars.car_model_id', '=', 'carmodels.id')
            ->select(
                'brandnames.brand_name',
                'products.brand_code',
                'carmodels.car_model as car_model_name'
            )
            ->distinct()
            ->where(function ($query) use ($searchTerm) {
                foreach ($this->searchableColumns as $column) {
                    $query->orWhere($column, 'like', "%$searchTerm%");
                }
            })->paginate(20);
        return $this->sendResponse($results , 'search resutls for crosscar');
    }


    public function store(Request $request)
    {
        $validationRules = [
          "product_id"=>"required|exists:products,id",
          "car_model_id"=>"required|exists:carmodels,id",
          "cross_code"=>"required|string|max:255",
          "is_visible"=>"required|boolean",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $crosscar = Crosscar::create($validated);
        return $this->sendResponse($crosscar, "crosscar created succesfully");
    }

    public function show($id)
    {
        $crosscar = Crosscar::leftJoin('products', 'crosscars.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('carmodels', 'crosscars.car_model_id', '=', 'carmodels.id')
            ->select(
                'crosscars.*',
                'brandnames.brand_name',
                'products.brand_code',
                'carmodels.car_model as car_model_name'
            )
            ->where('crosscars.id', $id)
            ->first();
        return $this->sendResponse($crosscar, "");
    }


    public function update(Request $request, $id)
    {
        $crosscar = Crosscar::findOrFail($id);
         $validationRules = [
          "product_id"=>"required|exists:products,id",
          "car_model_id"=>"required|exists:carmodels,id",
          "cross_code"=>"required|string|max:255",
          "is_visible"=>"required|boolean",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $crosscar->update($validated);
        return $this->sendResponse($crosscar, "crosscar updated successfully");
    }

    public function destroy($id)
    {
        $crosscar = Crosscar::findOrFail($id);
        $crosscar->delete();





        //delete files uploaded
        return $this->sendResponse(1, "crosscar deleted succesfully");
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
