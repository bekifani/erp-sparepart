<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Orderdetail extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['order_id', 'product_id', 'unit_price', 'qty', 'line_total', 'arrival_time', 'status_id', 'additional_note'];
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
            ->useLogName("Orderdetail");
    }

 public function order() { 
 return $this->belongsTo(Order::class, 'order_id', 'id');
 }
 public function product() { 
 return $this->belongsTo(Product::class, 'product_id', 'id');
 }
 public function productstatus() { 
 return $this->belongsTo(Productstatus::class, 'status_id', 'id');
 }
}
