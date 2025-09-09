<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Packagin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class PackaginController extends BaseController
{
    protected $searchableColumns = ['order_id', 'shipping_mark', 'invoice_no', 'qty', 'net_weight', 'total_weight', 'total_volume', 'number_of_boxes', 'order_date', 'status_id', 'internal_note', 'customer_note'];

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
        $query = Packagin::orderBy($sortBy, $sortDir);
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
        $packagin = $query->paginate($perPage); 
        $data = [
            "data" => $packagin->toArray(), 
            'current_page' => $packagin->currentPage(),
            'total_pages' => $packagin->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_packagins(){
        $data = Packagin::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Packagin::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for packagin');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "order_id"=>"required|exists:orders,id",
          "shipping_mark"=>"required|string|max:255",
          "invoice_no"=>"required|string|max:255",
          "qty"=>"required|integer",
          "net_weight"=>"nullable|numeric",
          "total_weight"=>"nullable|numeric",
          "total_volume"=>"nullable|numeric",
          "number_of_boxes"=>"nullable|integer",
          "order_date"=>"required|date",
          "status_id"=>"required|exists:product_statuses,id",
          "internal_note"=>"nullable|string",
          "customer_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $packagin = Packagin::create($validated);
        return $this->sendResponse($packagin, "packagin created succesfully");
    }

    public function show($id)
    {
        $packagin = Packagin::findOrFail($id);
        return $this->sendResponse($packagin, "");
    }


    public function update(Request $request, $id)
    {
        $packagin = Packagin::findOrFail($id);
         $validationRules = [
            //for update

          
          "order_id"=>"required|exists:orders,id",
          "shipping_mark"=>"required|string|max:255",
          "invoice_no"=>"required|string|max:255",
          "qty"=>"required|integer",
          "net_weight"=>"nullable|numeric",
          "total_weight"=>"nullable|numeric",
          "total_volume"=>"nullable|numeric",
          "number_of_boxes"=>"nullable|integer",
          "order_date"=>"required|date",
          "status_id"=>"required|exists:product_statuses,id",
          "internal_note"=>"nullable|string",
          "customer_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $packagin->update($validated);
        return $this->sendResponse($packagin, "packagin updated successfully");
    }

    public function destroy($id)
    {
        $packagin = Packagin::findOrFail($id);
        $packagin->delete();





        //delete files uploaded
        return $this->sendResponse(1, "packagin deleted succesfully");
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
