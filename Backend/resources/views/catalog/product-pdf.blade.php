<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #2563eb;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .product-info {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .product-image {
            display: table-cell;
            width: 200px;
            vertical-align: top;
            padding-right: 20px;
        }
        .product-image img {
            max-width: 180px;
            max-height: 180px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .product-details {
            display: table-cell;
            vertical-align: top;
        }
        .detail-row {
            margin-bottom: 8px;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            font-size: 16px;
            color: #2563eb;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .specs-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .specs-table th,
        .specs-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .specs-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .cross-item {
            background-color: #f8f9fa;
            padding: 8px;
            margin-bottom: 5px;
            border-radius: 4px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        .no-data {
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Product Datasheet</h1>
        <p>{{ $product->description }}</p>
        <p>Generated on {{ $generated_at }}</p>
    </div>

    <div class="product-info">
        <div class="product-image">
            @if($product->productinformation && $product->productinformation->image)
                <img src="{{ public_path('storage/' . $product->productinformation->image) }}" alt="{{ $product->description }}">
            @else
                <div style="width: 180px; height: 180px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; border-radius: 8px;">
                    <span style="color: #666;">No Image</span>
                </div>
            @endif
        </div>
        <div class="product-details">
            <div class="detail-row">
                <span class="detail-label">Brand:</span>
                <span>{{ $product->brand->brand_name ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Brand Code:</span>
                <span>{{ $product->brand_code ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span>{{ $product->description ?? 'N/A' }}</span>
            </div>
            @if($product->oe_code)
            <div class="detail-row">
                <span class="detail-label">OE Code:</span>
                <span>{{ $product->oe_code }}</span>
            </div>
            @endif
            <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span>{{ $product->productname->category->category_en ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Selling Price:</span>
                <span>${{ $product->selling_price ?? '0.00' }}</span>
            </div>
        </div>
    </div>

    @if($product->productspecifications && $product->productspecifications->count() > 0)
    <div class="section">
        <h2>Specifications</h2>
        <table class="specs-table">
            <thead>
                <tr>
                    <th>Specification</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                @foreach($product->productspecifications as $spec)
                <tr>
                    <td>{{ $spec->specificationheadname->headname ?? 'N/A' }}</td>
                    <td>{{ $spec->value ?? 'N/A' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($product->productinformation)
    <div class="section">
        <h2>Physical Properties</h2>
        <table class="specs-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                @if($product->productinformation->net_weight)
                <tr>
                    <td>Net Weight</td>
                    <td>{{ $product->productinformation->net_weight }} kg</td>
                </tr>
                @endif
                @if($product->productinformation->gross_weight)
                <tr>
                    <td>Gross Weight</td>
                    <td>{{ $product->productinformation->gross_weight }} kg</td>
                </tr>
                @endif
                @if($product->productinformation->product_size_a)
                <tr>
                    <td>Length</td>
                    <td>{{ $product->productinformation->product_size_a }} cm</td>
                </tr>
                @endif
                @if($product->productinformation->product_size_b)
                <tr>
                    <td>Width</td>
                    <td>{{ $product->productinformation->product_size_b }} cm</td>
                </tr>
                @endif
                @if($product->productinformation->product_size_c)
                <tr>
                    <td>Thickness</td>
                    <td>{{ $product->productinformation->product_size_c }} cm</td>
                </tr>
                @endif
                @if($product->productinformation->volume)
                <tr>
                    <td>Volume</td>
                    <td>{{ $product->productinformation->volume }} cm³</td>
                </tr>
                @endif
            </tbody>
        </table>
        
        @if($product->productinformation->properties)
        <div style="margin-top: 15px;">
            <strong>Properties:</strong>
            <p>{{ $product->productinformation->properties }}</p>
        </div>
        @endif
        
        @if($product->productinformation->additional_note)
        <div style="margin-top: 15px;">
            <strong>Additional Notes:</strong>
            <p>{{ $product->productinformation->additional_note }}</p>
        </div>
        @endif
    </div>
    @endif

    @if($product->crosscars && $product->crosscars->count() > 0)
    <div class="section">
        <h2>Compatible Vehicles</h2>
        @foreach($product->crosscars as $crosscar)
        <div class="cross-item">
            <strong>{{ $crosscar->carmodel->car_model ?? 'N/A' }}</strong>
            @if($crosscar->year_from && $crosscar->year_to)
                <span>({{ $crosscar->year_from }}-{{ $crosscar->year_to }})</span>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    @if($product->crosscodes && $product->crosscodes->count() > 0)
    <div class="section">
        <h2>Cross References</h2>
        @foreach($product->crosscodes as $crosscode)
        <div class="cross-item">
            <strong>{{ $crosscode->brandname->brand_name ?? 'N/A' }}:</strong>
            {{ $crosscode->cross_code ?? 'N/A' }}
        </div>
        @endforeach
    </div>
    @endif

    <div class="footer">
        <p>This datasheet was generated automatically from our product database.</p>
        <p>For more information, please contact our sales team.</p>
    </div>
</body>
</html>
