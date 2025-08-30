<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Customer extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['name_surname', 'shipping_mark', 'user_id', 'country', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'image', 'additional_note'];
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
            ->useLogName("Customer");
    }

 public function user() { 
 return $this->belongsTo(User::class, 'user_id', 'id');
 }
}
