<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\GoogleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GiftPackageController;
use App\Http\Controllers\Api\GiftCategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Admin\Auth\AdminAuthController;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

Route::post('/upload', function (Request $request) {
    $request->validate([
        'file' => 'required|image|max:5120',
    ]);

    $img = $request->file('file');
    $filename = uniqid() . '.' . $img->getClientOriginalExtension();

    // Tạo thư mục nếu chưa tồn tại
    if (!Storage::disk('public')->exists('category-icons')) {
        Storage::disk('public')->makeDirectory('category-icons');
    }

    // Lưu file gốc
    $saved = Storage::disk('public')->putFileAs('category-icons', $img, $filename);
    
    if ($saved) {
        $url = env('APP_URL') . '/storage/category-icons/' . $filename;
        return response()->json(['url' => $url, 'success' => true]);
    } else {
        return response()->json(['error' => 'Upload failed'], 500);
    }
});
// Gift Categories Routes
Route::apiResource('gift-categories', GiftCategoryController::class);
Route::post('/gift-categories/{id}/upload', [GiftCategoryController::class, 'uploadImage']);
// Route::get('/gift-categories', [GiftCategoryController::class, 'index']);
// Route::post('/gift-categories', [GiftCategoryController::class, 'store']);
// Route::get('/gift-categories/{id}', [GiftCategoryController::class, 'show']);
// Route::put('/gift-categories/{id}', [GiftCategoryController::class, 'update']);
// Route::delete('/gift-categories/{id}', [GiftCategoryController::class, 'destroy']);

// Gift Packages Routes
Route::prefix('gift-packages')->group(function () {
    Route::get('/', [GiftPackageController::class, 'index']);        // Danh sách gói quà
    Route::get('/{id}', [GiftPackageController::class, 'show']);       // Chi tiết gói quà
    Route::post('/', [GiftPackageController::class, 'store']);         // Thêm gói quà
    Route::put('/{id}', [GiftPackageController::class, 'update']);     // Cập nhật
    Route::delete('/{id}', [GiftPackageController::class, 'destroy']); // Xóa
});

// Orders Routes
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);                // Danh sách đơn hàng
    Route::get('/{id}', [OrderController::class, 'show']);             // Chi tiết đơn hàng
    Route::post('/', [OrderController::class, 'store']);              // Tạo đơn hàng
    Route::put('/{id}', [OrderController::class, 'update']);          // Cập nhật đơn hàng
    Route::delete('/{id}', [OrderController::class, 'destroy']);     // Xóa đơn hàng
});

// Coupons Routes
Route::prefix('coupons')->group(function () {
    Route::get('/', [CouponController::class, 'index']);              // Danh sách coupon
    Route::get('/{id}', [CouponController::class, 'show']);            // Chi tiết coupon
    Route::post('/', [CouponController::class, 'store']);              // Tạo coupon
    Route::put('/{id}', [CouponController::class, 'update']);          // Cập nhật coupon
    Route::delete('/{id}', [CouponController::class, 'destroy']);      // Xóa coupon
    Route::post('/validate', [CouponController::class, 'validateCoupon']);    // Kiểm tra coupon
});

// Wishlists Routes
Route::prefix('wishlists')->group(function () {
    Route::get('/', [WishlistController::class, 'index']);             // Danh sách wishlist
    Route::post('/', [WishlistController::class, 'store']);           // Thêm vào wishlist
    Route::delete('/{id}', [WishlistController::class, 'destroy']);   // Xóa khỏi wishlist
    Route::post('/remove-by-package', [WishlistController::class, 'removeByPackage']); // Xóa theo package
    Route::get('/check', [WishlistController::class, 'check']);       // Kiểm tra có trong wishlist
    Route::get('/count', [WishlistController::class, 'count']);         // Đếm số lượng
});

// Notifications Routes
Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);          // Danh sách thông báo
    Route::get('/unread', [NotificationController::class, 'unread']);   // Thông báo chưa đọc
    Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead']); // Đánh dấu đã đọc
    Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']); // Đánh dấu tất cả đã đọc
    Route::get('/unread/count', [NotificationController::class, 'unreadCount']); // Đếm chưa đọc
    Route::post('/', [NotificationController::class, 'store']);       // Tạo thông báo
    Route::delete('/{id}', [NotificationController::class, 'destroy']); // Xóa thông báo
});

// System Settings Routes
Route::prefix('system-settings')->group(function () {
    Route::get('/', [SystemSettingController::class, 'index']);       // Danh sách cài đặt
    Route::get('/{key}', [SystemSettingController::class, 'show']);   // Chi tiết cài đặt
    Route::get('/get/{key}', [SystemSettingController::class, 'get']); // Lấy giá trị
    Route::put('/{key}', [SystemSettingController::class, 'update']); // Cập nhật cài đặt
    Route::post('/', [SystemSettingController::class, 'store']);       // Tạo cài đặt
    Route::delete('/{key}', [SystemSettingController::class, 'destroy']); // Xóa cài đặt
    Route::get('/public', [SystemSettingController::class, 'public']); // Cài đặt công khai
    Route::post('/bulk-update', [SystemSettingController::class, 'bulkUpdate']); // Cập nhật hàng loạt
});

// Admin Routes
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);
});
Route::middleware('auth:sanctum')->get('/admin/me', [AdminAuthController::class, 'me']);
// -------------------------
// Public Routes
// -------------------------
Route::post('/register', [RegisterController::class, 'register']); // Đăng ký email + gửi mail
Route::post('/login', [AuthenticationController::class, 'login']); // Login email/password

// Google OAuth
Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle']); // Redirect user đến Google
Route::post('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']); // Nhận token từ frontend
Route::post('/email/verify', function (Request $request) {
    $request->validate([
        'id' => 'required|integer|exists:users,id',
        'token' => 'required|string',
    ]);

    $user = User::find($request->id);

    // Kiểm tra token
    if (!Hash::check($user->email, $request->token)) {
        return response()->json(['status' => false, 'message' => 'Token xác nhận không hợp lệ'], 400);
    }

    // Đánh dấu verified
    $user->email_verified_at = now();
    $user->save();

    return response()->json(['status' => true, 'message' => 'Email đã được xác nhận']);
});
// -------------------------
// Protected Routes (yêu cầu login)
// -------------------------
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/me', [AuthenticationController::class, 'me']);
    Route::get('/logout', [AuthenticationController::class, 'logout']);
});
