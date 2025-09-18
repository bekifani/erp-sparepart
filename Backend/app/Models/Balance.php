<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Balance extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'ledger_account_id',
        'account_type_id',
        'reference_id',
        'current_balance',
        'debit_total',
        'credit_total',
        'last_transaction_date'
    ];

    protected $casts = [
        'current_balance' => 'decimal:2',
        'debit_total' => 'decimal:2',
        'credit_total' => 'decimal:2',
        'last_transaction_date' => 'datetime',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("Balance");
    }

    public function ledgerAccount()
    {
        return $this->belongsTo(LedgerAccount::class);
    }

    public function accountType()
    {
        return $this->belongsTo(Accounttype::class);
    }

    /**
     * Update balance with new transaction amounts
     */
    public function updateBalance(float $debitAmount = 0, float $creditAmount = 0): void
    {
        $this->debit_total += $debitAmount;
        $this->credit_total += $creditAmount;
        
        // Calculate current balance based on account type
        if ($this->ledgerAccount && $this->ledgerAccount->isDebitAccount()) {
            // For debit accounts (assets, expenses): debits increase, credits decrease
            $this->current_balance = $this->debit_total - $this->credit_total;
        } else {
            // For credit accounts (liabilities, equity, revenue): credits increase, debits decrease
            $this->current_balance = $this->credit_total - $this->debit_total;
        }
        
        $this->last_transaction_date = now();
        $this->save();
    }

    /**
     * Reverse balance with transaction amounts
     */
    public function reverseBalance(float $debitAmount = 0, float $creditAmount = 0): void
    {
        $this->debit_total -= $debitAmount;
        $this->credit_total -= $creditAmount;
        
        // Recalculate current balance
        if ($this->ledgerAccount && $this->ledgerAccount->isDebitAccount()) {
            $this->current_balance = $this->debit_total - $this->credit_total;
        } else {
            $this->current_balance = $this->credit_total - $this->debit_total;
        }
        
        $this->last_transaction_date = now();
        $this->save();
    }

    /**
     * Get running balance at specific date
     */
    public static function getRunningBalance($ledgerAccountId, $accountTypeId = null, $referenceId = null, $asOfDate = null)
    {
        $query = static::where('ledger_account_id', $ledgerAccountId);
        
        if ($accountTypeId) {
            $query->where('account_type_id', $accountTypeId);
        }
        
        if ($referenceId) {
            $query->where('reference_id', $referenceId);
        }
        
        if ($asOfDate) {
            $query->where('last_transaction_date', '<=', $asOfDate);
        }
        
        return $query->first();
    }
}
