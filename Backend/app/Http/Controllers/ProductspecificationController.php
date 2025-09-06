<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productspecification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductspecificationController extends BaseController
{
    // Allow searching by related attributes
    protected $searchableColumns = [
        'products.description',
        'brandnames.brand_name',
        'products.brand_code',
        'specificationheadnames.headname',
        'products.oe_code',
        'productspecifications.value',
    ];

    // Map frontend alias fields to actual DB columns for filtering/sorting
    private function mapField(string $field): string
    {
        $map = [
            'brand_name' => 'brandnames.brand_name',
            'brand_code_name' => 'products.brand_code',
            'headname' => 'specificationheadnames.headname',
            'oe_code' => 'products.oe_code',
            'product_description' => 'products.description',
            'value' => 'productspecifications.value',
            'product_id' => 'productspecifications.product_id',
            'headname_id' => 'productspecifications.headname_id',
            'id' => 'productspecifications.id',
        ];
        return $map[$field] ?? $field;
    }

    public function index(Request $request)
    {
        $sortBy = 'productspecifications.id';
        $sortDir = 'desc';
        if(!empty($request['sort'])){
            $candidate = $request['sort'][0]['field'];
            $sortBy = $this->mapField($candidate);
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'] ?? [];

        $query = Productspecification::query()
            ->from('productspecifications')
            ->leftJoin('products', 'productspecifications.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('specificationheadnames', 'productspecifications.headname_id', '=', 'specificationheadnames.id')
            ->select([
                'productspecifications.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                DB::raw('products.oe_code as oe_code'),
                DB::raw('products.description as product_description'),
                DB::raw('specificationheadnames.headname as headname'),
            ])
            ->orderBy($sortBy, $sortDir);

        if(!empty($filters)){
            foreach ($filters as $filter) {
                $field = $this->mapField($filter['field']);
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                $query->where($field, $operator, $searchTerm);
            }
        }
        $productspecification = $query->paginate($perPage); 
        $data = [
            "data" => $productspecification->toArray(), 
            'current_page' => $productspecification->currentPage(),
            'total_pages' => $productspecification->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productspecifications(){
        $data = Productspecification::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productspecification::query()
            ->from('productspecifications')
            ->leftJoin('products', 'productspecifications.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('specificationheadnames', 'productspecifications.headname_id', '=', 'specificationheadnames.id')
            ->select([
                'productspecifications.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                DB::raw('products.oe_code as oe_code'),
                DB::raw('products.description as product_description'),
                DB::raw('specificationheadnames.headname as headname'),
            ])
            ->where(function ($query) use ($searchTerm) {
                foreach ($this->searchableColumns as $column) {
                    $query->orWhere($column, 'like', "%$searchTerm%");
                }
            })
            ->paginate(20);
        return $this->sendResponse($results , 'search results for productspecification');
    }

    public function store(Request $request)
    {
        $validationRules = [
          
          "product_id"=>"required|exists:products,id",
          "headname_id"=>"required|exists:specificationheadnames,id",
          "value"=>"required|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $productspecification = Productspecification::create($validated);
        return $this->sendResponse($productspecification, "productspecification created succesfully");
    }

    public function show($id)
    {
        $productspecification = Productspecification::findOrFail($id);
        return $this->sendResponse($productspecification, "");
    }


    public function update(Request $request, $id)
    {
        $productspecification = Productspecification::findOrFail($id);
         $validationRules = [
            //for update

          
          "product_id"=>"required|exists:products,id",
          "headname_id"=>"required|exists:specificationheadnames,id",
          "value"=>"required|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $productspecification->update($validated);
        return $this->sendResponse($productspecification, "productspecification updated successfully");
    }

    public function destroy($id)
    {
        $productspecification = Productspecification::findOrFail($id);
        $productspecification->delete();





        //delete files uploaded
        return $this->sendResponse(1, "productspecification deleted succesfully");
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
