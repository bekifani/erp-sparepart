<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Customerinvoice extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['invoice_no', 'customer_id', 'company_name', 'customer_name', 'country', 'address', 'tax_id', 'phone_number', 'email', 'shipping_mark', 'shipped_date', 'language', 'total_qty', 'total_net_weight', 'total_gross_weight', 'total_volume', 'total_amount', 'discount', 'deposit', 'extra_expenses', 'customer_debt', 'balance', 'status', 'attached_file', 'created_by'];
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
            ->useLogName("Customerinvoice");
    }

 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }
 public function user() { 
 return $this->belongsTo(User::class, 'created_by', 'id');
 }
}
