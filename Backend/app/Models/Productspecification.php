<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Productspecification extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['product_id', 'headname_id', 'value'];
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
            ->useLogName("Productspecification");
    }

 public function product() { 
 return $this->belongsTo(Product::class, 'product_id', 'id');
 }
 public function specificationheadname() { 
 return $this->belongsTo(SpecificationHeadname::class, 'headname_id', 'id');
 }
}
