<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'gift_package_id'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function giftPackage()
    {
        return $this->belongsTo(GiftPackage::class);
    }
}
