<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categor;

class CategorSeeder extends Seeder
{
    public function run(): void
    {
        // Categor::truncate();

        $categories = [
            [
                'category_en' => 'Filters',
                'category_ru' => 'Фильтры',
                'category_cn' => '过滤器',
                'category_az' => 'Filtrlər',
                'category_code' => 'CAT-FLT',
            ],
            [
                'category_en' => 'Brakes',
                'category_ru' => 'Тормоза',
                'category_cn' => '制动系统',
                'category_az' => 'Tormoz',
                'category_code' => 'CAT-BRK',
            ],
            [
                'category_en' => 'Electrical',
                'category_ru' => 'Электрика',
                'category_cn' => '电器',
                'category_az' => 'Elektrik',
                'category_code' => 'CAT-ELC',
            ],
            [
                'category_en' => 'Engine',
                'category_ru' => 'Двигатель',
                'category_cn' => '发动机',
                'category_az' => 'Mühərrik',
                'category_code' => 'CAT-ENG',
            ],
            [
                'category_en' => 'Safety',
                'category_ru' => 'Безопасность',
                'category_cn' => '安全',
                'category_az' => 'Təhlükəsizlik',
                'category_code' => 'CAT-SFT',
            ],
        ];

        foreach ($categories as $c) {
            Categor::firstOrCreate(['category_code' => $c['category_code']], $c);
        }
    }
}