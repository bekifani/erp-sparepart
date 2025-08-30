<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class ProductInformation extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['product_name_id', 'product_code', 'brand_code', 'oe_code', 'description', 'net_weight', 'gross_weight', 'unit_id', 'box_id', 'product_size_a', 'product_size_b', 'product_size_c', 'volume', 'label_id', 'qr_code', 'properties', 'technical_image', 'image', 'size_mode', 'additional_note'];
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
            ->useLogName("ProductInformation");
    }

 public function productname() { 
 return $this->belongsTo(ProductName::class, 'product_name_id', 'id');
 }
 public function brandname() { 
 return $this->belongsTo(BrandName::class, 'brand_code', 'id');
 }
 public function unit() { 
 return $this->belongsTo(Unit::class, 'unit_id', 'id');
 }
 public function box() { 
 return $this->belongsTo(Box::class, 'box_id', 'id');
 }
 public function label() { 
 return $this->belongsTo(Label::class, 'label_id', 'id');
 }
}
