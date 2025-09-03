<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Crosscode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CrosscodeController extends BaseController
{
    protected $searchableColumns = [
        'brandnames.brand_name',
        'brandnames.brand_code',
        'crosscodes.cross_band',
        'crosscodes.cross_code',
        'crosscodes.show'
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
        $query = Crosscode::leftJoin('products', 'crosscodes.product_id', '=', 'products.id')
            ->leftJoin('product_information', 'products.product_information_id', '=', 'product_information.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->select(
                'brandnames.brand_name',
                'brandnames.brand_code',
                'crosscodes.cross_band',
                'crosscodes.cross_code',
                'crosscodes.show'
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
        $crosscode = $query->paginate($perPage); 
        $data = [
            "data" => $crosscode->toArray(), 
            'current_page' => $crosscode->currentPage(),
            'total_pages' => $crosscode->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_crosscodes(){
        $data = Crosscode::leftJoin('products', 'crosscodes.product_id', '=', 'products.id')
            ->leftJoin('product_information', 'products.product_information_id', '=', 'product_information.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->select(
                'brandnames.brand_name',
                'brandnames.brand_code',
                'crosscodes.cross_band',
                'crosscodes.cross_code',
                'crosscodes.show'
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
        $results = Crosscode::leftJoin('products', 'crosscodes.product_id', '=', 'products.id')
            ->leftJoin('product_information', 'products.product_information_id', '=', 'product_information.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->select(
                'brandnames.brand_name',
                'brandnames.brand_code',
                'crosscodes.cross_band',
                'crosscodes.cross_code',
                'crosscodes.show'
            )
            ->distinct()
            ->where(function ($query) use ($searchTerm) {
                foreach ($this->searchableColumns as $column) {
                    $query->orWhere($column, 'like', "%$searchTerm%");
                }
            })->paginate(20);
        return $this->sendResponse($results , 'search resutls for crosscode');
    }


    public function store(Request $request)
    {
        $validationRules = [
          "product_id"=>"required|exists:products,id",
          "cross_band"=>"required|string|max:255",
          "cross_code"=>"required|string|max:255",
          "show"=>"required|boolean",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $crosscode = Crosscode::create($validated);
        return $this->sendResponse($crosscode, "crosscode created succesfully");
    }

    public function show($id)
    {
        $crosscode = Crosscode::leftJoin('products', 'crosscodes.product_id', '=', 'products.id')
            ->leftJoin('product_information', 'products.product_information_id', '=', 'product_information.id')
            ->leftJoin('brandnames', 'product_information.brand_code', '=', 'brandnames.id')
            ->select(
                'crosscodes.*',
                'brandnames.brand_name',
                'brandnames.brand_code'
            )
            ->where('crosscodes.id', $id)
            ->first();
        return $this->sendResponse($crosscode, "");
    }


    public function update(Request $request, $id)
    {
        $crosscode = Crosscode::findOrFail($id);
         $validationRules = [
            //for update
          "product_id"=>"required|exists:products,id",
          "cross_band"=>"required|string|max:255",
          "cross_code"=>"required|string|max:255",
          "show"=>"required|boolean",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $crosscode->update($validated);
        return $this->sendResponse($crosscode, "crosscode updated successfully");
    }

    public function destroy($id)
    {
        $crosscode = Crosscode::findOrFail($id);
        $crosscode->delete();





        //delete files uploaded
        return $this->sendResponse(1, "crosscode deleted succesfully");
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
