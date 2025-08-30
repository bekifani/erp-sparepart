<?php

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use App\Models\User;
class ActivityController extends BaseController
{
    public function getActivities(Request $request){
            $sortBy = 'id';
             $sortDir = 'desc';
             if($request['sorters']){
                 $sortBy = $request['sorters'][0]['field'];
                 $sortDir = $request['sorters'][0]['dir'];
             }
             $perPage = $request->query('size', 20); // Deault items per page
             if($request['filters']){
                 $field = $request['filters'][0]['field'];
                 $oprator =  $request['filters'][0]['type'];
                 $searchTerm = $request['filters'][0]['value'];
                 $activity = Activity::with('causer')->orderBy($sortBy, $sortDir)->where($field, $oprator, $searchTerm)->paginate($perPage);
             }
             else {
                 $activity = Activity::with('causer')->orderBy($sortBy, $sortDir)->paginate($perPage);
             }

             $user = User::all();
             
             $data = [
                 "data" => $activity->toArray(), 
                 'current_page' => $activity->currentPage(),
                 'total_pages' => $activity->lastPage(),
                 'per_page' => $perPage,
                 'users' => $user
             ];
             return response()->json($data);
    }
}
