<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'id',
        'setting_key',
        'setting_value',
        'data_type',
        'description',
        'is_public'
    ];

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public static function get($key, $default = null)
    {
        $setting = static::where('setting_key', $key)->first();
        return $setting ? $setting->setting_value : $default;
    }

    public static function set($key, $value, $type = 'string', $description = null, $isPublic = false)
    {
        return static::updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => $value,
                'data_type' => $type,
                'description' => $description,
                'is_public' => $isPublic
            ]
        );
    }
}
