<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\GiftCategory;

class GiftCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = GiftCategory::query();

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $categories = $query->orderBy('sort_order')->get();
        
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:gift_categories,code',
            'description' => 'nullable|string',
            'icon_url' => 'nullable|image|max:1024',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('icon_url')) {
            $icon = $request->file('icon_url');
            $iconPath = $icon->store('category-icons', 'public');
            $validated['icon_url'] = '/storage/' . $iconPath;
        }

        $validated['id'] = (string) Str::uuid();
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $category = GiftCategory::create($validated);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = GiftCategory::with('giftPackages')->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = GiftCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:gift_categories,code,' . $id,
            'description' => 'nullable|string',
            'icon_url' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = GiftCategory::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Gift category deleted successfully']);
    }
}
