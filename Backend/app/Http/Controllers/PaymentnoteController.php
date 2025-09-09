<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Paymentnote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class PaymentnoteController extends BaseController
{
    protected $searchableColumns = ['note', 'note_ch', 'note_az'];

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
        $query = Paymentnote::orderBy($sortBy, $sortDir);
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
        $paymentnote = $query->paginate($perPage); 
        $data = [
            "data" => $paymentnote->toArray(), 
            'current_page' => $paymentnote->currentPage(),
            'total_pages' => $paymentnote->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_paymentnotes(){
        $data = Paymentnote::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Paymentnote::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for paymentnote');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "note"=>"required|string|max:255",
          "note_ch"=>"required|string|max:255",
          "note_az"=>"required|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $paymentnote = Paymentnote::create($validated);
        return $this->sendResponse($paymentnote, "paymentnote created succesfully");
    }

    public function show($id)
    {
        $paymentnote = Paymentnote::findOrFail($id);
        return $this->sendResponse($paymentnote, "");
    }


    public function update(Request $request, $id)
    {
        $paymentnote = Paymentnote::findOrFail($id);
         $validationRules = [
            //for update

          
          "note"=>"required|string|max:255",
          "note_ch"=>"required|string|max:255",
          "note_az"=>"required|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $paymentnote->update($validated);
        return $this->sendResponse($paymentnote, "paymentnote updated successfully");
    }

    public function destroy($id)
    {
        $paymentnote = Paymentnote::findOrFail($id);
        $paymentnote->delete();





        //delete files uploaded
        return $this->sendResponse(1, "paymentnote deleted succesfully");
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
