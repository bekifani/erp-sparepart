<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Problem extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['problem_number', 'supplier_invoice_id', 'customer_invoice_id', 'user_id', 'problem_type', 'solution_type', 'status_id', 'refund_amount', 'internal_note', 'customer_note'];
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
            ->useLogName("Problem");
    }

 public function supplierinvoice() { 
 return $this->belongsTo(Supplierinvoice::class, 'supplier_invoice_id', 'id');
 }
 public function customerinvoice() { 
 return $this->belongsTo(Customerinvoice::class, 'customer_invoice_id', 'id');
 }
 public function user() { 
 return $this->belongsTo(User::class, 'user_id', 'id');
 }
 public function productstatus() { 
 return $this->belongsTo(Productstatus::class, 'status_id', 'id');
 }
}
