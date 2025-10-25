<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Lấy danh sách thông báo của user
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $query = Notification::where('user_id', $user->id);

        // Lọc theo trạng thái đọc
        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        // Lọc theo loại
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $notifications = $query->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Lấy thông báo chưa đọc
     */
    public function unread(): JsonResponse
    {
        $user = Auth::user();
        
        $notifications = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Đánh dấu thông báo đã đọc
     */
    public function markAsRead(string $id): JsonResponse
    {
        $user = Auth::user();
        
        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Thông báo không tồn tại'
            ], 404);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Đã đánh dấu đã đọc',
            'data' => $notification
        ]);
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = Auth::user();
        
        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã đánh dấu tất cả thông báo đã đọc'
        ]);
    }

    /**
     * Xóa thông báo
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();
        
        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Thông báo không tồn tại'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa thông báo'
        ]);
    }

    /**
     * Lấy số lượng thông báo chưa đọc
     */
    public function unreadCount(): JsonResponse
    {
        $user = Auth::user();
        
        $count = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'count' => $count
            ]
        ]);
    }

    /**
     * Tạo thông báo mới (cho admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'data' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $notification = Notification::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tạo thông báo thành công',
            'data' => $notification
        ], 201);
    }
}
