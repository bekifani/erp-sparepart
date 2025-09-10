<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customerproductvisibilit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CustomerproductvisibilitController extends BaseController
{
    protected $searchableColumns = ['customer_id', 'product_id', 'visibility'];

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
        // Join customers and products to expose readable names in response
        $query = Customerproductvisibilit::select(
            'customerproductvisibilits.*',
            'customers.name_surname as customer_name',
            'products.description as product_name'
        )
        ->leftJoin('customers', 'customers.id', '=', 'customerproductvisibilits.customer_id')
        ->leftJoin('products', 'products.id', '=', 'customerproductvisibilits.product_id')
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
        $customerproductvisibilit = $query->paginate($perPage); 
        $data = [
            "data" => $customerproductvisibilit->toArray(), 
            'current_page' => $customerproductvisibilit->currentPage(),
            'total_pages' => $customerproductvisibilit->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customerproductvisibilits(){
        $data = Customerproductvisibilit::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customerproductvisibilit::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customerproductvisibilit');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "customer_id"=>"required|exists:customers,id",
          "product_id"=>"required|exists:products,id",
          // accept both legacy and new UI values
          "visibility"=>"required|in:allow,deny,show,hide",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Normalize visibility values from UI (show/hide) to backend (allow/deny)
        if (isset($validated['visibility'])) {
            if ($validated['visibility'] === 'show') { $validated['visibility'] = 'allow'; }
            if ($validated['visibility'] === 'hide') { $validated['visibility'] = 'deny'; }
        }
 
        
        //file uploads

        $customerproductvisibilit = Customerproductvisibilit::create($validated);
        return $this->sendResponse($customerproductvisibilit, "customerproductvisibilit created succesfully");
    }

    public function show($id)
    {
        $customerproductvisibilit = Customerproductvisibilit::findOrFail($id);
        return $this->sendResponse($customerproductvisibilit, "");
    }


    public function update(Request $request, $id)
    {
        $customerproductvisibilit = Customerproductvisibilit::findOrFail($id);
         $validationRules = [
            //for update

          
          "customer_id"=>"required|exists:customers,id",
          "product_id"=>"required|exists:products,id",
          "visibility"=>"required|in:allow,deny,show,hide",
           
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        if (isset($validated['visibility'])) {
            if ($validated['visibility'] === 'show') { $validated['visibility'] = 'allow'; }
            if ($validated['visibility'] === 'hide') { $validated['visibility'] = 'deny'; }
        }
 
 
        //file uploads update

        $customerproductvisibilit->update($validated);
        return $this->sendResponse($customerproductvisibilit, "customerproductvisibilit updated successfully");
    }

    public function destroy($id)
    {
        $customerproductvisibilit = Customerproductvisibilit::findOrFail($id);
        $customerproductvisibilit->delete();




        //delete files uploaded
        return $this->sendResponse(1, "customerproductvisibilit deleted succesfully");
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
