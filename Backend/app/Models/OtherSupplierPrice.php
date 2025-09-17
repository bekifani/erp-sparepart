<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtherSupplierPrice extends Model
{
    use HasFactory;

    protected $table = 'other_supplier_prices';

    protected $fillable = [
        'supplier_id',
        'product_id',
        'purchase_price',
        'extra_cost',
        'supplier_position',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'extra_cost' => 'decimal:2',
        'supplier_position' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the supplier that owns the price.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the product that owns the price.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope to order by supplier position.
     */
    public function scopeOrderByPosition($query)
    {
        return $query->orderBy('supplier_position');
    }

    /**
     * Scope to filter by product.
     */
    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Scope to filter by supplier.
     */
    public function scopeForSupplier($query, $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }
}
