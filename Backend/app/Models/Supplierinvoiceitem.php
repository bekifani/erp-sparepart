<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Supplierinvoiceitem extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['supplier_invoice_id', 'product_id', 'supplier_code', 'brand', 'brand_code', 'oe_code', 'description', 'qty', 'box_name', 'purchase_price', 'extra_cost', 'amount', 'additional_note', 'status'];
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
            ->useLogName("Supplierinvoiceitem");
    }

 public function supplierinvoice() { 
 return $this->belongsTo(Supplierinvoice::class, 'supplier_invoice_id', 'id');
 }
 public function product() { 
 return $this->belongsTo(Product::class, 'product_id', 'id');
 }
}
