<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Basketitem extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['basket_id', 'product_id', 'brand', 'brand_code', 'oe_code', 'description', 'unit_price', 'file_id', 'qty', 'line_total', 'weight_per_unit', 'volume_per_unit'];
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
            ->useLogName("Basketitem");
    }

 public function basket() { 
 return $this->belongsTo(Basket::class, 'basket_id', 'id');
 }
 public function product() { 
 return $this->belongsTo(Product::class, 'product_id', 'id');
 }
 public function basketfile() { 
 return $this->belongsTo(Basketfile::class, 'file_id', 'id');
 }
}
