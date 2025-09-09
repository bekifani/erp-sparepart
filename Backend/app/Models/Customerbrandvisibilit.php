<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Customerbrandvisibilit extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['customer_id', 'brand_id', 'visibility'];
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
            ->useLogName("Customerbrandvisibilit");
    }

 public function customer() { 
 return $this->belongsTo(Customer::class, 'customer_id', 'id');
 }
 public function brandname() { 
 return $this->belongsTo(Brandname::class, 'brand_id', 'id');
 }
}
