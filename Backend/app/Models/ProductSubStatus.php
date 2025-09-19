<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSubStatus extends Model
{
    use HasFactory, LogsActivity, Notifiable;
    
    protected $fillable = [
        'parent_status_id',
        'sub_status_key',
        'status_name_en',
        'status_name_ch',
        'status_name_az',
        'description_en',
        'description_ch',
        'description_az',
        'is_active',
        'sort_order',
        'rules',
        'color_code'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'rules' => 'array'
    ];
    
    protected static $logAttributes = ['*'];
    public $guarded = [];

    /**
     * Get the parent status that this sub-status belongs to
     */
    public function parentStatus(): BelongsTo
    {
        return $this->belongsTo(Productstatus::class, 'parent_status_id');
    }

    /**
     * Get localized status name based on current locale
     */
    public function getLocalizedNameAttribute(): string
    {
        $locale = app()->getLocale();
        
        switch ($locale) {
            case 'zh':
                return $this->status_name_ch ?? $this->status_name_en;
            case 'az':
                return $this->status_name_az ?? $this->status_name_en;
            default:
                return $this->status_name_en;
        }
    }

    /**
     * Get localized description based on current locale
     */
    public function getLocalizedDescriptionAttribute(): ?string
    {
        $locale = app()->getLocale();
        
        switch ($locale) {
            case 'zh':
                return $this->description_ch ?? $this->description_en;
            case 'az':
                return $this->description_az ?? $this->description_en;
            default:
                return $this->description_en;
        }
    }

    /**
     * Get the full status display name (e.g., "3.1 In the Train")
     */
    public function getFullNameAttribute(): string
    {
        return $this->sub_status_key . ' ' . $this->getLocalizedNameAttribute();
    }

    /**
     * Get the next sub-status within the same parent
     */
    public function getNextSubStatus(): ?self
    {
        return self::where('parent_status_id', $this->parent_status_id)
                   ->where('sort_order', '>', $this->sort_order)
                   ->where('is_active', true)
                   ->orderBy('sort_order')
                   ->first();
    }

    /**
     * Get the previous sub-status within the same parent
     */
    public function getPreviousSubStatus(): ?self
    {
        return self::where('parent_status_id', $this->parent_status_id)
                   ->where('sort_order', '<', $this->sort_order)
                   ->where('is_active', true)
                   ->orderBy('sort_order', 'desc')
                   ->first();
    }

    /**
     * Scope to get active sub-statuses
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get sub-statuses for a specific parent
     */
    public function scopeForParent($query, $parentId)
    {
        return $query->where('parent_status_id', $parentId);
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "user has {$eventName} product sub-status {$this->status_name_en}";
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->useLogName("ProductSubStatus");
    }
}
