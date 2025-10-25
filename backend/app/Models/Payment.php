<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'id',
        'order_id',
        'payment_method',
        'payment_status',
        'payment_amount',
        'transaction_id',
        'payment_gateway',
        'payment_date',
        'refund_amount',
        'refund_reason',
        'refund_date'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
