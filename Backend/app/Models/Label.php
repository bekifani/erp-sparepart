<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Label extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['brand', 'label_name', 'price', 'stock_qty', 'order_qty', 'labels_size_a', 'labels_size_b', 'image', 'design_file', 'additional_note', 'operation_mode'];
    protected static $logAttributes = ['*'];
    public $guarded = [];

    // Relationship with boxes (based on label name matching)
    public function boxes()
    {
        return $this->hasMany(Boxe::class, 'label', 'label_name');
    }

    // Relationship with brandnames
    public function brandname()
    {
        return $this->belongsTo(Brandname::class, 'brand', 'id');
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
            ->useLogName("Label");
    }

}
