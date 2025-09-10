<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Customer extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    
    public $fillable = [
        'name_surname', 
        'shipping_mark', 
        'country', 
        'address', 
        'email', 
        'phone_number', 
        'position', 
        'birth_date', 
        'whatsapp', 
        'wechat_id', 
        'image', 
        'additional_note',
        'is_active',
        'credit_limit',
        'payment_terms',
        'company_name',
        'contact_person',
        'tax_id',
        'price_adjustment_percent',
        'price_adjustment_type',
    ];
    
    protected static $logAttributes = ['*'];
    public $guarded = [];
    
    protected $casts = [
        'birth_date' => 'date',
        'is_active' => 'boolean',
        'credit_limit' => 'float',
        'price_adjustment_percent' => 'integer',
    ];

    public function getDescriptionForEvent(string $eventName): string
    {
        return "user has {$eventName} customer {$this->name_surname}";
    }
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("Customer");
    }

    public function user() 
    { 
        return $this->hasOne(User::class, 'customer_id', 'id');
    }
    
    /**
     * Get all product visibility rules for this customer
     */
    public function productVisibilityRules()
    {
        return $this->hasMany(Customerproductvisibilit::class, 'customer_id');
    }
    
    /**
     * Get all brand visibility rules for this customer
     */
    public function brandVisibilityRules()
    {
        return $this->hasMany(Customerbrandvisibilit::class, 'customer_id');
    }
    
    /**
     * Get all pricing rules for this customer
     */
    public function pricingRules()
    {
        return $this->hasMany(Productrule::class, 'customer_id');
    }
    
    /**
     * Check if a product is visible to this customer
     * 
     * @param Product|int $product The product or product ID to check
     * @return bool
     */
    public function canViewProduct($product): bool
    {
        $productId = $product instanceof Product ? $product->id : $product;
        
        // First check for product-specific visibility rule
        $productRule = $this->productVisibilityRules()
            ->where('product_id', $productId)
            ->first();
            
        if ($productRule) {
            return $productRule->visibility === 'allow';
        }
        
        // If no product-specific rule, check for brand visibility
        $productModel = $product instanceof Product ? $product : Product::find($productId);
        
        if ($productModel && $productModel->brand_id) {
            $brandRule = $this->brandVisibilityRules()
                ->where('brand_id', $productModel->brand_id)
                ->first();
                
            if ($brandRule) {
                return $brandRule->visibility === 'allow';
            }
        }
        
        // Default to visible if no rules exist
        return true;
    }
    
    /**
     * Get the adjusted price for a product based on customer's pricing rules
     * 
     * @param Product|int $product The product or product ID
     * @param float $originalPrice The original price to adjust
     * @return float The adjusted price
     */
    public function getAdjustedPrice($product, float $originalPrice): float
    {
        $productId = $product instanceof Product ? $product->id : $product;
        $productModel = $product instanceof Product ? $product : Product::find($productId);
        
        if (!$productModel) {
            return $originalPrice;
        }
        
        // Get all applicable pricing rules ordered by specificity (product > brand > global)
        $rules = $this->pricingRules()
            ->where(function($query) use ($productModel) {
                $query->whereNull('product_id')
                      ->orWhere('product_id', $productModel->id);
            })
            ->where(function($query) use ($productModel) {
                $query->whereNull('brand_id')
                      ->orWhere('brand_id', $productModel->brand_id);
            })
            ->orderBy('product_id', 'desc') // Product-specific first
            ->orderBy('brand_id', 'desc')   // Then brand-specific
            ->get();
        
        $adjustedPrice = $originalPrice;
        
        // Apply the most specific rule found
        if ($rule = $rules->first()) {
            $adjustment = $rule->adjustment;
            
            if ($rule->adjustment_type === 'percentage') {
                $adjustment = $originalPrice * ($adjustment / 100);
            }
            
            if ($rule->adjustment_direction === 'increase') {
                $adjustedPrice = $originalPrice + $adjustment;
            } else {
                $adjustedPrice = max(0, $originalPrice - $adjustment);
            }
            
            // Apply min/max price constraints if set
            if (!is_null($rule->min_price) && $adjustedPrice < $rule->min_price) {
                $adjustedPrice = $rule->min_price;
            }
            
            if (!is_null($rule->max_price) && $adjustedPrice > $rule->max_price) {
                $adjustedPrice = $rule->max_price;
            }
        }
        
        return $adjustedPrice;
    }
    
    /**
     * Apply the customer's global price adjustment to a base price.
     */
    public function applyGlobalPriceAdjustment(float $basePrice): float
    {
        $percent = $this->price_adjustment_percent;
        $type = $this->price_adjustment_type; // increase | decrease | null
        if ($percent === null || $percent === '' || $percent == 0 || !$type) {
            return $basePrice;
        }
        $delta = ($basePrice * ($percent / 100));
        if ($type === 'increase') {
            return $basePrice + $delta;
        }
        if ($type === 'decrease') {
            return max(0, $basePrice - $delta);
        }
        return $basePrice;
    }
}
