<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Product Catalog' }}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin: 0;
        }
        
        .header .subtitle {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        .filters {
            background-color: #f8fafc;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 5px;
            border-left: 4px solid #2563eb;
        }
        
        .filters h3 {
            font-size: 12px;
            font-weight: bold;
            margin: 0 0 5px 0;
            color: #374151;
        }
        
        .filters .filter-item {
            display: inline-block;
            margin-right: 15px;
            font-size: 9px;
        }
        
        .filters .filter-label {
            font-weight: bold;
            color: #6b7280;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 10px;
            background-color: #fff;
            page-break-inside: avoid;
        }
        
        .product-image {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 8px;
            background-color: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .product-image .placeholder {
            color: #9ca3af;
            font-size: 12px;
        }
        
        .product-info h3 {
            font-size: 11px;
            font-weight: bold;
            margin: 0 0 5px 0;
            color: #1f2937;
            line-height: 1.2;
        }
        
        .product-details {
            font-size: 9px;
            line-height: 1.3;
        }
        
        .product-details .detail-row {
            margin-bottom: 3px;
        }
        
        .product-details .label {
            font-weight: bold;
            color: #6b7280;
            display: inline-block;
            width: 60px;
        }
        
        .product-details .value {
            color: #374151;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .no-products {
            text-align: center;
            padding: 40px;
            color: #6b7280;
            font-style: italic;
        }
        
        .specifications {
            margin-top: 10px;
            font-size: 8px;
        }
        
        .specifications .spec-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            padding: 2px 0;
            border-bottom: 1px dotted #e5e7eb;
        }
        
        .specifications .spec-label {
            font-weight: bold;
            color: #6b7280;
        }
        
        .specifications .spec-value {
            color: #374151;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title ?? 'Product Catalog' }}</h1>
        <div class="subtitle">
            Generated on {{ $generated_at ?? now()->format('F j, Y \a\t g:i A') }}
            @if(isset($total_products))
                | {{ $total_products }} products
            @endif
        </div>
    </div>

    @if(isset($filters) && count($filters) > 0)
        <div class="filters">
            <h3>Active Filters:</h3>
            @foreach($filters as $key => $value)
                <span class="filter-item">
                    <span class="filter-label">{{ $key }}:</span> {{ $value }}
                </span>
            @endforeach
        </div>
    @endif

    @if(isset($products) && count($products) > 0)
        <div class="products-grid">
            @foreach($products as $index => $product)
                @if($index > 0 && $index % 6 == 0)
                    <div class="page-break"></div>
                @endif
                
                <div class="product-card">
                    <div class="product-image">
                        @if(isset($product->productinformation) && $product->productinformation->technical_image)
                            <img src="{{ public_path('storage/' . $product->productinformation->technical_image) }}" 
                                 alt="{{ $product->description ?? 'Product Image' }}"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        @elseif(isset($product->productinformation) && $product->productinformation->image)
                            <img src="{{ public_path('storage/' . $product->productinformation->image) }}" 
                                 alt="{{ $product->description ?? 'Product Image' }}"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        @endif
                        <div class="placeholder" style="display: {{ (isset($product->productinformation) && ($product->productinformation->technical_image || $product->productinformation->image)) ? 'none' : 'flex' }};">
                            📦 No Image
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <h3>{{ $product->description ?? 'N/A' }}</h3>
                        
                        <div class="product-details">
                            <div class="detail-row">
                                <span class="label">Brand:</span>
                                <span class="value">{{ $product->brand->brand_name ?? 'N/A' }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Code:</span>
                                <span class="value">{{ $product->brand_code ?? 'N/A' }}</span>
                            </div>
                            @if($product->oe_code)
                                <div class="detail-row">
                                    <span class="label">OE Code:</span>
                                    <span class="value">{{ $product->oe_code }}</span>
                                </div>
                            @endif
                            @if(isset($product->productinformation) && $product->productinformation->product_code)
                                <div class="detail-row">
                                    <span class="label">Product Code:</span>
                                    <span class="value">{{ $product->productinformation->product_code }}</span>
                                </div>
                            @endif
                        </div>
                        
                        @if(isset($product->specifications) && count($product->specifications) > 0)
                            <div class="specifications">
                                <strong>Specifications:</strong>
                                @foreach($product->specifications as $spec)
                                    <div class="spec-row">
                                        <span class="spec-label">{{ $spec->headname ?? 'N/A' }}:</span>
                                        <span class="spec-value">{{ $spec->value ?? 'N/A' }}</span>
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search criteria or filters.</p>
        </div>
    @endif

    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name', 'KOMIPARTS') }} - Auto Spare Parts Co., Ltd.</p>
        <p>This catalog was generated automatically. For the most up-to-date information, please visit our website.</p>
    </div>
</body>
</html>
