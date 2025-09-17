<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\ProductInformationController;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;

echo "Testing ProductInformation Controller functionality...\n";

// Get required data
$product = Product::first();
$unit = Unit::first();

if (!$product || !$unit) {
    echo "Missing required data (product or unit)\n";
    exit;
}

echo "Using Product ID: {$product->id}\n";
echo "Using Unit ID: {$unit->id}\n";

// Create test request data
$requestData = [
    'product_id' => $product->id,
    'qty' => 15.75,
    'net_weight' => 3.2,
    'gross_weight' => 3.8,
    'unit_id' => $unit->id,
    'volume' => 0.002345,
    'properties' => 'Controller test properties',
    'pictures' => ['test1.jpg', 'test2.jpg', 'test3.jpg'],
    'technical_image' => 'tech_image.jpg',
    'additional_note' => 'Controller test note'
];

try {
    // Create mock request
    $request = new Request();
    $request->merge($requestData);
    
    // Test controller store method
    $controller = new ProductInformationController();
    $response = $controller->store($request);
    
    // Check response
    $responseData = json_decode($response->getContent(), true);
    
    if ($responseData['success']) {
        echo "✅ Controller store method successful\n";
        $productInfo = $responseData['data'];
        echo "Created ProductInformation ID: {$productInfo['id']}\n";
        echo "Qty: " . ($productInfo['qty'] ?? 'NULL') . "\n";
        echo "Pictures: " . json_encode($productInfo['pictures']) . "\n";
        echo "QR Code: " . ($productInfo['qr_code'] ?? 'NULL') . "\n";
        echo "Product Code: " . ($productInfo['product_code'] ?? 'NULL') . "\n";
        
        // Clean up
        \App\Models\ProductInformation::find($productInfo['id'])->delete();
        echo "✅ Test record cleaned up\n";
    } else {
        echo "❌ Controller store method failed\n";
        echo "Errors: " . json_encode($responseData['message'] ?? 'Unknown error') . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Controller test failed: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
