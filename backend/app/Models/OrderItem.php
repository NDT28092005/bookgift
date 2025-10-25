<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'id',
        'order_id',
        'gift_package_id',
        'quantity',
        'unit_price',
        'total_price',
        'notes'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function giftPackage()
    {
        return $this->belongsTo(GiftPackage::class, 'gift_package_id');
    }
}
