<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customerbrandvisibilit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CustomerbrandvisibilitController extends BaseController
{
    protected $searchableColumns = ['customer_id', 'brand_id', 'visibility'];

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
        // Join customers and brandnames to include readable labels
        $query = Customerbrandvisibilit::select(
            'customerbrandvisibilits.*',
            'customers.name_surname as customer_name',
            'brandnames.brand_name as brand_name'
        )
        ->leftJoin('customers', 'customers.id', '=', 'customerbrandvisibilits.customer_id')
        ->leftJoin('brandnames', 'brandnames.id', '=', 'customerbrandvisibilits.brand_id')
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
        $customerbrandvisibilit = $query->paginate($perPage); 
        $data = [
            "data" => $customerbrandvisibilit->toArray(), 
            'current_page' => $customerbrandvisibilit->currentPage(),
            'total_pages' => $customerbrandvisibilit->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customerbrandvisibilits(){
        $data = Customerbrandvisibilit::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customerbrandvisibilit::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customerbrandvisibilit');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "customer_id"=>"required|exists:customers,id",
          "brand_id"=>"required|exists:brandnames,id",
          // accept new UI values
          "visibility"=>"required|in:allow,deny,show,hide",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Normalize show/hide from UI to allow/deny for DB
        if (isset($validated['visibility'])) {
            if ($validated['visibility'] === 'show') { $validated['visibility'] = 'allow'; }
            if ($validated['visibility'] === 'hide') { $validated['visibility'] = 'deny'; }
        }
 
        //file uploads

        $customerbrandvisibilit = Customerbrandvisibilit::create($validated);
        return $this->sendResponse($customerbrandvisibilit, "customerbrandvisibilit created succesfully");
    }

    public function show($id)
    {
        $customerbrandvisibilit = Customerbrandvisibilit::findOrFail($id);
        return $this->sendResponse($customerbrandvisibilit, "");
    }


    public function update(Request $request, $id)
    {
        $customerbrandvisibilit = Customerbrandvisibilit::findOrFail($id);
         $validationRules = [
            //for update

          
          "customer_id"=>"required|exists:customers,id",
          "brand_id"=>"required|exists:brandnames,id",
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

        $customerbrandvisibilit->update($validated);
        return $this->sendResponse($customerbrandvisibilit, "customerbrandvisibilit updated successfully");
    }

    public function destroy($id)
    {
        $customerbrandvisibilit = Customerbrandvisibilit::findOrFail($id);
        $customerbrandvisibilit->delete();

        //delete files uploaded
        return $this->sendResponse(1, "customerbrandvisibilit deleted succesfully");
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
