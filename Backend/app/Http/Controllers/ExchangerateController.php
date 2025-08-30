<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Exchangerate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ExchangerateController extends BaseController
{
    protected $searchableColumns = ['date', 'currency', 'price', 'base_currency'];

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
        $query = Exchangerate::orderBy($sortBy, $sortDir);
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
        $exchangerate = $query->paginate($perPage); 
        $data = [
            "data" => $exchangerate->toArray(), 
            'current_page' => $exchangerate->currentPage(),
            'total_pages' => $exchangerate->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_exchangerates(){
        $data = Exchangerate::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Exchangerate::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for exchangerate');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "date"=>"required|date",
          "currency"=>"required|string|max:255",
          "price"=>"required|numeric",
          "base_currency"=>"required|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $exchangerate = Exchangerate::create($validated);
        return $this->sendResponse($exchangerate, "exchangerate created succesfully");
    }

    public function show($id)
    {
        $exchangerate = Exchangerate::findOrFail($id);
        return $this->sendResponse($exchangerate, "");
    }


    public function update(Request $request, $id)
    {
        $exchangerate = Exchangerate::findOrFail($id);
         $validationRules = [
            //for update

          
          "date"=>"required|date",
          "currency"=>"required|string|max:255",
          "price"=>"required|numeric",
          "base_currency"=>"required|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $exchangerate->update($validated);
        return $this->sendResponse($exchangerate, "exchangerate updated successfully");
    }

    public function destroy($id)
    {
        $exchangerate = Exchangerate::findOrFail($id);
        $exchangerate->delete();





        //delete files uploaded
        return $this->sendResponse(1, "exchangerate deleted succesfully");
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
