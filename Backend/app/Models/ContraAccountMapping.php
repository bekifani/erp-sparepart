<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ContraAccountMapping extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'account_type_id',
        'payment_note_id',
        'transaction_type',
        'contra_ledger_account_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("ContraAccountMapping");
    }

    public function accountType()
    {
        return $this->belongsTo(Accounttype::class);
    }

    public function paymentNote()
    {
        return $this->belongsTo(Paymentnote::class);
    }

    public function contraLedgerAccount()
    {
        return $this->belongsTo(LedgerAccount::class, 'contra_ledger_account_id');
    }

    /**
     * Find contra account mapping for given criteria
     */
    public static function findMapping($accountTypeId, $paymentNoteId = null, $transactionType = null)
    {
        $query = static::where('account_type_id', $accountTypeId)
                      ->where('is_active', true);
        
        if ($paymentNoteId) {
            $query->where('payment_note_id', $paymentNoteId);
        }
        
        if ($transactionType) {
            $query->where('transaction_type', $transactionType);
        }
        
        return $query->first();
    }

    /**
     * Scope for active mappings only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
