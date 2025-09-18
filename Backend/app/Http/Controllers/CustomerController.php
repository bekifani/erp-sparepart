<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Mail;

class CustomerController extends BaseController
{
    protected $searchableColumns = ['name_surname', 'shipping_mark', 'country', 'address', 'email', 'phone_number', 'position', 'birth_date', 'whatsapp', 'wechat_id', 'image', 'additional_note'];

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
        
        // Log the customer data to check if new fields are included
        Log::info('Customer index response:', [
            'first_customer' => $customer->items() ? $customer->items()[0] : null,
            'total_count' => $customer->total()
        ]);
        
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
                $query->orWhere($column, 'like', "%$searchTerm%");
            }   
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customer');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "name_surname"=>"required|string|max:255",
          "shipping_mark"=>"nullable|string|max:255|unique:customers,shipping_mark",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:customers,email",
          "phone_number"=>"nullable|string|max:20|unique:customers,phone_number",
          "position"=>"nullable|string|max:255",
          "birth_date"=>"nullable|date",
          "whatsapp"=>"nullable|string|max:20|unique:customers,whatsapp",
          "wechat_id"=>"nullable|string|max:255|unique:customers,wechat_id",
          "image"=>"nullable|",
          "image_source"=>"nullable|string|in:upload,camera",
          "additional_note"=>"nullable|string",
          // allow decimal to match DB schema
          "price_adjustment_percent"=>"nullable|numeric|min:0|max:100",
          "price_adjustment_type"=>"nullable|string|in:increase,decrease",

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        try {
            return DB::transaction(function () use ($validated) {
                // Handle image field based on source type
                if (isset($validated['image']) && !empty($validated['image'])) {
                    $imageSource = $validated['image_source'] ?? null;
                    
                    if ($imageSource === 'camera') {
                        $base64Data = $validated['image'];
                        if (is_array($validated['image']) && isset($validated['image']['data'])) {
                            $base64Data = $validated['image']['data'];
                        }
                        if (strpos($base64Data, 'data:image') === 0) {
                            $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                        }
                        $decodedImageData = base64_decode($base64Data);
                        if ($decodedImageData !== false) {
                            $fileName = 'customer_image_' . time() . '.jpg';
                            $filePath = 'uploads/' . $fileName;
                            Storage::disk('public')->put($filePath, $decodedImageData);
                            $validated['image'] = $fileName;
                        }
                    } elseif ($imageSource === 'upload') {
                        // keep filename as is
                    } else {
                        $base64Data = $validated['image'];
                        if (is_array($validated['image']) && isset($validated['image']['data'])) {
                            $base64Data = $validated['image']['data'];
                        }
                        if (strpos($base64Data, 'data:image') === 0) {
                            $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                        }
                        $decodedImageData = base64_decode($base64Data);
                        if ($decodedImageData !== false && base64_encode($decodedImageData) === $base64Data) {
                            $fileName = 'customer_image_' . time() . '.jpg';
                            $filePath = 'uploads/' . $fileName;
                            Storage::disk('public')->put($filePath, $decodedImageData);
                            $validated['image'] = $fileName;
                        }
                    }
                }
                unset($validated['image_source']);

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

                try {
                    $user = User::create($user_data);
                } catch (\Throwable $ue) {
                    // If enum does not accept 'Customer', fallback to 'Employee' and log it
                    Log::warning('User create failed with type Customer, retrying as Employee', [
                        'error' => $ue->getMessage()
                    ]);
                    $user_data['type'] = 'Employee';
                    $user = User::create($user_data);
                }

                // Optionally email password
                if($customer->email != null) {
                    $user_email = $customer->email;
                    try {
                        Mail::send('emails.password', ['token' => $password], function($message) use($user_email){
                            $message->to($user_email);
                            $message->subject("Your ERP Customer Account Password");
                        });
                    } catch (\Exception $e) {
                        Log::warning('Customer password email failed: '.$e->getMessage());
                    }
                }

                return $this->sendResponse($customer, "customer created succesfully");
            });
        } catch (\Throwable $e) {
            Log::error('Customer@store failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to create customer', ['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        Log::info('Customer show response:', [
            'customer_id' => $id,
            'customer_data' => $customer->toArray()
        ]);
        return $this->sendResponse($customer, "");
    }


    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
         $validationRules = [
            //for update

          
          "name_surname"=>"required|string|max:255",
          "shipping_mark"=>"nullable|string|max:255|unique:customers,shipping_mark," . $id,
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:customers,email," . $id,
          "phone_number"=>"nullable|string|max:20|unique:customers,phone_number," . $id,
          "position"=>"nullable|string|max:255",
          "birth_date"=>"nullable|date",
          "whatsapp"=>"nullable|string|max:20|unique:customers,whatsapp," . $id,
          "wechat_id"=>"nullable|string|max:255|unique:customers,wechat_id," . $id,
          "image"=>"nullable|",
          "image_source"=>"nullable|string|in:upload,camera",
          "additional_note"=>"nullable|string",
          // allow decimal to match DB schema
          "price_adjustment_percent"=>"nullable|numeric|min:0|max:100",
          "price_adjustment_type"=>"nullable|string|in:increase,decrease",

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        // Handle image field based on source type
        if (isset($validated['image']) && !empty($validated['image'])) {
            $imageSource = $validated['image_source'] ?? null;
            
            if ($imageSource === 'camera') {
                // Handle camera-captured images (base64 data)
                $base64Data = $validated['image'];
                
                // Handle both array format {data: 'base64...', type: 'image/jpeg'} and string format
                if (is_array($validated['image']) && isset($validated['image']['data'])) {
                    $base64Data = $validated['image']['data'];
                }
                
                // Remove data URL prefix if present
                if (strpos($base64Data, 'data:image') === 0) {
                    $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                }
                
                // Decode base64 and save as file with generated name
                $decodedImageData = base64_decode($base64Data);
                if ($decodedImageData !== false) {
                    // Delete old image file if it exists
                    if ($customer->image && Storage::disk('public')->exists('uploads/' . $customer->image)) {
                        Storage::disk('public')->delete('uploads/' . $customer->image);
                    }
                    
                    $fileName = 'customer_image_' . time() . '.jpg';
                    $filePath = 'uploads/' . $fileName;
                    Storage::disk('public')->put($filePath, $decodedImageData);
                    $validated['image'] = $fileName;
                }
            } elseif ($imageSource === 'upload') {
                // Handle uploaded files - keep original filename as is
                // The image field already contains the filename from FileUpload component
                // No processing needed, just keep the original filename
            } else {
                // Fallback for existing images or when source is not specified
                $imageData = $validated['image'];
                
                // Check if this is base64 data or an existing filename
                $isBase64 = false;
                
                // Handle array format {data: 'base64...', type: 'image/jpeg'}
                if (is_array($imageData) && isset($imageData['data'])) {
                    $imageData = $imageData['data'];
                    $isBase64 = true;
                }
                
                // Check if it starts with data URL prefix
                if (strpos($imageData, 'data:image') === 0) {
                    $isBase64 = true;
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                }
                
                // Check if it's a valid base64 string (not just a filename)
                if (!$isBase64) {
                    $testDecode = base64_decode($imageData, true);
                    if ($testDecode !== false && base64_encode($testDecode) === $imageData) {
                        $isBase64 = true;
                    }
                }
                
                if ($isBase64) {
                    // Process as new base64 image
                    $decodedImageData = base64_decode($imageData);
                    if ($decodedImageData !== false) {
                        // Delete old image file if it exists
                        if ($customer->image && Storage::disk('public')->exists('uploads/' . $customer->image)) {
                            Storage::disk('public')->delete('uploads/' . $customer->image);
                        }
                        
                        $fileName = 'customer_image_' . time() . '.jpg';
                        $filePath = 'uploads/' . $fileName;
                        Storage::disk('public')->put($filePath, $decodedImageData);
                        $validated['image'] = $fileName;
                    }
                }
                // If not base64, keep the existing filename as is (no processing needed)
            }
        }
        
        // Remove image_source from validated data as it's not a database field
        unset($validated['image_source']);

        $customer->update($validated);
        
        // Update associated user if exists
        $user = $customer->user;
        if($user) {
            $user->update([
                "name" => $customer->name_surname,
                "email" => $customer->email,
                "phone" => $customer->phone_number
            ]);
        }
        
        return $this->sendResponse($customer, "customer updated successfully");
    }

    public function destroy($id)
    {
        try {
            $customer = Customer::findOrFail($id);
            
            // Store file path before deleting customer record
            $imagePath = $customer->image;
            
            // Delete customer record - associated user will be auto-deleted via cascade
            $customer->delete();
            
            // Delete associated files after customer is deleted
            if($imagePath) {
                $this->deleteFile($imagePath);
            }
            
            return $this->sendResponse(1, "customer deleted successfully");
            
        } catch (\Exception $e) {
            Log::error('Customer deletion error: ' . $e->getMessage());
            return $this->sendError("Error deleting customer", ['error' => $e->getMessage()]);
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