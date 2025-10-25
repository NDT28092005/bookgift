<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiftCategory extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 
        'name', 
        'code', 
        'description', 
        'icon_url',
        'is_active',
        'sort_order'
    ];

    public function giftPackages()
    {
        return $this->hasMany(GiftPackage::class, 'category_id');
    }
}
