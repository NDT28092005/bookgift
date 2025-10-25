<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SystemSettingController extends Controller
{
    /**
     * Lấy danh sách cài đặt hệ thống
     */
    public function index(Request $request): JsonResponse
    {
        $query = SystemSetting::query();

        // Lọc theo trạng thái công khai
        if ($request->has('is_public')) {
            $query->where('is_public', $request->boolean('is_public'));
        }

        // Tìm kiếm theo key
        if ($request->has('search')) {
            $query->where('setting_key', 'like', '%' . $request->search . '%');
        }

        $settings = $query->orderBy('setting_key')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Lấy cài đặt theo key
     */
    public function show(string $key): JsonResponse
    {
        $setting = SystemSetting::where('setting_key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Cài đặt không tồn tại'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Lấy giá trị cài đặt
     */
    public function get(string $key): JsonResponse
    {
        $value = SystemSetting::get($key);

        return response()->json([
            'success' => true,
            'data' => [
                'key' => $key,
                'value' => $value
            ]
        ]);
    }

    /**
     * Cập nhật cài đặt
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'data_type' => 'sometimes|in:string,number,boolean,json',
            'description' => 'nullable|string',
            'is_public' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $setting = SystemSetting::where('setting_key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Cài đặt không tồn tại'
            ], 404);
        }

        $setting->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật cài đặt thành công',
            'data' => $setting
        ]);
    }

    /**
     * Tạo cài đặt mới
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'setting_key' => 'required|string|unique:system_settings,setting_key',
            'setting_value' => 'required',
            'data_type' => 'required|in:string,number,boolean,json',
            'description' => 'nullable|string',
            'is_public' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $setting = SystemSetting::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tạo cài đặt thành công',
            'data' => $setting
        ], 201);
    }

    /**
     * Xóa cài đặt
     */
    public function destroy(string $key): JsonResponse
    {
        $setting = SystemSetting::where('setting_key', $key)->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Cài đặt không tồn tại'
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa cài đặt thành công'
        ]);
    }

    /**
     * Lấy cài đặt công khai
     */
    public function public(): JsonResponse
    {
        $settings = SystemSetting::where('is_public', true)
            ->orderBy('setting_key')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Cập nhật nhiều cài đặt cùng lúc
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $updated = [];
        foreach ($request->settings as $setting) {
            $systemSetting = SystemSetting::where('setting_key', $setting['key'])->first();
            if ($systemSetting) {
                $systemSetting->update(['setting_value' => $setting['value']]);
                $updated[] = $systemSetting;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật cài đặt thành công',
            'data' => $updated
        ]);
    }
}
