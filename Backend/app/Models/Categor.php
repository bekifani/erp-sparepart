<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;
use App\Models\Productname;

class Categor extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['category_en', 'category_ru', 'category_cn', 'category_az', 'category_code'];
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
            ->useLogName("Categor");
    }

    // Relationship to count related products
    public function productnames()
    {
        return $this->hasMany(Productname::class, 'category_id');
    }
}
