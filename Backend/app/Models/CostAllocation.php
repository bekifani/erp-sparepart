<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class CostAllocation extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'journal_line_id',
        'invoice_id',
        'allocation_amount',
        'allocation_percentage',
        'allocation_method',
        'description',
        'allocated_by'
    ];

    protected $casts = [
        'allocation_amount' => 'decimal:2',
        'allocation_percentage' => 'decimal:4',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("CostAllocation");
    }

    public function journalLine()
    {
        return $this->belongsTo(JournalLine::class);
    }

    public function allocatedBy()
    {
        return $this->belongsTo(User::class, 'allocated_by');
    }

    /**
     * Scope by allocation method
     */
    public function scopeByMethod($query, $method)
    {
        return $query->where('allocation_method', $method);
    }

    /**
     * Get total allocated amount for an invoice
     */
    public static function getTotalAllocatedForInvoice($invoiceId)
    {
        return static::where('invoice_id', $invoiceId)->sum('allocation_amount');
    }
}
