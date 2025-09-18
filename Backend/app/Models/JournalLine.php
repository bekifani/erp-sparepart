<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class JournalLine extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'journal_entry_id',
        'account_type_id',
        'ledger_account_id',
        'payment_note_id',
        'debit',
        'credit',
        'currency',
        'exchange_rate',
        'invoice_number',
        'picture_url',
        'metadata',
        'description'
    ];

    protected $casts = [
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
        'exchange_rate' => 'decimal:6',
        'metadata' => 'json',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("JournalLine");
    }

    public function journalEntry()
    {
        return $this->belongsTo(JournalEntry::class);
    }

    public function accountType()
    {
        return $this->belongsTo(Accounttype::class);
    }

    public function ledgerAccount()
    {
        return $this->belongsTo(LedgerAccount::class);
    }

    public function paymentNote()
    {
        return $this->belongsTo(Paymentnote::class);
    }

    /**
     * Get the amount (debit or credit)
     */
    public function getAmount(): float
    {
        return $this->debit ?: $this->credit;
    }

    /**
     * Check if this is a debit line
     */
    public function isDebit(): bool
    {
        return $this->debit > 0;
    }

    /**
     * Check if this is a credit line
     */
    public function isCredit(): bool
    {
        return $this->credit > 0;
    }

    /**
     * Get amount in base currency (RMB)
     */
    public function getBaseAmount(): float
    {
        $amount = $this->getAmount();
        
        if ($this->currency === 'RMB' || !$this->exchange_rate) {
            return $amount;
        }
        
        return $amount / $this->exchange_rate;
    }

    /**
     * Scope for debit lines only
     */
    public function scopeDebits($query)
    {
        return $query->where('debit', '>', 0);
    }

    /**
     * Scope for credit lines only
     */
    public function scopeCredits($query)
    {
        return $query->where('credit', '>', 0);
    }
}
