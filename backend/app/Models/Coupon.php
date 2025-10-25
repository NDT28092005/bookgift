<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'id',
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_amount',
        'maximum_discount',
        'usage_limit',
        'used_count',
        'user_limit',
        'starts_at',
        'expires_at',
        'is_active',
        'applicable_categories'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'applicable_categories' => 'array',
        'is_active' => 'boolean',
    ];

    public function userCoupons()
    {
        return $this->hasMany(UserCoupon::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function isActive()
    {
        return $this->is_active && 
               ($this->starts_at === null || $this->starts_at <= now()) &&
               ($this->expires_at === null || $this->expires_at >= now());
    }

    public function isAvailable()
    {
        return $this->isActive() && 
               ($this->usage_limit === null || $this->used_count < $this->usage_limit);
    }
}
