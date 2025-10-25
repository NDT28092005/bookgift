<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\GiftPackage;

class GiftPackageController extends Controller
{
    public function index(Request $request)
    {
        $query = GiftPackage::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        if ($request->has('is_student_discount')) {
            $query->where('is_student_discount', $request->boolean('is_student_discount'));
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $giftPackages = $query->with(['category', 'reviews'])->get();
        
        return response()->json($giftPackages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:gift_packages,slug',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'image_url' => 'nullable|image|max:2048',
            'banner_url' => 'nullable|image|max:4096',
            'status' => 'in:active,inactive,out_of_stock',
            'is_featured' => 'boolean',
            'is_student_discount' => 'boolean',
            'category_id' => 'required|exists:gift_categories,id',
            'target_audience' => 'nullable|string',
            'delivery_time' => 'nullable|string',
            'warranty_period' => 'nullable|string',
        ]);

        if ($request->hasFile('image_url')) {
            $image = $request->file('image_url');
            $imagePath = $image->store('gift-packages', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        if ($request->hasFile('banner_url')) {
            $banner = $request->file('banner_url');
            $bannerPath = $banner->store('gift-banners', 'public');
            $validated['banner_url'] = '/storage/' . $bannerPath;
        }

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);
        $validated['id'] = (string) Str::uuid();

        $giftPackage = GiftPackage::create($validated);

        return response()->json($giftPackage, 201);
    }

    public function show($id)
    {
        $giftPackage = GiftPackage::with(['category', 'reviews.user'])->findOrFail($id);
        return response()->json($giftPackage);
    }

    public function update(Request $request, $id)
    {
        $giftPackage = GiftPackage::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:gift_packages,slug,' . $id,
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'image_url' => 'nullable|string',
            'banner_url' => 'nullable|string',
            'status' => 'in:active,inactive,out_of_stock',
            'is_featured' => 'boolean',
            'is_student_discount' => 'boolean',
            'category_id' => 'sometimes|exists:gift_categories,id',
            'target_audience' => 'nullable|string',
            'delivery_time' => 'nullable|string',
            'warranty_period' => 'nullable|string',
        ]);

        $giftPackage->update($validated);

        return response()->json($giftPackage);
    }

    public function destroy($id)
    {
        $giftPackage = GiftPackage::findOrFail($id);
        $giftPackage->delete();

        return response()->json(['message' => 'Gift package deleted successfully']);
    }
}
