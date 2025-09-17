<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerSpecialPrice extends Model
{
    use HasFactory;

    protected $table = 'customer_special_prices';

    protected $fillable = [
        'customer_id',
        'product_id',
        'min_qty',
        'price',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'min_qty' => 'integer',
        'price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the customer that owns the special price.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the product that owns the special price.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope to filter by customer.
     */
    public function scopeForCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Scope to filter by product.
     */
    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Scope to filter by minimum quantity.
     */
    public function scopeForQuantity($query, $quantity)
    {
        return $query->where('min_qty', '<=', $quantity);
    }
}
