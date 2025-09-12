<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class ProblemController extends BaseController
{
    protected $searchableColumns = ['problem_number', 'supplier_invoice_id', 'customer_invoice_id', 'user_id', 'problem_type', 'solution_type', 'status_id', 'refund_amount', 'internal_note', 'customer_note'];

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
        $query = Problem::orderBy($sortBy, $sortDir);
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
        $problem = $query->paginate($perPage); 
        $data = [
            "data" => $problem->toArray(), 
            'current_page' => $problem->currentPage(),
            'total_pages' => $problem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_problems(){
        $data = Problem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Problem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for problem');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              
              "problem_number"=>"required|string|unique:problems,problem_number|max:255",
              "supplier_invoice_id"=>"nullable|exists:supplierinvoices,id",
              "customer_invoice_id"=>"nullable|exists:customerinvoices,id",
              "user_id"=>"required|exists:users,id",
              "problem_type"=>"required|string|max:255",
              "solution_type"=>"nullable|string|max:255",
              "status_id"=>"required|exists:productstatuses,id",
              "refund_amount"=>"nullable|numeric",
              "internal_note"=>"nullable|string",
              "customer_note"=>"nullable|string",
              

            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            
            //file uploads

            $problem = Problem::create($validated);
            return $this->sendResponse($problem, "problem created succesfully");
        } catch (\Exception $e) {
            Log::error('Error creating problem: ' . $e->getMessage());
            return $this->sendError('Error creating problem', ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $problem = Problem::findOrFail($id);
        return $this->sendResponse($problem, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $problem = Problem::findOrFail($id);
             $validationRules = [
                //for update

              
              "problem_number"=>"required|string|unique:problems,problem_number," . $id . "|max:255",
              "supplier_invoice_id"=>"nullable|exists:supplierinvoices,id",
              "customer_invoice_id"=>"nullable|exists:customerinvoices,id",
              "user_id"=>"required|exists:users,id",
              "problem_type"=>"required|string|max:255",
              "solution_type"=>"nullable|string|max:255",
              "status_id"=>"required|exists:productstatuses,id",
              "refund_amount"=>"nullable|numeric",
              "internal_note"=>"nullable|string",
              "customer_note"=>"nullable|string",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            //file uploads update

            $problem->update($validated);
            return $this->sendResponse($problem, "problem updated successfully");
        } catch (\Exception $e) {
            Log::error('Error updating problem: ' . $e->getMessage());
            return $this->sendError('Error updating problem', ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $problem = Problem::findOrFail($id);
            $problem->delete();

            //delete files uploaded
            return $this->sendResponse(1, "problem deleted succesfully");
        } catch (\Exception $e) {
            Log::error('Error deleting problem: ' . $e->getMessage());
            return $this->sendError('Error deleting problem', ['error' => $e->getMessage()]);
        }
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
