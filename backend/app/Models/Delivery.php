<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
        'id',
        'order_id',
        'delivery_method',
        'delivery_address',
        'delivery_phone',
        'delivery_name',
        'delivery_date',
        'delivery_time_slot',
        'delivery_status',
        'delivery_notes',
        'tracking_number',
        'delivered_at',
        'delivery_fee'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
