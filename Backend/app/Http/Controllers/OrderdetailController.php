<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Orderdetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class OrderdetailController extends BaseController
{
    protected $searchableColumns = ['order_id', 'product_id', 'unit_price', 'qty', 'line_total', 'arrival_time', 'status_id', 'additional_note'];

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
        $query = Orderdetail::orderBy($sortBy, $sortDir);
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
        $orderdetail = $query->paginate($perPage); 
        $data = [
            "data" => $orderdetail->toArray(), 
            'current_page' => $orderdetail->currentPage(),
            'total_pages' => $orderdetail->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_orderdetails(){
        $data = Orderdetail::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Orderdetail::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for orderdetail');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "order_id"=>"required|exists:orders,id",
          "product_id"=>"required|exists:products,id",
          "unit_price"=>"required|numeric",
          "qty"=>"required|integer",
          "line_total"=>"nullable|numeric",
          "arrival_time"=>"required|date",
          "status_id"=>"required|exists:productstatuses,id",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $orderdetail = Orderdetail::create($validated);
        return $this->sendResponse($orderdetail, "orderdetail created succesfully");
    }

    public function show($id)
    {
        $orderdetail = Orderdetail::findOrFail($id);
        return $this->sendResponse($orderdetail, "");
    }


    public function update(Request $request, $id)
    {
        $orderdetail = Orderdetail::findOrFail($id);
         $validationRules = [
            //for update

          
          "order_id"=>"required|exists:orders,id",
          "product_id"=>"required|exists:products,id",
          "unit_price"=>"required|numeric",
          "qty"=>"required|integer",
          "line_total"=>"nullable|numeric",
          "arrival_time"=>"required|date",
          "status_id"=>"required|exists:productstatuses,id",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $orderdetail->update($validated);
        return $this->sendResponse($orderdetail, "orderdetail updated successfully");
    }

    public function destroy($id)
    {
        $orderdetail = Orderdetail::findOrFail($id);
        $orderdetail->delete();





        //delete files uploaded
        return $this->sendResponse(1, "orderdetail deleted succesfully");
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
