<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Mail;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;
use Auth;
use Illuminate\Support\Facades\Hash;
class UserController extends BaseController
{
    protected $searchableColumns = ['name', 'email', 'phone', 'company_id'];

    public function all_user(){
        $user = User::all();
        return $this->sendResponse($user, '');
    }

    public function reset_user_password(Request $request){
        
        $request->validate([
            "password" => '',
            "user_id" => 'exists:users,id'
        ]);
        $user = User::find($request['user_id']);
        $user->password = bcrypt($request['password']);
        $user->save();
        return $this->sendResponse('password changed succesrully', '');
    }

    public function all_users(){
        return $this->sendResponse(User::select('id', 'name')->get(), '');
    }

    public function all_roles (){
        $roles = Role::all();
        return $this->sendResponse($roles, '');
    }

    public function index(Request $request)
    {
        $sortBy = 'id';
        $sortDir = 'desc';
        if($request['sorters']){
            $sortBy = $request['sorters'][0]['field'];
            $sortDir = $request['sorters'][0]['dir'];
        }
        $filters = $request['filter'];
        $query = User::orderBy($sortBy, $sortDir);
        $perPage = $request->query('size', 10); // Deault items per page
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
        $items = $query->with(['roles:name', 'employee', 'company'])->paginate($perPage);
        $roles = Role::all();
        $data = [
            "data" => $items->toArray(), 
            'current_page' => $items->currentPage(),
            'total_pages' => $items->lastPage(),
            'per_page' => $perPage,
            "roles" => $roles
        ];
        return response()->json($data);
    }

    public function change_password(Request $request){
        $validator = Validator::make($request->all(),[
            'current_password' => 'required|string|min:6',
            'new_password' => 'required|string|min:6',
        ]);
        if($validator->fails()){
            return $this->sendError('Invalid Input', $validator->errors());
        }
        $user = Auth::user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }
        $user->password = bcrypt($request->new_password);
        $user->save();
        return $this->sendResponse('password changed succesrully', '');
    }

    public function search(Request $request, $search_term){
        $field = $request->input('field');
        $oprator = $request->input('oprator');
        $searchTerm = $request->input('value');

        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }

        
        // if (empty($field) || empty($oprator) || empty($searchTerm)) {
        //     return response()->json([
        //         'message' => 'Please enter a search term.'
        //     ], 400);
        // }
        $results = User::where(function ($query) use ($searchTerm) {
           foreach ($searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        // $results = User::where($field, $oprator, $searchTerm)->paginate(20);
        return $this->sendResponse($results , 'search resutls for users');
    }


    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'nullable',
            'phone' => 'nullable',
            'email' => 'nullable|email',
            'password' => 'required|min:6',
            'roles' => 'array'
        ]);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $user->email_verified_at = now();
        $user->save();
        $user->assignRole($request['roles']);
        // send email to confirm they have been added to the system 
        if($user->email != null) {
            $user_email = $user->email;
            try {
                Mail::send('emails.password', ['token' => $password], function($message) use($user_email){
                    $message->to($user_email);
                    $message->subject( __('messages.Password_Reset_Email'));
                });
            } catch (Exeption $e)
            {}
        }
        if($user->phone != null) {
            SmsHelper::sendSms($user->phone, __('messages.your_password_rest_pin_is').$input['password']);
        }
        
        return $this->sendResponse($user, "user created succesfully");
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return $this->sendResponse($user, "");

        return response()->json([
            'user' => $user
        ], 200);
    }


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable',
            'email' => 'nullable|email',
            'phone' => 'nullable',
            'roles' => 'array',
        ]);

        $user->update($validated);
        $roles = [];
        foreach($validated['roles'] as $r){
            array_push($roles, $r);
        }
        $user->syncRoles($roles);
        return $this->sendResponse($user, "user updated succesfully");

    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return $this->sendResponse(1, "user deleted succesfully");
    }
}