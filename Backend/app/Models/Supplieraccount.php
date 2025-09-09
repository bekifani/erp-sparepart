<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Supplieraccount extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['date', 'transaction_number', 'invoice_id', 'user_id', 'supplier_id', 'amount', 'invoice', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance'];
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
            ->useLogName("Supplieraccount");
    }

 public function supplierinvoice() { 
 return $this->belongsTo(Supplierinvoice::class, 'invoice_id', 'id');
 }
 public function user() { 
 return $this->belongsTo(User::class, 'user_id', 'id');
 }
 public function supplier() { 
 return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
 }
 public function accounttype() { 
 return $this->belongsTo(Accounttype::class, 'account_type_id', 'id');
 }
 public function paymentnote() { 
 return $this->belongsTo(Paymentnote::class, 'payment_note_id', 'id');
 }
}
