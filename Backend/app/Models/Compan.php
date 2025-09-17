<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Compan extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = [
        'logo', 
        'company_name', 
        'trading_name',
        'website', 
        'address', 
        'street_address',
        'city',
        'state_region',
        'postal_code',
        'country',
        'email', 
        'phone_number', 
        'mobile_number',
        'our_ref', 
        'origin', 
        'payment_terms', 
        'shipping_terms', 
        'tax_id', 
        'vat_number',
        'business_registration_number',
        'bank_details', 
        'additional_note'
    ];
    protected static $logAttributes = ['*'];
    public $guarded = [];

    public function getDescriptionForEvent(string $eventName): string
    {
        //$user = Auth::user()->name;
        //return "{$user} has {$eventName} user {$this->name}";

        return "user has {$eventName} user {$this->company_name}";
    }
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("Compan");
    }

}
