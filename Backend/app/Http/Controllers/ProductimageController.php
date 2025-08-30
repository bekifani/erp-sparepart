<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productimage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductimageController extends BaseController
{
    protected $searchableColumns = ['product_information_id', 'image_url', 'is_primary', 'uploaded_at'];

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
        $query = Productimage::orderBy($sortBy, $sortDir);
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
        $productimage = $query->paginate($perPage); 
        $data = [
            "data" => $productimage->toArray(), 
            'current_page' => $productimage->currentPage(),
            'total_pages' => $productimage->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productimages(){
        $data = Productimage::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Productimage::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for productimage');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "product_information_id"=>"required|exists:product_information,id",
          "image_url"=>"required|",
          "is_primary"=>"required|boolean",
          "uploaded_at"=>"required|date",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $productimage = Productimage::create($validated);
        return $this->sendResponse($productimage, "productimage created succesfully");
    }

    public function show($id)
    {
        $productimage = Productimage::findOrFail($id);
        return $this->sendResponse($productimage, "");
    }


    public function update(Request $request, $id)
    {
        $productimage = Productimage::findOrFail($id);
         $validationRules = [
            //for update

          
          "product_information_id"=>"required|exists:product_information,id",
          "image_url"=>"required|",
          "is_primary"=>"required|boolean",
          "uploaded_at"=>"required|date",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $productimage->update($validated);
        return $this->sendResponse($productimage, "productimage updated successfully");
    }

    public function destroy($id)
    {
        $productimage = Productimage::findOrFail($id);
        $productimage->delete();



$this->deleteFile($productimage->image_url);

        //delete files uploaded
        return $this->sendResponse(1, "productimage deleted succesfully");
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
