<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GiftCategory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class GiftCategoryController extends Controller
{
    public function index()
    {
        $categories = GiftCategory::select('id', 'name', 'code', 'description', 'icon_url', 'is_active', 'sort_order')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:gift_categories,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'icon' => 'nullable|image|max:2048', // tối đa 2MB
        ]);

        $category = new GiftCategory();
        $category->id = (string) Str::uuid();
        $category->fill($request->only(['name', 'code', 'description', 'is_active', 'sort_order']));

        if ($request->hasFile('icon')) {
            $iconUrl = $this->processImage($request->file('icon'));
            $category->icon_url = $iconUrl;
        }

        $category->save();

        return response()->json(['message' => 'Tạo danh mục thành công', 'data' => $category]);
    }

    public function show($id)
    {
        $category = GiftCategory::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = GiftCategory::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:gift_categories,code,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'icon' => 'nullable|image|max:2048',
        ]);

        $category->fill($request->only(['name', 'code', 'description', 'is_active', 'sort_order']));

        // Xóa ảnh cũ nếu có ảnh mới
        if ($request->hasFile('icon')) {
            $this->deleteOldImage($category);

            $iconUrl = $this->processImage($request->file('icon'));
            $category->icon_url = $iconUrl;
        }

        $category->save();

        return response()->json(['message' => 'Cập nhật danh mục thành công', 'data' => $category]);
    }

    public function destroy($id)
    {
        $category = GiftCategory::findOrFail($id);
        $this->deleteOldImage($category);
        $category->delete();

        return response()->json(['message' => 'Đã xóa danh mục']);
    }

    // ===========================
    // 🔧 HÀM PHỤ XỬ LÝ ẢNH
    // ===========================

    private function processImage($file)
    {
        $fileName = Str::uuid() . '.webp';

        // Lưu ảnh gốc (nén 80%)
        $originalPath = 'public/icons/original/' . $fileName;
        $image = Image::make($file)->encode('webp', 80);
        Storage::put($originalPath, (string) $image);

        return Storage::url($originalPath);
    }

    private function deleteOldImage($category)
    {
        if ($category->icon_url) {
            $oldImagePath = str_replace('/storage/', 'public/', $category->icon_url);
            Storage::delete($oldImagePath);
        }
    }
}