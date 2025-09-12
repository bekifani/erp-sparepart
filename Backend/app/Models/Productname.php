<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Productname extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['hs_code', 'name_az', 'description_en', 'name_ru', 'name_cn', 'category_id', 'product_name_code', 'additional_note', 'product_qty'];
    protected static $logAttributes = ['*'];
    public $guarded = [];

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
            ->useLogName("Productname");
    }

    public function category()
    {
        return $this->belongsTo(Categor::class, 'category_id', 'id');
    }

}
