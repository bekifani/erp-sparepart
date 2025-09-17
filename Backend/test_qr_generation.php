<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\ProductInformation;
use App\Models\Product;
use App\Models\Unit;
use App\Services\QRCodeService;

echo "Testing QR Code generation...\n";

// Check if we have required data
$product = Product::first();
$unit = Unit::first();

if (!$product) {
    echo "No products found. Please create a product first.\n";
    exit;
}

echo "Using Product ID: {$product->id}\n";
echo "Product Brand Code: " . ($product->brand_code ?? 'NULL') . "\n";
echo "Product OE Code: " . ($product->oe_code ?? 'NULL') . "\n";

try {
    // Test QR code generation directly
    $qrPath = QRCodeService::generateProductQR([
        'product_id' => $product->id,
        'brand_code' => $product->brand_code ?? '',
        'oe_code' => $product->oe_code ?? '',
        'product_link' => url("/product/{$product->id}"),
    ]);
    
    echo "✅ QR Code generated successfully: {$qrPath}\n";
    
    // Check if file exists
    $fullPath = storage_path("app/public/{$qrPath}");
    if (file_exists($fullPath)) {
        echo "✅ QR Code file exists at: {$fullPath}\n";
        echo "File size: " . filesize($fullPath) . " bytes\n";
    } else {
        echo "❌ QR Code file not found at: {$fullPath}\n";
    }
    
} catch (Exception $e) {
    echo "❌ QR Code generation failed: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
