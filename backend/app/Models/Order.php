<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Order extends Model {
    use HasFactory;
    
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'order_code',
        'user_id',
        'total_amount',
        'discount_amount',
        'shipping_fee',
        'final_amount',
        'status',
        'payment_method',
        'payment_status',
        'notes',
        'delivery_address',
        'delivery_phone',
        'delivery_name',
        'delivery_date',
        'delivery_time_slot',
        'is_gift_wrapped',
        'gift_message'
    ];

    protected static function booted() {
        static::creating(function($order){ 
            if(!$order->id) $order->id = (string) Str::uuid(); 
            if(!$order->order_code) $order->order_code = 'ORD'. strtoupper(Str::random(8));
        });
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function delivery()
    {
        return $this->hasOne(Delivery::class, 'order_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id');
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class, 'coupon_id');
    }
}
