<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class GiftCategory extends Model
{
    use HasFactory;

    protected $table = 'gift_categories';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name', 
        'code', 
        'description', 
        'icon_url',
        'is_active', 
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function packages()
    {
        return $this->hasMany(GiftPackage::class, 'category_id');
    }
}