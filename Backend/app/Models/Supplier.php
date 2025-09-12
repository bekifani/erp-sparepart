<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;
use App\Models\Product;
use App\Models\SupplierImage;

class Supplier extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['supplier', 'name_surname', 'occupation', 'code', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'image', 'additional_note', 'price_adjustment_type', 'price_adjustment_percent'];
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
            ->useLogName("Supplier");
    }

    // A supplier has many products
    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id', 'id');
    }
    public function images()
{
    return $this->hasMany(SupplierImage::class, 'supplier_id', 'id');
}
}
