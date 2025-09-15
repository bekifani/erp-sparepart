<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Product extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['supplier_id', 'brand_id', 'brand_code', 'oe_code', 'description', 'product_name_id', 'qty', 'min_qty', 'purchase_price', 'extra_cost', 'cost_basis', 'selling_price', 'additional_note', 'status'];
    protected static $logAttributes = ['*'];
    public $guarded = [];

    public function getDescriptionForEvent(string $eventName): string
    {
        return "user has {$eventName} user {$this->name}";
    }
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("Product");
    }

    public function ProductInformation()
    {
        // New relationship: product_information has product_id foreign key pointing to products.id
        return $this->hasOne(ProductInformation::class, 'product_id', 'id');
    }

    public function productName()
    {
        return $this->belongsTo(Productname::class, 'product_name_id', 'id');
    }

    public function supplier() { 
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function brand()
    {
        return $this->belongsTo(Brandname::class, 'brand_id', 'id');
    }

    public function categor()
    {
        return $this->belongsTo(Categor::class, 'category_id', 'id');
    }


    public function productspecifications()
    {
        return $this->hasMany(Productspecification::class, 'product_id', 'id');
    }

    public function crosscars()
    {
        return $this->hasMany(Crosscar::class, 'product_id', 'id');
    }

    public function crosscodes()
    {
        return $this->hasMany(Crosscode::class, 'product_id', 'id');
    }
}
