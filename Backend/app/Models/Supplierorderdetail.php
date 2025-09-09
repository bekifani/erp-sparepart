<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Supplierorderdetail extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['supplier_order_id', 'product_id', 'order_detail_id', 'qty', 'price', 'shipping_mark', 'arrival_time', 'box_name', 'purchase_price', 'extra_cost', 'amount', 'status_id', 'additional_note', 'image_url'];
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
            ->useLogName("Supplierorderdetail");
    }

 public function supplierorder() { 
 return $this->belongsTo(Supplierorder::class, 'supplier_order_id', 'id');
 }
 public function product() { 
 return $this->belongsTo(Product::class, 'product_id', 'id');
 }
 public function orderdetail() { 
 return $this->belongsTo(Orderdetail::class, 'order_detail_id', 'id');
 }
 public function productstatus() { 
 return $this->belongsTo(Productstatus::class, 'status_id', 'id');
 }
}
