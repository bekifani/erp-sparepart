<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\ProductInformation;
use App\Models\Product;
use App\Models\Unit;

echo "Testing ProductInformation database storage...\n";

// Check if we have required data
$product = Product::first();
$unit = Unit::first();

if (!$product) {
    echo "No products found. Please create a product first.\n";
    exit;
}

if (!$unit) {
    echo "No units found. Please create a unit first.\n";
    exit;
}

echo "Using Product ID: {$product->id}\n";
echo "Using Unit ID: {$unit->id}\n";

// Test data
$testData = [
    'product_id' => $product->id,
    'product_code' => 'PI-' . $product->id . '-' . time(),
    'qty' => 10.5,
    'net_weight' => 2.3,
    'gross_weight' => 2.8,
    'unit_id' => $unit->id,
    'volume' => 0.001234,
    'properties' => 'Test properties',
    'pictures' => ['image1.jpg', 'image2.jpg'],
    'additional_note' => 'Test note'
];

try {
    // Create new ProductInformation record
    $productInfo = ProductInformation::create($testData);
    echo "✅ ProductInformation created successfully with ID: {$productInfo->id}\n";
    
    // Retrieve and check the saved data
    $saved = ProductInformation::find($productInfo->id);
    echo "Saved Qty: " . ($saved->qty ?? 'NULL') . "\n";
    echo "Saved Pictures: " . json_encode($saved->pictures) . "\n";
    echo "Saved QR Code: " . ($saved->qr_code ?? 'NULL') . "\n";
    
    // Clean up
    $saved->delete();
    echo "✅ Test record cleaned up\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
