<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GiftCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GiftCategoryController extends Controller
{
    public function index()
    {
        return response()->json(GiftCategory::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:gift_categories,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        // Xử lý upload ảnh
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Tạo thư mục nếu chưa có
            if (!Storage::disk('public')->exists('categories')) {
                Storage::disk('public')->makeDirectory('categories');
            }
            
            // Lưu file
            $file->storeAs('public/categories', $filename);
            $validated['icon_url'] = env('APP_URL') . '/storage/categories/' . $filename;
        }

        $category = GiftCategory::create($validated);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        return response()->json(GiftCategory::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        Log::info('GiftCategory update called', [
            'id' => $id,
            'has_file' => $request->hasFile('file'),
            'all_data' => $request->all(),
            'files' => $request->allFiles()
        ]);

        $category = GiftCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:gift_categories,code,' . $category->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        // Xử lý upload ảnh mới
        if ($request->hasFile('file')) {
            Log::info('File detected, processing upload');
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            Log::info('File details', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'filename' => $filename
            ]);
            
            // Tạo thư mục nếu chưa có
            if (!Storage::disk('public')->exists('categories')) {
                Storage::disk('public')->makeDirectory('categories');
                Log::info('Created categories directory');
            }
            
            // Xóa ảnh cũ nếu có (kiểm tra cả 2 thư mục cũ và mới)
            if ($category->icon_url) {
                $oldFilename = basename($category->icon_url);
                
                // Thử xóa từ thư mục cũ (category-icons)
                $oldPath1 = 'category-icons/' . $oldFilename;
                if (Storage::disk('public')->exists($oldPath1)) {
                    Storage::disk('public')->delete($oldPath1);
                    Log::info('Deleted old image from category-icons', ['path' => $oldPath1]);
                }
                
                // Thử xóa từ thư mục mới (categories)
                $oldPath2 = 'categories/' . $oldFilename;
                if (Storage::disk('public')->exists($oldPath2)) {
                    Storage::disk('public')->delete($oldPath2);
                    Log::info('Deleted old image from categories', ['path' => $oldPath2]);
                }
            }
            
            // Lưu file mới
            $saved = $file->storeAs('public/categories', $filename);
            Log::info('File saved', ['saved_path' => $saved, 'filename' => $filename]);
            
            $validated['icon_url'] = env('APP_URL') . '/storage/categories/' . $filename;
            Log::info('New icon_url set', ['icon_url' => $validated['icon_url']]);
        } else {
            Log::info('No file uploaded, keeping existing icon_url');
        }

        $category->update($validated);
        Log::info('Category updated successfully', ['updated_data' => $validated]);
        
        return response()->json($category);
    }

    public function uploadImage(Request $request, $id)
    {
        Log::info('GiftCategory uploadImage called', [
            'id' => $id,
            'has_file' => $request->hasFile('file'),
            'all_data' => $request->all(),
            'files' => $request->allFiles(),
            'content_type' => $request->header('Content-Type')
        ]);

        $category = GiftCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:gift_categories,code,' . $category->id,
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
            'file' => 'nullable|image|max:5120',
        ]);

        // Xử lý upload ảnh mới
        if ($request->hasFile('file')) {
            Log::info('File detected, processing upload');
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            Log::info('File details', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'filename' => $filename
            ]);
            
            // Tạo thư mục nếu chưa có
            if (!Storage::disk('public')->exists('categories')) {
                Storage::disk('public')->makeDirectory('categories');
                Log::info('Created categories directory');
            }
            
            // Xóa ảnh cũ nếu có (kiểm tra cả 2 thư mục cũ và mới)
            if ($category->icon_url) {
                $oldFilename = basename($category->icon_url);
                
                // Thử xóa từ thư mục cũ (category-icons)
                $oldPath1 = 'category-icons/' . $oldFilename;
                if (Storage::disk('public')->exists($oldPath1)) {
                    Storage::disk('public')->delete($oldPath1);
                    Log::info('Deleted old image from category-icons', ['path' => $oldPath1]);
                }
                
                // Thử xóa từ thư mục mới (categories)
                $oldPath2 = 'categories/' . $oldFilename;
                if (Storage::disk('public')->exists($oldPath2)) {
                    Storage::disk('public')->delete($oldPath2);
                    Log::info('Deleted old image from categories', ['path' => $oldPath2]);
                }
            }
            
            // Lưu file mới
            $saved = $file->storeAs('public/categories', $filename);
            Log::info('File saved', ['saved_path' => $saved, 'filename' => $filename]);
            
            $validated['icon_url'] = env('APP_URL') . '/storage/categories/' . $filename;
            Log::info('New icon_url set', ['icon_url' => $validated['icon_url']]);
        } else {
            Log::info('No file uploaded, keeping existing icon_url');
        }

        $category->update($validated);
        Log::info('Category updated successfully', ['updated_data' => $validated]);
        
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = GiftCategory::findOrFail($id);

        // Xóa ảnh nếu có
        if ($category->icon_url) {
            $filename = basename($category->icon_url);
            $path = 'categories/' . $filename;
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $category->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}