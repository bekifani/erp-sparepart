<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;

echo "Testing ProductInformation API request...\n";

// Get required data
$product = Product::first();
$unit = Unit::first();

if (!$product || !$unit) {
    echo "Missing required data\n";
    exit;
}

echo "Using Product ID: {$product->id}\n";
echo "Using Unit ID: {$unit->id}\n";

// Create test request data
$requestData = [
    'product_id' => $product->id,
    'qty' => 25.50,
    'net_weight' => 4.2,
    'gross_weight' => 4.8,
    'unit_id' => $unit->id,
    'volume' => 0.003456,
    'properties' => 'API test properties',
    'pictures' => ['api_test1.jpg', 'api_test2.jpg'],
    'image' => 'api_test_image.jpg',
    'technical_image' => 'api_tech_image.jpg',
    'additional_note' => 'API test note'
];

try {
    // Create HTTP request
    $request = Request::create('/api/ProductInformation', 'POST', $requestData);
    $request->headers->set('Accept', 'application/json');
    $request->headers->set('Content-Type', 'application/json');
    
    // Process through HTTP kernel
    $response = $kernel->handle($request);
    $responseData = json_decode($response->getContent(), true);
    
    echo "Response Status: " . $response->getStatusCode() . "\n";
    
    if ($response->getStatusCode() === 200 && isset($responseData['success']) && $responseData['success']) {
        echo "✅ API request successful\n";
        $productInfo = $responseData['data'];
        echo "Created ProductInformation ID: {$productInfo['id']}\n";
        echo "Qty: " . ($productInfo['qty'] ?? 'NULL') . "\n";
        echo "Pictures: " . json_encode($productInfo['pictures']) . "\n";
        echo "Image: " . ($productInfo['image'] ?? 'NULL') . "\n";
        echo "QR Code: " . ($productInfo['qr_code'] ?? 'NULL') . "\n";
        echo "Product Code: " . ($productInfo['product_code'] ?? 'NULL') . "\n";
        
        // Clean up
        \App\Models\ProductInformation::find($productInfo['id'])->delete();
        echo "✅ Test record cleaned up\n";
    } else {
        echo "❌ API request failed\n";
        echo "Response: " . $response->getContent() . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ API test failed: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
