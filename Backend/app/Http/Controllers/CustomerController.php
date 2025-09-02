<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Mail;
class CustomerController extends BaseController
{
    protected $searchableColumns = ['name_surname', 'shipping_mark', 'country', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'image', 'additional_note'];

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
        $query = Customer::orderBy($sortBy, $sortDir);
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
        $customer = $query->paginate($perPage); 
        $data = [
            "data" => $customer->toArray(), 
            'current_page' => $customer->currentPage(),
            'total_pages' => $customer->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customers(){
        $data = Customer::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
         Log::info('Incoming request to Customer@search', [
            'method' => $request->method(),
            'params' => $request->all(),
            'search_term' => $search_term
        ]);
        $searchTerm = $search_term;
        if (empty($searchTerm)) {   
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customer::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$$searchTerm%");
            }   
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customer');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "name_surname"=>"required|string|max:255",
          "shipping_mark"=>"nullable|string|max:255",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:customers,email",
          "phone_number"=>"nullable|string|max:20",
          "whatsapp"=>"nullable|string|max:20",
          "wechat_id"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $customer = Customer::create($validated);
        
        // Create user automatically like employee registration
        $password = rand(10000, 99999);
        $user_data = [
            "name" => $customer->name_surname,
            "email" => $customer->email,
            "phone" => $customer->phone_number, 
            "type" => "Customer",
            "customer_id" => $customer->id,
            "email_verified_at" => now(),
            "phone_verified_at" => now(),
            "password" => bcrypt(strval($password))
        ];
        $user = User::create($user_data);
        
        // Update customer with user_id
        $customer->user_id = $user->id;
        $customer->save();
        
        // Send password via email if available
        if($customer->email != null) {
            $user_email = $customer->email;
            try {
                Mail::send('emails.password', ['token' => $password], function($message) use($user_email){
                    $message->to($user_email);
                    $message->subject("Your NIBDET Customer Account Password");
                });
            } catch (Exception $e) {
                // Handle email sending error silently
            }
        }
        
        return $this->sendResponse($customer, "customer created succesfully");
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return $this->sendResponse($customer, "");
    }


    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
         $validationRules = [
            //for update

          
          "name_surname"=>"required|string|max:255",
          "shipping_mark"=>"nullable|string|max:255",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:customers,email," . $id,
          "phone_number"=>"nullable|string|max:20",
          "whatsapp"=>"nullable|string|max:20",
          "wechat_id"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $customer->update($validated);
        
        // Update associated user if exists
        if($customer->user_id) {
            $user = User::find($customer->user_id);
            if($user) {
                $user->update([
                    "name" => $customer->name_surname,
                    "email" => $customer->email,
                    "phone" => $customer->phone_number
                ]);
            }
        }
        
        return $this->sendResponse($customer, "customer updated successfully");
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();



$this->deleteFile($customer->image);

        //delete files uploaded
        return $this->sendResponse(1, "customer deleted succesfully");
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
