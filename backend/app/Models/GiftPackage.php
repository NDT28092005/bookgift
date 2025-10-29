<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class GiftPackage extends Model
{
    use HasFactory;

    protected $table = 'gift_packages';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'original_price',
        'discount_percentage', 'image_url', 'banner_url', 'status',
        'is_featured', 'is_student_discount', 'category_id', 'target_audience',
        'delivery_time', 'warranty_period', 'rating', 'review_count',
        'meta_title', 'meta_description', 'tags', 'stock_quantity',
        'sold_count', 'weight', 'dimensions', 'is_digital', 'gallery'
    ];

    protected $casts = [
        'tags' => 'array',
        'dimensions' => 'array',
        'gallery' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function category()
    {
        return $this->belongsTo(GiftCategory::class, 'category_id');
    }
}