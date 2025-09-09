<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Packagin extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['order_id', 'shipping_mark', 'invoice_no', 'qty', 'net_weight', 'total_weight', 'total_volume', 'number_of_boxes', 'order_date', 'status_id', 'internal_note', 'customer_note'];
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
            ->useLogName("Packagin");
    }

 public function order() { 
 return $this->belongsTo(Order::class, 'order_id', 'id');
 }
 public function productstatus() { 
 return $this->belongsTo(Productstatus::class, 'status_id', 'id');
 }
}
