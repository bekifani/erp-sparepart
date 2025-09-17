<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Accounttype;

class AccountTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Create immutable parent categories
        $income = Accounttype::create([
            'name' => 'Income (+)',
            'name_ch' => '收入 (+)',
            'name_az' => 'Gəlir (+)',
            'name_ru' => 'Доход (+)',
            'category' => 'income',
            'status' => 'active',
            'parent_id' => null
        ]);

        $expense = Accounttype::create([
            'name' => 'Expense (-)',
            'name_ch' => '支出 (-)',
            'name_az' => 'Xərc (-)',
            'name_ru' => 'Расход (-)',
            'category' => 'expense',
            'status' => 'active',
            'parent_id' => null
        ]);

        // Create sub-categories under Expense
        $expenseSubTypes = [
            [
                'name' => 'Purchase',
                'name_ch' => '采购',
                'name_az' => 'Alış',
                'name_ru' => 'Покупка'
            ],
            [
                'name' => 'Logistics',
                'name_ch' => '物流',
                'name_az' => 'Logistika',
                'name_ru' => 'Логистика'
            ],
            [
                'name' => 'Salary',
                'name_ch' => '工资',
                'name_az' => 'Maaş',
                'name_ru' => 'Зарплата'
            ],
            [
                'name' => 'Others',
                'name_ch' => '其他',
                'name_az' => 'Digər',
                'name_ru' => 'Прочие'
            ],
            [
                'name' => 'Withdrawals',
                'name_ch' => '提取',
                'name_az' => 'Çıxarış',
                'name_ru' => 'Изъятия'
            ],
            [
                'name' => 'Company expense',
                'name_ch' => '公司费用',
                'name_az' => 'Şirkət xərci',
                'name_ru' => 'Расходы компании'
            ]
        ];

        foreach ($expenseSubTypes as $subType) {
            Accounttype::create([
                'name' => $subType['name'],
                'name_ch' => $subType['name_ch'],
                'name_az' => $subType['name_az'],
                'name_ru' => $subType['name_ru'],
                'category' => 'expense',
                'status' => 'active',
                'parent_id' => $expense->id
            ]);
        }

        // Create sub-categories under Income
        $incomeSubTypes = [
            [
                'name' => 'Stocking',
                'name_ch' => '库存',
                'name_az' => 'Ehtiyat',
                'name_ru' => 'Складирование'
            ],
            [
                'name' => 'Import Payment',
                'name_ch' => '进口付款',
                'name_az' => 'İdxal ödənişi',
                'name_ru' => 'Импортный платеж'
            ],
            [
                'name' => 'Export Payment',
                'name_ch' => '出口付款',
                'name_az' => 'İxrac ödənişi',
                'name_ru' => 'Экспортный платеж'
            ]
        ];

        foreach ($incomeSubTypes as $subType) {
            Accounttype::create([
                'name' => $subType['name'],
                'name_ch' => $subType['name_ch'],
                'name_az' => $subType['name_az'],
                'name_ru' => $subType['name_ru'],
                'category' => 'income',
                'status' => 'active',
                'parent_id' => $income->id
            ]);
        }
    }
}
