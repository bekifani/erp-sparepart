<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\BaseController;

class RoleController extends BaseController
{
    public function index(Request $request)
    {
        $sortBy = 'id';
        $sortDir = 'asc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Role::with('permissions')->orderBy($sortBy, $sortDir);
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
        $item = $query->get(); 
        $data = [
            "data" => $item->toArray(), 
            'permissions' => Permission::all(),
        ];
        return response()->json($data);
    }
    // public function index(){
        
    //     $roles = Role::with('permissions')->get();
    //     // $permissions = Permission::all();
    //     $data = [
    //         "roles" => $roles, 
    //         "permissions" => $permissions
    //     ];
    //     return $this->sendResponse($data, '');
    // }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required',
            'permissions' => 'array',
            'permissions.*' => 'numeric|max:255'
        ]);
        $role = Role::create([
            "name" => $validated['name'],
            "guard_name" => "api"
        ]);
        $role->syncPermissions($validated['permissions']);
        return $this->sendResponse($role, '');
    }

    public function update(Request $request, $id){
        $role = Role::find($id);
        $validated = $request->validate([
            'name' => 'required',
            'permissions' => 'array',
            'permissions.*' => 'numeric'
        ]);
        $role->name = $validated['name'];
        $role->save();
        $role->syncPermissions($validated['permissions']);
        return $this->sendResponse($role, '');
    }

    public function destroy($id) {
        $role = Role::find($id);
        $role->delete();
        return $this->sendResponse('', 'Role Deleted');
    }
}
