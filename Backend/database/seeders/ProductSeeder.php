<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\ProductInformation;
use App\Models\Productname;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Product::truncate();
        // ProductInformation::truncate();

        // Ensure there is at least one supplier
        $supplier = Supplier::first() ?? Supplier::create([
            'supplier' => 'Demo Supplier',
            'name_surname' => 'Demo Contact',
            'occupation' => 'Sales',
            'code' => 'SUP-001',
            'address' => '123 Demo Street',
            'email' => 'demo@supplier.test',
            'phone_number' => '+994501112233',
            'whatsapp' => '+994501112233',
            'wechat_id' => null,
            'image' => null,
            'number_of_products' => null,
            'category_of_products' => null,
            'name_of_products' => null,
            'additional_note' => null,
        ]);

        // Fetch product names by code seeded earlier
        $pnOil = Productname::where('product_name_code', 'PN-OF-001')->first();
        $pnBrake = Productname::where('product_name_code', 'PN-BP-002')->first();
        $pnAlt = Productname::where('product_name_code', 'PN-ALT-003')->first();

        // Create Products first, then link ProductInformation to them
        $productsData = [
            [
                'supplier_id' => $supplier->id,
                'brand_id' => null,
                'brand_code' => null,
                'oe_code' => null,
                'description' => 'Oil filter',
                'qty' => 100,
                'min_qty' => 10,
                'purchase_price' => 5.5,
                'extra_cost' => 0,
                'cost_basis' => 5.5,
                'selling_price' => 8.9,
                'additional_note' => null,
                'status' => '1',
            ],
            [
                'supplier_id' => $supplier->id,
                'brand_id' => null,
                'brand_code' => null,
                'oe_code' => null,
                'description' => 'Brake pads',
                'qty' => 50,
                'min_qty' => 5,
                'purchase_price' => 12.0,
                'extra_cost' => 0,
                'cost_basis' => 12.0,
                'selling_price' => 18.5,
                'additional_note' => null,
                'status' => '1',
            ],
            [
                'supplier_id' => $supplier->id,
                'brand_id' => null,
                'brand_code' => null,
                'oe_code' => null,
                'description' => 'Alternator',
                'qty' => 15,
                'min_qty' => 2,
                'purchase_price' => 85.0,
                'extra_cost' => 5.0,
                'cost_basis' => 90.0,
                'selling_price' => 120.0,
                'additional_note' => null,
                'status' => '1',
            ],
        ];

        $productNames = [$pnOil, $pnBrake, $pnAlt];
        
        foreach ($productsData as $index => $productData) {
            if ($productNames[$index]) {
                // Create product
                $product = Product::create($productData);
                
                // Create corresponding product information
                ProductInformation::create([
                    'product_id' => $product->id,
                    'product_name_id' => $productNames[$index]->id,
                    'product_code' => $productNames[$index]->product_name_code,
                    'net_weight' => null,
                    'gross_weight' => null,
                    'unit_id' => null,
                    'box_id' => null,
                    'product_size_a' => null,
                    'product_size_b' => null,
                    'product_size_c' => null,
                    'volume' => null,
                    'label_id' => null,
                    'qr_code' => null,
                    'properties' => null,
                    'technical_image' => null,
                    'image' => null,
                    'size_mode' => null,
                    'additional_note' => null,
                ]);
            }
        }
    }
}