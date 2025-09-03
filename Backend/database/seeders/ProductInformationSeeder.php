<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductInformation;
use App\Models\Productname;
use App\Models\Brandname;
use App\Models\Unit;
use Carbon\Carbon;

class ProductInformationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Ensure at least one Unit exists (e.g., Piece)
        $unit = Unit::firstOrCreate(
            ['name' => 'Piece'],
            ['base_unit' => null, 'base_value' => 1]
        );

        // Ensure Brandnames exist and capture their IDs
        $brandA = Brandname::firstOrCreate(
            ['brand_code' => 'BR-001'],
            ['brand_name' => 'Brand A', 'name_az' => 'Brand A', 'name_ru' => 'Бренд A', 'name_cn' => '品牌A', 'number_of_products' => 0]
        );
        $brandB = Brandname::firstOrCreate(
            ['brand_code' => 'BR-002'],
            ['brand_name' => 'Brand B', 'name_az' => 'Brand B', 'name_ru' => 'Бренд B', 'name_cn' => '品牌B', 'number_of_products' => 0]
        );
        $brandC = Brandname::firstOrCreate(
            ['brand_code' => 'BR-003'],
            ['brand_name' => 'Brand C', 'name_az' => 'Brand C', 'name_ru' => 'Бренд C', 'name_cn' => '品牌C', 'number_of_products' => 0]
        );

        // Ensure Productnames exist and capture their IDs
        $pnBrakePads = Productname::firstOrCreate(
            ['product_name_code' => 'PN-BP-002'],
            [
                'hs_code' => '8708.93',
                'name_az' => 'Tormoz balatası',
                'description_en' => 'Brake pads',
                'name_ru' => 'Тормозные колодки',
                'name_cn' => '刹车片',
                'categories' => 'Brakes, Safety',
                'additional_note' => null,
                'product_qty' => 0,
            ]
        );
        $pnAirFilter = Productname::firstOrCreate(
            ['product_name_code' => 'PN-AF-004'],
            [
                'hs_code' => '8421.23',
                'name_az' => 'Hava filtri',
                'description_en' => 'Air filter',
                'name_ru' => 'Воздушный фильтр',
                'name_cn' => '空气滤清器',
                'categories' => 'Filters, Intake',
                'additional_note' => null,
                'product_qty' => 0,
            ]
        );
        $pnOilFilter = Productname::firstOrCreate(
            ['product_name_code' => 'PN-OF-001'],
            [
                'hs_code' => '8409.91',
                'name_az' => 'Yağ filtri',
                'description_en' => 'Oil filter',
                'name_ru' => 'Масляный фильтр',
                'name_cn' => '机油滤清器',
                'categories' => 'Filters, Engine',
                'additional_note' => 'Popular engine oil filter',
                'product_qty' => 0,
            ]
        );
        $pnCabinFilter = Productname::firstOrCreate(
            ['product_name_code' => 'PN-CF-005'],
            [
                'hs_code' => '8421.39',
                'name_az' => 'Salon filtri',
                'description_en' => 'Cabin filter',
                'name_ru' => 'Салонный фильтр',
                'name_cn' => '空调滤清器',
                'categories' => 'Filters, HVAC',
                'additional_note' => null,
                'product_qty' => 0,
            ]
        );

        $rows = [
            [
                'product_name_id' => $pnBrakePads->id,
                'product_code'    => 'PRD-1001',
                'brand_code'      => $brandA->id,
                'oe_code'         => 'OE-001',
                'description'     => 'Front brake pad set',
                'net_weight'      => 1.2,
                'gross_weight'    => 1.4,
                'unit_id'         => $unit->id,
                'box_id'          => null,
                'product_size_a'  => 120,
                'product_size_b'  => 60,
                'product_size_c'  => 35,
                'volume'          => 0.25,
                'label_id'        => null,
                'qr_code'         => null,
                'properties'      => 'Material: Semi-metallic',
                'technical_image' => null,
                'image'           => null,
                'size_mode'       => 'mm',
                'additional_note' => 'Popular model',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'product_name_id' => $pnAirFilter->id,
                'product_code'    => 'PRD-1002',
                'brand_code'      => $brandB->id,
                'oe_code'         => 'OE-002',
                'description'     => 'Air filter element',
                'net_weight'      => 0.3,
                'gross_weight'    => 0.35,
                'unit_id'         => $unit->id,
                'box_id'          => null,
                'product_size_a'  => 200,
                'product_size_b'  => 150,
                'product_size_c'  => 50,
                'volume'          => 0.20,
                'label_id'        => null,
                'qr_code'         => null,
                'properties'      => 'Efficiency: 99%',
                'technical_image' => null,
                'image'           => null,
                'size_mode'       => 'mm',
                'additional_note' => null,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'product_name_id' => $pnOilFilter->id,
                'product_code'    => 'PRD-1003',
                'brand_code'      => $brandA->id,
                'oe_code'         => 'OE-003',
                'description'     => 'Oil filter spin-on',
                'net_weight'      => 0.5,
                'gross_weight'    => 0.55,
                'unit_id'         => $unit->id,
                'box_id'          => null,
                'product_size_a'  => 95,
                'product_size_b'  => 95,
                'product_size_c'  => 100,
                'volume'          => 0.09,
                'label_id'        => null,
                'qr_code'         => null,
                'properties'      => 'Thread: M20x1.5',
                'technical_image' => null,
                'image'           => null,
                'size_mode'       => 'mm',
                'additional_note' => 'Fits multiple models',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'product_name_id' => $pnCabinFilter->id,
                'product_code'    => 'PRD-1004',
                'brand_code'      => $brandC->id,
                'oe_code'         => 'OE-004',
                'description'     => 'Cabin filter activated carbon',
                'net_weight'      => 0.4,
                'gross_weight'    => 0.45,
                'unit_id'         => $unit->id,
                'box_id'          => null,
                'product_size_a'  => 230,
                'product_size_b'  => 210,
                'product_size_c'  => 35,
                'volume'          => 0.17,
                'label_id'        => null,
                'qr_code'         => null,
                'properties'      => 'Activated carbon layer',
                'technical_image' => null,
                'image'           => null,
                'size_mode'       => 'mm',
                'additional_note' => null,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
        ];

        ProductInformation::insert($rows);
    }
}