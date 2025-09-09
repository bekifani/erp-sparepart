<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierorderdetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierorderdetailController extends BaseController
{
    protected $searchableColumns = ['supplier_order_id', 'product_id', 'order_detail_id', 'qty', 'price', 'shipping_mark', 'arrival_time', 'box_name', 'purchase_price', 'extra_cost', 'amount', 'status_id', 'additional_note', 'image_url'];

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
        $query = Supplierorderdetail::orderBy($sortBy, $sortDir);
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
        $supplierorderdetail = $query->paginate($perPage); 
        $data = [
            "data" => $supplierorderdetail->toArray(), 
            'current_page' => $supplierorderdetail->currentPage(),
            'total_pages' => $supplierorderdetail->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierorderdetails(){
        $data = Supplierorderdetail::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierorderdetail::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierorderdetail');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "supplier_order_id"=>"required|exists:supplier_orders,id",
          "product_id"=>"required|exists:products,id",
          "order_detail_id"=>"nullable|exists:order_details,id",
          "qty"=>"required|integer",
          "price"=>"nullable|numeric",
          "shipping_mark"=>"nullable|string|max:255",
          "arrival_time"=>"nullable|string|max:255",
          "box_name"=>"nullable|string|max:255",
          "purchase_price"=>"nullable|numeric",
          "extra_cost"=>"nullable|numeric",
          "amount"=>"nullable|numeric",
          "status_id"=>"required|exists:product_statuses,id",
          "additional_note"=>"nullable|string|max:255",
          "image_url"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplierorderdetail = Supplierorderdetail::create($validated);
        return $this->sendResponse($supplierorderdetail, "supplierorderdetail created succesfully");
    }

    public function show($id)
    {
        $supplierorderdetail = Supplierorderdetail::findOrFail($id);
        return $this->sendResponse($supplierorderdetail, "");
    }


    public function update(Request $request, $id)
    {
        $supplierorderdetail = Supplierorderdetail::findOrFail($id);
         $validationRules = [
            //for update

          
          "supplier_order_id"=>"required|exists:supplier_orders,id",
          "product_id"=>"required|exists:products,id",
          "order_detail_id"=>"nullable|exists:order_details,id",
          "qty"=>"required|integer",
          "price"=>"nullable|numeric",
          "shipping_mark"=>"nullable|string|max:255",
          "arrival_time"=>"nullable|string|max:255",
          "box_name"=>"nullable|string|max:255",
          "purchase_price"=>"nullable|numeric",
          "extra_cost"=>"nullable|numeric",
          "amount"=>"nullable|numeric",
          "status_id"=>"required|exists:product_statuses,id",
          "additional_note"=>"nullable|string|max:255",
          "image_url"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplierorderdetail->update($validated);
        return $this->sendResponse($supplierorderdetail, "supplierorderdetail updated successfully");
    }

    public function destroy($id)
    {
        $supplierorderdetail = Supplierorderdetail::findOrFail($id);
        $supplierorderdetail->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplierorderdetail deleted succesfully");
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
