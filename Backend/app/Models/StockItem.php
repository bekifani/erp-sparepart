<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class StockItem extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    protected $fillable = [
        'user_id',
        'supplier_id',
        'supplier_code',
        'brand_id',
        'brand_code',
        'oe_code',
        'description',
        'unit_type',
        'qty',
        'min_qty',
        'purchase_price',
        'extra_cost',
        'cost_basis',
        'amount',
        'status',
        'note',
    ];

    protected static $logAttributes = ['*'];
    public $guarded = [];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brandname::class, 'brand_id', 'id');
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
            ->useLogName("StockItem");
    }
}
