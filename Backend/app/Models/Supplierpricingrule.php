<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Supplierpricingrule extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['supplier_id', 'adjustment_percent', 'adjustment_type', 'scope', 'active', 'valid_from', 'valid_to'];
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
            ->useLogName("Supplierpricingrule");
    }

 public function supplier() { 
 return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
 }
}
