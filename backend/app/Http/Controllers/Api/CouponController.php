<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    /**
     * Lấy danh sách coupon
     */
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query();

        // Lọc theo trạng thái
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Lọc theo loại
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Tìm kiếm theo code
        if ($request->has('search')) {
            $query->where('code', 'like', '%' . $request->search . '%')
                  ->orWhere('name', 'like', '%' . $request->search . '%');
        }

        $coupons = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $coupons
        ]);
    }

    /**
     * Lấy thông tin coupon theo ID
     */
    public function show(string $id): JsonResponse
    {
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Coupon không tồn tại'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $coupon
        ]);
    }

    /**
     * Tạo coupon mới
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed_amount,free_shipping',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'maximum_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'user_limit' => 'required|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $coupon = Coupon::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tạo coupon thành công',
            'data' => $coupon
        ], 201);
    }

    /**
     * Cập nhật coupon
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Coupon không tồn tại'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|unique:coupons,code,' . $id,
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:percentage,fixed_amount,free_shipping',
            'value' => 'sometimes|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'maximum_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'user_limit' => 'sometimes|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $coupon->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật coupon thành công',
            'data' => $coupon
        ]);
    }

    /**
     * Xóa coupon
     */
    public function destroy(string $id): JsonResponse
    {
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Coupon không tồn tại'
            ], 404);
        }

        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa coupon thành công'
        ]);
    }

    /**
     * Kiểm tra coupon có hợp lệ không
     */
    public function validate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Mã coupon không tồn tại'
            ], 404);
        }

        if (!$coupon->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Coupon đã hết hạn hoặc không hoạt động'
            ], 400);
        }

        if (!$coupon->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Coupon đã hết lượt sử dụng'
            ], 400);
        }

        if ($coupon->minimum_amount && $request->total_amount < $coupon->minimum_amount) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng chưa đạt giá trị tối thiểu'
            ], 400);
        }

        // Tính toán giảm giá
        $discountAmount = 0;
        if ($coupon->type === 'percentage') {
            $discountAmount = ($request->total_amount * $coupon->value) / 100;
            if ($coupon->maximum_discount) {
                $discountAmount = min($discountAmount, $coupon->maximum_discount);
            }
        } elseif ($coupon->type === 'fixed_amount') {
            $discountAmount = $coupon->value;
        }

        return response()->json([
            'success' => true,
            'message' => 'Coupon hợp lệ',
            'data' => [
                'coupon' => $coupon,
                'discount_amount' => $discountAmount,
                'final_amount' => $request->total_amount - $discountAmount
            ]
        ]);
    }
}
