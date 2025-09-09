<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Basketitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class BasketitemController extends BaseController
{
    protected $searchableColumns = ['basket_id', 'product_id', 'brand', 'brand_code', 'oe_code', 'description', 'unit_price', 'file_id', 'qty', 'line_total', 'weight_per_unit', 'volume_per_unit'];

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
        $query = Basketitem::orderBy($sortBy, $sortDir);
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
        $basketitem = $query->paginate($perPage); 
        $data = [
            "data" => $basketitem->toArray(), 
            'current_page' => $basketitem->currentPage(),
            'total_pages' => $basketitem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_basketitems(){
        $data = Basketitem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Basketitem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for basketitem');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "basket_id"=>"required|exists:baskets,id",
          "product_id"=>"required|exists:products,id",
          "brand"=>"required|string|max:255",
          "brand_code"=>"required|string|max:255",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"required|string",
          "unit_price"=>"required|numeric",
          "_id"=>"nullable|exists:basket_s,id",
          "qty"=>"required|integer",
          "line_total"=>"nullable|numeric",
          "weight_per_unit"=>"nullable|numeric",
          "volume_per_unit"=>"nullable|numeric",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $basketitem = Basketitem::create($validated);
        return $this->sendResponse($basketitem, "basketitem created succesfully");
    }

    public function show($id)
    {
        $basketitem = Basketitem::findOrFail($id);
        return $this->sendResponse($basketitem, "");
    }


    public function update(Request $request, $id)
    {
        $basketitem = Basketitem::findOrFail($id);
         $validationRules = [
            //for update

          
          "basket_id"=>"required|exists:baskets,id",
          "product_id"=>"required|exists:products,id",
          "brand"=>"required|string|max:255",
          "brand_code"=>"required|string|max:255",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"required|string",
          "unit_price"=>"required|numeric",
          "_id"=>"nullable|exists:basket_s,id",
          "qty"=>"required|integer",
          "line_total"=>"nullable|numeric",
          "weight_per_unit"=>"nullable|numeric",
          "volume_per_unit"=>"nullable|numeric",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $basketitem->update($validated);
        return $this->sendResponse($basketitem, "basketitem updated successfully");
    }

    public function destroy($id)
    {
        $basketitem = Basketitem::findOrFail($id);
        $basketitem->delete();





        //delete files uploaded
        return $this->sendResponse(1, "basketitem deleted succesfully");
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
