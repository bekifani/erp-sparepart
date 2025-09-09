<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Producthistor extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['date', 'product_id', 'customer_id'];
    protected static $logAttributes = ['*'];
    public $guarded = [];

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
            ->useLogName("Producthistor");
    }

 public function product() { 
 return $this->belongsTo(Product::class, 'product_id', 'id');
 }
 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }
}
