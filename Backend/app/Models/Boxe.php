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
    public $fillable = ['brand', 'box_name', 'material', 'stock_qty', 'order_qty', 'price', 'size_a', 'size_b', 'size_c', 'volume', 'label', 'image', 'design_file', 'additional_note', 'operation_mode', 'package_type'];
    protected static $logAttributes = ['*'];
    public $guarded = [];

    // Relationship with labels (based on label name matching)
    public function labelRelation()
    {
        return $this->belongsTo(Label::class, 'label', 'label_name');
    }

    // Relationship with brands (based on brand name matching)
    public function brandRelation()
    {
        return $this->belongsTo(Brandname::class, 'brand', 'brand_name');
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
