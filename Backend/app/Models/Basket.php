<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Basket extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['basket_number', 'customer_id', 'total_qty', 'total_weight', 'total_volume', 'total_amount', 'invoice_language', 'status', 'first_edit_date', 'last_edit_date', 'additional_note'];
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
            ->useLogName("Basket");
    }

 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }
}
