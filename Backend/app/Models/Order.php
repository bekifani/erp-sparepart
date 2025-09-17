<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Order extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['customer_id', 'invoice_no', 'total_qty', 'total_weight', 'total_volume', 'subtotal', 'discount', 'extra_expenses', 'total_amount', 'deposit', 'customer_debt', 'balance', 'order_date', 'expected_date', 'shipping_date', 'status_id', 'invoice_language', 'company_id', 'internal_note', 'customer_note'];
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
            ->useLogName("Order");
    }

 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }
 public function productstatus() { 
 return $this->belongsTo(Productstatus::class, 'status_id', 'id');
 }
 public function compan() { 
 return $this->belongsTo(Compan::class, 'company_id', 'id');
 }
 public function orderDetails() { 
 return $this->hasMany(Orderdetail::class, 'order_id', 'id');
 }
 public function user() { 
 return $this->belongsTo(User::class, 'created_by', 'id');
 }
}
