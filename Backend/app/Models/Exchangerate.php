<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Exchangerate extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['date', 'currency', 'rate', 'base_currency'];
    protected static $logAttributes = ['*'];
    public $guarded = [];
    
    protected $casts = [
        'date' => 'date',
        'rate' => 'decimal:6',
    ];
    
    // Get the latest exchange rate for a specific currency
    public static function getLatestRate($currency)
    {
        return self::where('currency', $currency)
                   ->where('base_currency', 'RMB')
                   ->orderBy('date', 'desc')
                   ->first();
    }
    
    // Convert amount from RMB to target currency
    public static function convertFromRMB($amount, $targetCurrency)
    {
        $rate = self::getLatestRate($targetCurrency);
        if (!$rate) {
            return null;
        }
        return $amount * $rate->rate;
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
            ->useLogName("Exchangerate");
    }

}
