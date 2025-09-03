<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;

class Boxe extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    public $fillable = ['brand', 'box_name', 'material', 'stock_qty', 'order_qty', 'price', 'size_a', 'size_b', 'size_c', 'volume', 'label', 'image', 'design_file', 'additional_note', 'operation_mode', 'is_factory_supplied'];
    protected static $logAttributes = ['*'];
    public $guarded = [];

    // Relationship with labels
    public function labelRelation()
    {
        return $this->belongsTo(Label::class, 'label_id');
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
            ->useLogName("Boxe");
    }

}
