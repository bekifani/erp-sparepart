<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Supplierinvoice extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['invoice_no', 'supplier_id', 'customer_id', 'user_id', 'arrival_time', 'shipping_date', 'shipped_date', 'shipping_mark', 'supplier_code', 'total_products_qty', 'total_qty', 'total_amount', 'total_weight', 'total_volume', 'total_ctn', 'discount', 'deposit', 'extra_expenses', 'supplier_debt', 'balance', 'additional_note', 'status'];
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
            ->useLogName("Supplierinvoice");
    }

 public function supplier() { 
 return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
 }
 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }
 public function user() { 
 return $this->belongsTo(User::class, 'user_id', 'id');
 }
}
