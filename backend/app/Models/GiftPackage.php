<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GiftPackage extends Model
{
    use HasFactory;

    protected $table = 'gift_packages';
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'discount_percentage',
        'image_url',
        'banner_url',
        'status',
        'is_featured',
        'is_student_discount',
        'category_id',
        'target_audience',
        'delivery_time',
        'warranty_period',
        'rating',
        'review_count'
    ];

    public $incrementing = false;

    public function category()
    {
        return $this->belongsTo(GiftCategory::class, 'category_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }
}
