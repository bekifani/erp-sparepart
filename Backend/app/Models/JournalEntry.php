<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class JournalEntry extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'trans_number',
        'date',
        'source_table',
        'user_id',
        'description',
        'status',
        'reversed_by'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("JournalEntry");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function journalLines()
    {
        return $this->hasMany(JournalLine::class);
    }

    public function reversedBy()
    {
        return $this->belongsTo(JournalEntry::class, 'reversed_by');
    }

    public function reversals()
    {
        return $this->hasMany(JournalEntry::class, 'reversed_by');
    }

    /**
     * Check if journal entry is balanced (debits = credits)
     */
    public function isBalanced(): bool
    {
        $totalDebits = $this->journalLines()->sum('debit');
        $totalCredits = $this->journalLines()->sum('credit');
        
        return abs($totalDebits - $totalCredits) < 0.01; // Allow for minor rounding differences
    }

    /**
     * Get total debits for this entry
     */
    public function getTotalDebits(): float
    {
        return $this->journalLines()->sum('debit');
    }

    /**
     * Get total credits for this entry
     */
    public function getTotalCredits(): float
    {
        return $this->journalLines()->sum('credit');
    }

    /**
     * Scope for posted entries only
     */
    public function scopePosted($query)
    {
        return $query->where('status', 'posted');
    }

    /**
     * Scope for entries within date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
