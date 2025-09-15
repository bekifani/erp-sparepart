<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Currency extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    
    public $fillable = ['code', 'name', 'symbol', 'is_active'];
    protected static $logAttributes = ['*'];
    public $guarded = [];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Get active currencies for dropdown
    public static function getActiveCurrencies()
    {
        return self::where('is_active', true)
                   ->orderBy('code')
                   ->get();
    }

    // Get currency codes for validation
    public static function getActiveCurrencyCodes()
    {
        return self::where('is_active', true)
                   ->pluck('code')
                   ->toArray();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "user has {$eventName} currency {$this->code}";
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("Currency");
    }
}
