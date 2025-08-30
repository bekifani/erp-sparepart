<?php

namespace App\Models;


use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    protected $fillable = [
        'id',
        'tenant_name',
        'address',
        'data',
        'owner_id'
    ];

    public function domains()
    {
        return $this->hasMany(Domain::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'id', 'owner_id');
    }
}
