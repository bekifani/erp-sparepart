<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Compan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CompanController extends BaseController
{
    protected $searchableColumns = ['logo', 'name', 'name_cn', 'company_address', 'company_address_cn', 'bank_details', 'bank_details_cn', 'contact_person', 'phone_number', 'email', 'website', 'tax_id', 'registration_number', 'status'];

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
        $query = Compan::orderBy($sortBy, $sortDir);
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
        $compan = $query->paginate($perPage); 
        $data = [
            "data" => $compan->toArray(), 
            'current_page' => $compan->currentPage(),
            'total_pages' => $compan->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_compans(){
        $data = Compan::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Compan::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for compan');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "logo"=>"nullable|",
          "name"=>"required|string|max:255",
          "name_cn"=>"nullable|string|max:255",
          "company_address"=>"required|string|max:255",
          "company_address_cn"=>"nullable|string|max:255",
          "bank_details"=>"nullable|string",
          "bank_details_cn"=>"nullable|string",
          "contact_person"=>"nullable|string|max:255",
          "phone_number"=>"nullable|string|max:20",
          "email"=>"required|email|unique:companies,email",
          "website"=>"nullable|string|max:255",
          "tax_id"=>"nullable|string|max:255",
          "registration_number"=>"nullable|string|max:255",
          "status"=>"nullable|string|max:255",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $compan = Compan::create($validated);
        return $this->sendResponse($compan, "compan created succesfully");
    }

    public function show($id)
    {
        $compan = Compan::findOrFail($id);
        return $this->sendResponse($compan, "");
    }


    public function update(Request $request, $id)
    {
        $compan = Compan::findOrFail($id);
         $validationRules = [
            //for update

          
          "logo"=>"nullable|",
          "name"=>"required|string|max:255",
          "name_cn"=>"nullable|string|max:255",
          "company_address"=>"required|string|max:255",
          "company_address_cn"=>"nullable|string|max:255",
          "bank_details"=>"nullable|string",
          "bank_details_cn"=>"nullable|string",
          "contact_person"=>"nullable|string|max:255",
          "phone_number"=>"nullable|string|max:20",
          "email"=>"required|email|unique:companies,email",
          "website"=>"nullable|string|max:255",
          "tax_id"=>"nullable|string|max:255",
          "registration_number"=>"nullable|string|max:255",
          "status"=>"nullable|string|max:255",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $compan->update($validated);
        return $this->sendResponse($compan, "compan updated successfully");
    }

    public function destroy($id)
    {
        $compan = Compan::findOrFail($id);
        $compan->delete();



$this->deleteFile($compan->logo);

        //delete files uploaded
        return $this->sendResponse(1, "compan deleted succesfully");
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
