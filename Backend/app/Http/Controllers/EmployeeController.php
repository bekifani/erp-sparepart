<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use DB;
use App\Helpers\SmsHelper;
use Mail;
class EmployeeController extends BaseController
{
    protected $searchableColumns = ['photo', 'first_name', 'last_name', 'position', 'email', 'phone', 'whatsapp', 'wechat', 'birthdate', 'salary', 'hire_date', 'is_active', 'note'];

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
        $query = Employee::orderBy($sortBy, $sortDir);
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
        $employee = $query->paginate($perPage); 
        $data = [
            "data" => $employee->toArray(), 
            'current_page' => $employee->currentPage(),
            'total_pages' => $employee->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_employees(){
        $data = Employee::all();
        return $this->sendResponse($data, 1);
    }
    
    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Employee::select(
            'id',
            DB::raw("CONCAT(first_name, ' ', last_name, ' - ', email) as name")
        )
        ->where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for employee');
    }


    public function store(Request $request)
    {
        // Debug: Log the incoming request data
        \Log::info('Employee Store Request Data:', $request->all());
        
        $validationRules = [
          "photo"=>"required",
          "first_name"=>"required|string|max:255",
          "last_name"=>"required|string|max:255",
          "position"=>"nullable|string|max:255",
          "email"=>"nullable|email|unique:employees,email",
          "phone"=>"required|string",
          "whatsapp"=>"nullable|string",
          "wechat"=>"nullable|string",
          "birthdate"=>"nullable|date",
          "salary"=>"nullable|numeric",
          "hire_date"=>"required|date",
          "is_active"=>"required|boolean",
          "note"=>"nullable|string",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            \Log::error('Employee Validation Failed:', $validation->errors()->toArray());
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();
        
        // Convert date formats from ISO to MySQL date format
        if (isset($validated['birthdate']) && $validated['birthdate']) {
            $validated['birthdate'] = date('Y-m-d', strtotime($validated['birthdate']));
        }
        if (isset($validated['hire_date']) && $validated['hire_date']) {
            $validated['hire_date'] = date('Y-m-d', strtotime($validated['hire_date']));
        }
        
        try {
            $employee = Employee::create($validated);
            \Log::info('Employee created successfully:', ['id' => $employee->id]);
            
            // create user here 
            $password = rand(10000, 99999);
            $user_data = [
                "name" => $employee->first_name . ' ' . $employee->last_name,
                "email" => $employee->email,
                "phone" => $employee->phone, 
                "type" => "Employee",
                "employee_id" => $employee->id,
                "email_verified_at" => now(),
                "phone_verified_at" => now(),
                "password" => bcrypt(strval($password))
            ];
            
            \Log::info('Creating user with data:', $user_data);
            User::create($user_data);
            \Log::info('User created successfully');
        } catch (\Exception $e) {
            \Log::error('Employee creation failed:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return $this->sendError("Employee creation failed", ['error' => $e->getMessage()]);
        }
        // Send SMS Or Email
        if($employee->email != null) {
            $user_email = $employee->email;
            try {
                Mail::send('emails.password', ['token' => $password], function($message) use($user_email){
                    $message->to($user_email);
                    $message->subject("Your NIBDET Password");
                });
            } catch (Exeption $e)
            {}
        }
        if($employee->phone != null) {
            // SmsHelper::sendSms($employee->phone, __('messages.your_password_rest_pin_is').$password);
        }
        return $this->sendResponse($employee, "employee created succesfully");
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return $this->sendResponse($employee, "");
    }


    public function update(Request $request, $id)
    {
        // Debug: Log the incoming request data and ID
        \Log::info('Employee Update Request:', ['id' => $id, 'data' => $request->all()]);
        
        $employee = Employee::findOrFail($id);
        \Log::info('Employee found for update:', ['employee_id' => $employee->id]);
        
         $validationRules = [
            //for update
          "photo"=>"nullable",
          "first_name"=>"required|string|max:255",
          "last_name"=>"required|string|max:255",
          "position"=>"nullable|string|max:255",
          "email"=>"nullable|email|unique:employees,email,".$employee->id,
          "phone"=>"required|string",
          "whatsapp"=>"nullable|string",
          "wechat"=>"nullable|string",
          "birthdate"=>"nullable|date",
          "salary"=>"nullable|numeric",
          "hire_date"=>"required|date",
          "is_active"=>"required|boolean",
          "note"=>"nullable|string",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            \Log::error('Employee Update Validation Failed:', $validation->errors()->toArray());
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();
        \Log::info('Employee Update Validation Passed:', $validated);
        
        // Convert date formats from ISO to MySQL date format
        if (isset($validated['birthdate']) && $validated['birthdate']) {
            $validated['birthdate'] = date('Y-m-d', strtotime($validated['birthdate']));
        }
        if (isset($validated['hire_date']) && $validated['hire_date']) {
            $validated['hire_date'] = date('Y-m-d', strtotime($validated['hire_date']));
        }

        //file uploads update

        try {
            $employee->update($validated);
            \Log::info('Employee updated successfully:', ['employee_id' => $employee->id]);
            return $this->sendResponse($employee, "employee updated successfully");
        } catch (\Exception $e) {
            \Log::error('Employee update failed:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return $this->sendError("Employee update failed", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();



$this->deleteFile($employee->photo);

        //delete files uploaded
        return $this->sendResponse(1, "employee deleted succesfully");
    }

    public function terminate(Request $request, $id){
        $employee = Employee::find($id);
        $employee->is_active = false;
        $employee->save();
        return $this->sendResponse(1, ''); 
    }

    public function activate_account(Request $request, $id){
        $employee = Employee::find($id);
        $employee->is_active = true;
        $employee->save();
        return $this->sendResponse(1, '');
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
