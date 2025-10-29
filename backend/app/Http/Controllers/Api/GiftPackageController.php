<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use App\Models\GiftPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GiftPackageController extends Controller
{
    public function index()
    {
        return response()->json(GiftPackage::with('category')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:gift_packages,slug',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'category_id' => 'required|exists:gift_categories,id',
            'status' => 'nullable|in:active,inactive,draft',
            'tags' => 'nullable|array',
            'gallery' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $package = GiftPackage::create($validated);
        return response()->json($package, 201);
    }

    public function show($id)
    {
        return response()->json(GiftPackage::with('category')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $package = GiftPackage::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:gift_packages,slug,' . $package->id,
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,inactive,draft',
            'tags' => 'nullable|array',
            'gallery' => 'nullable|array',
        ]);

        $package->update($validated);
        return response()->json($package);
    }

    public function destroy($id)
    {
        GiftPackage::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
