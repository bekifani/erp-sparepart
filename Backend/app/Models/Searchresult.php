<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Searchresult extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = [
        'user_id', 
        'customer_id', 
        'query_text', 
        'entity_type', 
        'entity_id',
        'search_type',
        'result_found',
        'search_timestamp',
        'user_type',
        'user_identifier'
    ];
    protected static $logAttributes = ['*'];
    public $guarded = [];

    protected $casts = [
        'result_found' => 'boolean',
        'search_timestamp' => 'datetime',
    ];

    public function getDescriptionForEvent(string $eventName): string
    {
        //$user = Auth::user()->name;
        //return "{$user} has {$eventName} user {$this->name}";

        return "user has {$eventName} user {$this->name}";
    }
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("Searchresult");
    }

 public function user() { 
 return $this->belongsTo(User::class, 'user_id', 'id');
 }
 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }

 // Helper method to get user display name based on user type
 public function getUserDisplayAttribute()
 {
     switch ($this->user_type) {
         case 'guest':
             return 'Guest';
         case 'customer':
             return $this->customer ? $this->customer->name_surname : ($this->user_identifier ?: 'Unknown Customer');
         case 'employee':
             return $this->user ? $this->user->name : ($this->user_identifier ?: 'Unknown Employee');
         default:
             return 'Unknown';
     }
 }

 // Helper method to get search type display name
 public function getSearchTypeDisplayAttribute()
 {
     $types = [
         'category' => 'By Category',
         'car_model' => 'By Car Model', 
         'description' => 'By Description (Product Name)',
         'code' => 'By Code (Brand Code, OE Code, or Cross Code)'
     ];
     
     return $types[$this->search_type] ?? $this->search_type;
 }

 // Helper method to get result display
 public function getResultDisplayAttribute()
 {
     return $this->result_found ? 'Yes' : 'No';
 }
}
