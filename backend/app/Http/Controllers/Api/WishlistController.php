<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\GiftPackage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Lấy danh sách wishlist của user
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $wishlists = Wishlist::with('giftPackage')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $wishlists
        ]);
    }

    /**
     * Thêm sản phẩm vào wishlist
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'gift_package_id' => 'required|exists:gift_packages,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $giftPackageId = $request->gift_package_id;

        // Kiểm tra xem đã có trong wishlist chưa
        $existingWishlist = Wishlist::where('user_id', $user->id)
            ->where('gift_package_id', $giftPackageId)
            ->first();

        if ($existingWishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm đã có trong danh sách yêu thích'
            ], 400);
        }

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'gift_package_id' => $giftPackageId
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm vào danh sách yêu thích',
            'data' => $wishlist->load('giftPackage')
        ], 201);
    }

    /**
     * Xóa sản phẩm khỏi wishlist
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();
        
        $wishlist = Wishlist::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại trong danh sách yêu thích'
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa khỏi danh sách yêu thích'
        ]);
    }

    /**
     * Xóa sản phẩm khỏi wishlist theo gift_package_id
     */
    public function removeByPackage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'gift_package_id' => 'required|exists:gift_packages,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('gift_package_id', $request->gift_package_id)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại trong danh sách yêu thích'
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa khỏi danh sách yêu thích'
        ]);
    }

    /**
     * Kiểm tra sản phẩm có trong wishlist không
     */
    public function check(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'gift_package_id' => 'required|exists:gift_packages,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        $exists = Wishlist::where('user_id', $user->id)
            ->where('gift_package_id', $request->gift_package_id)
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'is_in_wishlist' => $exists
            ]
        ]);
    }

    /**
     * Lấy số lượng sản phẩm trong wishlist
     */
    public function count(): JsonResponse
    {
        $user = Auth::user();
        
        $count = Wishlist::where('user_id', $user->id)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'count' => $count
            ]
        ]);
    }
}
