<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Supplierorder extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['supplier_invoice_no', 'supplier_id', 'order_date', 'expected_date', 'shipping_date', 'order_period', 'arrival_time', 'qty', 'amount', 'discount', 'extra_expenses', 'status_id', 'internal_note', 'customer_note'];
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
            ->useLogName("Supplierorder");
    }

 public function supplier() { 
 return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
 }
 public function productstatus() { 
 return $this->belongsTo(Productstatus::class, 'status_id', 'id');
 }
}
