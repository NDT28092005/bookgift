<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Delivery;
use App\Models\Payment;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $orders = $query->with(['user', 'orderItems.giftPackage', 'delivery', 'payment'])->get();
        
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'order_items' => 'required|array|min:1',
            'order_items.*.gift_package_id' => 'required|exists:gift_packages,id',
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.notes' => 'nullable|string',
            'delivery_address' => 'required|string',
            'delivery_phone' => 'required|string',
            'delivery_name' => 'required|string',
            'delivery_date' => 'nullable|date|after_or_equal:today',
            'delivery_time_slot' => 'nullable|string',
            'is_gift_wrapped' => 'boolean',
            'gift_message' => 'nullable|string',
            'payment_method' => 'required|in:cash,bank_transfer,momo,zalopay,credit_card',
            'notes' => 'nullable|string',
        ]);

        // Calculate total amount
        $totalAmount = 0;
        $orderItems = [];

        foreach ($validated['order_items'] as $item) {
            $giftPackage = \App\Models\GiftPackage::findOrFail($item['gift_package_id']);
            $unitPrice = $giftPackage->price;
            $itemTotal = $unitPrice * $item['quantity'];
            
            $orderItems[] = [
                'gift_package_id' => $item['gift_package_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'total_price' => $itemTotal,
                'notes' => $item['notes'] ?? null,
            ];
            
            $totalAmount += $itemTotal;
        }

        // Create order
        $orderData = [
            'id' => (string) Str::uuid(),
            'user_id' => $validated['user_id'],
            'total_amount' => $totalAmount,
            'discount_amount' => 0, // Can be calculated based on student discount
            'shipping_fee' => 0, // Can be calculated based on delivery method
            'final_amount' => $totalAmount,
            'status' => 'pending',
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'notes' => $validated['notes'] ?? null,
            'delivery_address' => $validated['delivery_address'],
            'delivery_phone' => $validated['delivery_phone'],
            'delivery_name' => $validated['delivery_name'],
            'delivery_date' => $validated['delivery_date'] ?? null,
            'delivery_time_slot' => $validated['delivery_time_slot'] ?? null,
            'is_gift_wrapped' => $validated['is_gift_wrapped'] ?? false,
            'gift_message' => $validated['gift_message'] ?? null,
        ];

        $order = Order::create($orderData);

        // Create order items
        foreach ($orderItems as $item) {
            $item['id'] = (string) Str::uuid();
            $item['order_id'] = $order->id;
            OrderItem::create($item);
        }

        // Create delivery record
        Delivery::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order->id,
            'delivery_address' => $validated['delivery_address'],
            'delivery_phone' => $validated['delivery_phone'],
            'delivery_name' => $validated['delivery_name'],
            'delivery_date' => $validated['delivery_date'] ?? null,
            'delivery_time_slot' => $validated['delivery_time_slot'] ?? null,
        ]);

        // Create payment record
        Payment::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order->id,
            'payment_method' => $validated['payment_method'],
            'payment_amount' => $order->final_amount,
        ]);

        $order->load(['user', 'orderItems.giftPackage', 'delivery', 'payment']);

        return response()->json($order, 201);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'orderItems.giftPackage', 'delivery', 'payment'])->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'delivery_date' => 'nullable|date',
            'delivery_time_slot' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $order->update($validated);

        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
}
