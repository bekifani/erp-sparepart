<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class LedgerAccount extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'code',
        'name',
        'name_ru',
        'name_az',
        'name_ch',
        'ledger_type',
        'account_class',
        'is_contra',
        'parent_id',
        'is_active',
        'description'
    ];

    protected $casts = [
        'is_contra' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("LedgerAccount");
    }

    public function parent()
    {
        return $this->belongsTo(LedgerAccount::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(LedgerAccount::class, 'parent_id');
    }

    public function journalLines()
    {
        return $this->hasMany(JournalLine::class);
    }

    public function balances()
    {
        return $this->hasMany(Balance::class);
    }

    /**
     * Get localized name based on locale
     */
    public function getLocalizedName($locale = 'en')
    {
        switch ($locale) {
            case 'ru':
                return $this->name_ru ?: $this->name;
            case 'az':
                return $this->name_az ?: $this->name;
            case 'ch':
                return $this->name_ch ?: $this->name;
            default:
                return $this->name;
        }
    }

    /**
     * Scope for active accounts only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by ledger type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('ledger_type', $type);
    }

    /**
     * Scope by account class
     */
    public function scopeByClass($query, $class)
    {
        return $query->where('account_class', $class);
    }

    /**
     * Check if account is a debit account (assets, expenses)
     */
    public function isDebitAccount(): bool
    {
        return in_array($this->account_class, ['asset', 'expense']);
    }

    /**
     * Check if account is a credit account (liabilities, equity, revenue)
     */
    public function isCreditAccount(): bool
    {
        return in_array($this->account_class, ['liability', 'equity', 'revenue']);
    }
}
