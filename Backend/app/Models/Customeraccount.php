<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Customeraccount extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['trans_number', 'user_id', 'amount', 'invoice_number', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance'];
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
            ->useLogName("Customeraccount");
    }

 public function user() { 
 return $this->belongsTo(User::class, 'user_id', 'id');
 }
 public function accounttype() { 
 return $this->belongsTo(Accounttype::class, 'account_type_id', 'id');
 }
 public function paymentnote() { 
 return $this->belongsTo(Paymentnote::class, 'payment_note_id', 'id');
 }
}
