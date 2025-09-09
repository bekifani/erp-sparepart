<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class AttachmentController extends BaseController
{
    protected $searchableColumns = ['entity_type', 'entity_id', 'file_path', 'file_type', 'original_filename', 'uploaded_by'];

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
        $query = Attachment::orderBy($sortBy, $sortDir);
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
        $attachment = $query->paginate($perPage); 
        $data = [
            "data" => $attachment->toArray(), 
            'current_page' => $attachment->currentPage(),
            'total_pages' => $attachment->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_attachments(){
        $data = Attachment::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Attachment::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for attachment');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "entity_type"=>"required|string|max:255",
          "entity_id"=>"required|integer",
          "_path"=>"required|string|max:255",
          "_type"=>"required|string|max:255",
          "original_name"=>"nullable|string|max:255",
          "uploaded_by"=>"required|exists:users,id",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $attachment = Attachment::create($validated);
        return $this->sendResponse($attachment, "attachment created succesfully");
    }

    public function show($id)
    {
        $attachment = Attachment::findOrFail($id);
        return $this->sendResponse($attachment, "");
    }


    public function update(Request $request, $id)
    {
        $attachment = Attachment::findOrFail($id);
         $validationRules = [
            //for update

          
          "entity_type"=>"required|string|max:255",
          "entity_id"=>"required|integer",
          "_path"=>"required|string|max:255",
          "_type"=>"required|string|max:255",
          "original_name"=>"nullable|string|max:255",
          "uploaded_by"=>"required|exists:users,id",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $attachment->update($validated);
        return $this->sendResponse($attachment, "attachment updated successfully");
    }

    public function destroy($id)
    {
        $attachment = Attachment::findOrFail($id);
        $attachment->delete();





        //delete files uploaded
        return $this->sendResponse(1, "attachment deleted succesfully");
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
