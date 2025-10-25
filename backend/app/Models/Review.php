<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'gift_package_id',
        'rating',
        'comment',
        'is_verified_purchase',
        'helpful_count',
        'status'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function giftPackage()
    {
        return $this->belongsTo(GiftPackage::class, 'gift_package_id');
    }
}
