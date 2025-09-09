<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Productname;

class ProductnameSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing for repeatable demo (optional)
        // Productname::truncate();

        $items = [
            [
                'hs_code' => '8409.91',
                'name_az' => 'Yağ filtri',
                'description_en' => 'Oil filter',
                'name_ru' => 'Масляный фильтр',
                'name_cn' => '机油滤清器',
                'category_id' => 1, // Assuming first category exists
                'product_name_code' => 'PN-OF-001',
                'additional_note' => 'Popular engine oil filter',
                'product_qty' => 0,
            ],
            [
                'hs_code' => '8708.93',
                'name_az' => 'Tormoz balatası',
                'description_en' => 'Brake pads',
                'name_ru' => 'Тормозные колодки',
                'name_cn' => '刹车片',
                'category_id' => 2, // Assuming second category exists
                'product_name_code' => 'PN-BP-002',
                'additional_note' => null,
                'product_qty' => 0,
            ],
            [
                'hs_code' => '8511.50',
                'name_az' => 'Alternator',
                'description_en' => 'Alternator',
                'name_ru' => 'Генератор',
                'name_cn' => '交流发电机',
                'category_id' => 3, // Assuming third category exists
                'product_name_code' => 'PN-ALT-003',
                'additional_note' => null,
                'product_qty' => 0,
            ],
        ];

        foreach ($items as $data) {
            Productname::firstOrCreate(
                ['product_name_code' => $data['product_name_code']],
                $data
            );
        }
    }
}