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
    public $fillable = ['product_id', 'product_name_id', 'product_code', 'brand_code', 'oe_code', 'description', 'qty', 'net_weight', 'gross_weight', 'unit_id', 'box_id', 'box_type', 'product_size_a', 'product_size_b', 'product_size_c', 'volume', 'label_id', 'qr_code', 'properties', 'technical_image', 'image', 'pictures', 'size_mode', 'additional_note'];
    protected static $logAttributes = ['*'];
    public $guarded = [];
    
    protected $casts = [
        'pictures' => 'array',
        'qty' => 'decimal:2',
        'net_weight' => 'decimal:2',
        'gross_weight' => 'decimal:2',
        'volume' => 'decimal:6',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            // Auto-generate product_code if not provided
            if (empty($model->product_code)) {
                $model->product_code = 'PI-' . ($model->product_id ?? 'X') . '-' . time();
            }
        });

        static::created(function ($model) {
            // Auto-generate QR code after creation
            try {
                $product = \App\Models\Product::find($model->product_id);
                if ($product) {
                    $qrPath = \App\Services\QRCodeService::generateProductQR([
                        'product_id' => $product->id,
                        'brand_code' => $product->brand_code ?? '',
                        'oe_code' => $product->oe_code ?? '',
                        'product_link' => url("/product/{$product->id}"),
                    ]);
                    $model->update(['qr_code' => $qrPath]);
                }
            } catch (\Exception $e) {
                \Log::error('QR Code generation failed in model boot: ' . $e->getMessage());
            }
        });
    }

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
 return $this->belongsTo(Productname::class, 'product_name_id', 'id');
 }
 public function brandname() { 
 return $this->belongsTo(Brandname::class, 'brand_code', 'brand_code');
 }
 public function unit() { 
 return $this->belongsTo(Unit::class, 'unit_id', 'id');
 }
 public function box() { 
 return $this->belongsTo(Boxe::class, 'box_id', 'id');
 }
 public function label() { 
 return $this->belongsTo(Label::class, 'label_id', 'id');
 }

 public function product()
 {
     return $this->belongsTo(Product::class, 'product_id', 'id');
 }
}
