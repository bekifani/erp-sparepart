<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Packinglist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class PackinglistController extends BaseController
{
    protected $searchableColumns = ['order_id', 'invoice_no', 'qty', 'net_weight', 'total_weight', 'total_volume', 'number_of_boxes', 'order_date', 'order_period', 'shipping_date', 'status_id', 'additional_note'];

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
        $query = Packinglist::orderBy($sortBy, $sortDir);
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
        $packinglist = $query->paginate($perPage); 
        $data = [
            "data" => $packinglist->toArray(), 
            'current_page' => $packinglist->currentPage(),
            'total_pages' => $packinglist->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_packinglists(){
        $data = Packinglist::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Packinglist::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for packinglist');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "order_id"=>"required|exists:orders,id",
          "invoice_no"=>"required|string|max:255",
          "qty"=>"required|integer",
          "net_weight"=>"nullable|numeric",
          "total_weight"=>"nullable|numeric",
          "total_volume"=>"nullable|numeric",
          "number_of_boxes"=>"nullable|integer",
          "order_date"=>"required|date",
          "order_period"=>"required|date",
          "shipping_date"=>"required|date",
          "status_id"=>"required|exists:productstatuses,id",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $packinglist = Packinglist::create($validated);
        return $this->sendResponse($packinglist, "packinglist created succesfully");
    }

    public function show($id)
    {
        $packinglist = Packinglist::findOrFail($id);
        return $this->sendResponse($packinglist, "");
    }


    public function update(Request $request, $id)
    {
        $packinglist = Packinglist::findOrFail($id);
         $validationRules = [
            //for update

          
          "order_id"=>"required|exists:orders,id",
          "invoice_no"=>"required|string|max:255",
          "qty"=>"required|integer",
          "net_weight"=>"nullable|numeric",
          "total_weight"=>"nullable|numeric",
          "total_volume"=>"nullable|numeric",
          "number_of_boxes"=>"nullable|integer",
          "order_date"=>"required|date",
          "order_period"=>"required|date",
          "shipping_date"=>"required|date",
          "status_id"=>"required|exists:productstatuses,id",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $packinglist->update($validated);
        return $this->sendResponse($packinglist, "packinglist updated successfully");
    }

    public function destroy($id)
    {
        $packinglist = Packinglist::findOrFail($id);
        $packinglist->delete();





        //delete files uploaded
        return $this->sendResponse(1, "packinglist deleted succesfully");
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
