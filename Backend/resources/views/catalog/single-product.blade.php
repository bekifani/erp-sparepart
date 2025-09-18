<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $product->description ?? 'Product Details' }}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin: 0;
        }
        
        .header .subtitle {
            font-size: 14px;
            color: #666;
            margin-top: 8px;
        }
        
        .product-container {
            display: flex;
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .product-image-section {
            flex: 0 0 350px;
            max-width: 350px;
        }
        
        .product-image {
            width: 100%;
            min-height: 200px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 10px;
        }
        
        .product-image img {
            max-width: 100%;
            max-height: 250px;
            object-fit: contain;
        }
        
        .product-image .placeholder {
            color: #9ca3af;
            font-size: 16px;
        }
        
        .product-details-section {
            flex: 1;
        }
        
        .product-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            line-height: 1.3;
        }
        
        .detail-section {
            margin-bottom: 20px;
        }
        
        .detail-section h3 {
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 8px;
        }
        
        .detail-label {
            font-weight: bold;
            color: #6b7280;
            min-width: 120px;
            margin-right: 10px;
        }
        
        .detail-value {
            color: #374151;
            flex: 1;
        }
        
        .specifications-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .specifications-table th,
        .specifications-table td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
        }
        
        .specifications-table th {
            background-color: #f8fafc;
            font-weight: bold;
            color: #374151;
        }
        
        .compatible-vehicles {
            margin-top: 15px;
        }
        
        .vehicle-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
            margin-top: 10px;
        }
        
        .vehicle-item {
            background-color: #f8fafc;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 10px;
            border-left: 3px solid #2563eb;
        }
        
        .cross-codes {
            margin-top: 15px;
        }
        
        .cross-code-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
            margin-top: 10px;
        }
        
        .cross-code-item {
            background-color: #f0f9ff;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 10px;
            border-left: 3px solid #0ea5e9;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        
        .qr-code {
            text-align: center;
            margin-top: 20px;
        }
        
        .qr-code img {
            width: 100px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $product->description ?? 'Product Details' }}</h1>
        <div class="subtitle">
            Product Information Sheet | Generated on {{ $generated_at ?? now()->format('F j, Y \a\t g:i A') }}
        </div>
    </div>

    <div class="product-container">
        <div class="product-image-section">
            @php
                $images = [];
                $productInfo = $product->productinformation ?? null;
                
                // Log product info for debugging
                \Log::info('PDF Image Debug - Product Info', [
                    'has_productinfo' => $productInfo ? 'yes' : 'no',
                    'image' => $productInfo->image ?? 'none',
                    'technical_image' => $productInfo->technical_image ?? 'none',
                    'pictures' => $productInfo->pictures ?? 'none'
                ]);
                
                // Add main image
                if ($productInfo && $productInfo->image) {
                    $storagePath = storage_path('app/public/' . $productInfo->image);
                    $images[] = [
                        'src' => $storagePath,
                        'alt' => 'Product Image',
                        'type' => 'main'
                    ];
                    \Log::info('PDF Image Debug - Main Image', [
                        'original_path' => $productInfo->image,
                        'storage_path' => $storagePath,
                        'exists' => file_exists($storagePath) ? 'yes' : 'no'
                    ]);
                }
                
                // Add technical image
                if ($productInfo && $productInfo->technical_image) {
                    $storagePath = storage_path('app/public/' . $productInfo->technical_image);
                    $images[] = [
                        'src' => $storagePath,
                        'alt' => 'Technical Drawing',
                        'type' => 'technical'
                    ];
                    \Log::info('PDF Image Debug - Technical Image', [
                        'original_path' => $productInfo->technical_image,
                        'storage_path' => $storagePath,
                        'exists' => file_exists($storagePath) ? 'yes' : 'no'
                    ]);
                }
                
                // Add images from pictures column
                if ($productInfo && $productInfo->pictures) {
                    try {
                        $picturesData = null;
                        
                        if (is_string($productInfo->pictures)) {
                            // Try to decode JSON
                            if (str_starts_with($productInfo->pictures, '[') || str_starts_with($productInfo->pictures, '{')) {
                                $picturesData = json_decode($productInfo->pictures, true);
                            } else {
                                // Split by comma for comma-separated values
                                $picturesData = array_map('trim', explode(',', $productInfo->pictures));
                            }
                        } elseif (is_array($productInfo->pictures)) {
                            $picturesData = $productInfo->pictures;
                        }
                        
                        if (is_array($picturesData)) {
                            foreach ($picturesData as $index => $picture) {
                                if (is_string($picture) && !empty(trim($picture))) {
                                    $imagePath = trim($picture);
                                    
                                    \Log::info('PDF Image Debug - Processing Picture', [
                                        'index' => $index,
                                        'raw_path' => $imagePath,
                                        'length' => strlen($imagePath),
                                        'starts_with_data' => str_starts_with($imagePath, 'data:image/'),
                                        'starts_with_9j' => str_starts_with($imagePath, '/9j/'),
                                        'starts_with_png' => str_starts_with($imagePath, 'iVBORw0KGgo'),
                                        'starts_with_gif' => str_starts_with($imagePath, 'R0lGODlh')
                                    ]);
                                    
                                    // Handle different image formats
                                    if (str_starts_with($imagePath, 'data:image/')) {
                                        // Already a complete base64 data URL
                                        $images[] = [
                                            'src' => $imagePath,
                                            'alt' => 'Product Picture ' . ($index + 1),
                                            'type' => 'base64'
                                        ];
                                        \Log::info('PDF Image Debug - Added Base64 Data URL', ['index' => $index]);
                                    } elseif (str_starts_with($imagePath, '/9j/') || 
                                             str_starts_with($imagePath, 'iVBORw0KGgo') || 
                                             str_starts_with($imagePath, 'R0lGODlh') ||
                                             (strlen($imagePath) > 100 && preg_match('/^[A-Za-z0-9+\/]+=*$/', $imagePath) && !str_contains($imagePath, '.'))) {
                                        // Likely base64 image data (JPEG starts with /9j/, PNG with iVBORw0KGgo, GIF with R0lGODlh)
                                        $images[] = [
                                            'src' => 'data:image/jpeg;base64,' . $imagePath,
                                            'alt' => 'Product Picture ' . ($index + 1),
                                            'type' => 'base64'
                                        ];
                                        \Log::info('PDF Image Debug - Added Base64 Reconstructed', ['index' => $index]);
                                    } else {
                                        // Regular file path
                                        $storagePath = storage_path('app/public/' . $imagePath);
                                        $images[] = [
                                            'src' => $storagePath,
                                            'alt' => 'Product Picture ' . ($index + 1),
                                            'type' => 'file'
                                        ];
                                        \Log::info('PDF Image Debug - Added File Path', [
                                            'index' => $index,
                                            'original_path' => $imagePath,
                                            'storage_path' => $storagePath,
                                            'exists' => file_exists($storagePath) ? 'yes' : 'no'
                                        ]);
                                    }
                                }
                            }
                        }
                    } catch (Exception $e) {
                        // Log error but continue
                        \Log::warning('Error processing pictures for PDF', ['error' => $e->getMessage()]);
                    }
                }
            @endphp
            
            @php
                \Log::info('PDF Image Debug - Final Images Array', [
                    'total_images' => count($images),
                    'image_types' => array_column($images, 'type')
                ]);
            @endphp
            
            @if(count($images) > 0)
                @foreach($images as $index => $image)
                    <div class="product-image" style="margin-bottom: 15px;">
                        @if($image['type'] === 'base64')
                            <img src="{{ $image['src'] }}" 
                                 alt="{{ $image['alt'] }}"
                                 style="max-width: 100%; max-height: 250px; object-fit: contain;">
                        @else
                            <img src="{{ $image['src'] }}" 
                                 alt="{{ $image['alt'] }}"
                                 style="max-width: 100%; max-height: 250px; object-fit: contain;"
                                 onerror="this.style.display='none';">
                        @endif
                        <div style="text-align: center; font-size: 10px; color: #666; margin-top: 5px;">
                            {{ $image['alt'] }}
                        </div>
                    </div>
                    @if($index === 0 && count($images) > 1)
                        <div style="page-break-inside: avoid; margin: 10px 0;">
                            <strong style="font-size: 12px;">Additional Images:</strong>
                        </div>
                    @endif
                @endforeach
            @else
                <div class="product-image">
                    <div class="placeholder" style="display: flex;">
                        📦 No Image Available
                    </div>
                </div>
            @endif
            
            @if(isset($product->productinformation) && $product->productinformation->qr_code)
                <div class="qr-code">
                    <img src="{{ storage_path('app/public/qr_codes/' . $product->productinformation->qr_code) }}" 
                         alt="QR Code">
                    <p>Scan for more information</p>
                </div>
            @endif
        </div>
        
        <div class="product-details-section">
            <div class="product-title">{{ $product->description ?? 'N/A' }}</div>
            
            <div class="detail-section">
                <h3>Basic Information</h3>
                <div class="detail-grid">
                    <div class="detail-row">
                        <span class="detail-label">Brand:</span>
                        <span class="detail-value">{{ $product->brand->brand_name ?? ($product->brand_name ?? 'N/A') }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Brand Code:</span>
                        <span class="detail-value">{{ $product->brand_code ?? 'N/A' }}</span>
                    </div>
                    @if($product->oe_code)
                        <div class="detail-row">
                            <span class="detail-label">OE Code:</span>
                            <span class="detail-value">{{ $product->oe_code }}</span>
                        </div>
                    @endif
                    @if(isset($product->productinformation) && $product->productinformation->product_code)
                        <div class="detail-row">
                            <span class="detail-label">Product Code:</span>
                            <span class="detail-value">{{ $product->productinformation->product_code }}</span>
                        </div>
                    @endif
                    @if(isset($product->productinformation) && $product->productinformation->box)
                        <div class="detail-row">
                            <span class="detail-label">Box Type:</span>
                            <span class="detail-value">{{ $product->productinformation->box->box_name ?? 'N/A' }}</span>
                        </div>
                    @endif
                    @if(isset($product->productinformation) && $product->productinformation->unit)
                        <div class="detail-row">
                            <span class="detail-label">Unit:</span>
                            <span class="detail-value">{{ $product->productinformation->unit->name ?? 'N/A' }}</span>
                        </div>
                    @endif
                </div>
            </div>
            
            @if(isset($product->specifications) && count($product->specifications) > 0)
                <div class="detail-section">
                    <h3>Specifications</h3>
                    <table class="specifications-table">
                        <thead>
                            <tr>
                                <th>Specification</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($product->specifications as $spec)
                                <tr>
                                    <td>{{ $spec->headname ?? 'N/A' }}</td>
                                    <td>{{ $spec->value ?? 'N/A' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
            
            @if(isset($product->crosscars) && count($product->crosscars) > 0)
                <div class="detail-section">
                    <h3>Compatible Vehicles</h3>
                    <div class="vehicle-list">
                        @foreach($product->crosscars as $car)
                            <div class="vehicle-item">
                                {{ $car->brand ?? 'N/A' }} {{ $car->model ?? 'N/A' }} ({{ $car->year ?? 'N/A' }})
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
            
            @if(isset($product->crosscodes) && count($product->crosscodes) > 0)
                <div class="detail-section">
                    <h3>Alternate Part Numbers</h3>
                    <div class="cross-code-list">
                        @foreach($product->crosscodes as $code)
                            <div class="cross-code-item">
                                <strong>{{ $code->brand_name ?? 'N/A' }}:</strong> {{ $code->code ?? 'N/A' }}
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name', 'KOMIPARTS') }} - Auto Spare Parts Co., Ltd.</p>
        <p>For more information, visit our website or contact us directly.</p>
        <p>This product sheet was generated automatically on {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>
</body>
</html>
