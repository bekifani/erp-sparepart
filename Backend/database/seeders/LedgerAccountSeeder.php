<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LedgerAccount;

class LedgerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create main account classes (parent accounts)
        
        // ASSETS
        $assets = LedgerAccount::create([
            'code' => '1000',
            'name' => 'Assets',
            'name_ru' => 'Активы',
            'name_az' => 'Aktivlər',
            'name_ch' => '资产',
            'ledger_type' => 'general',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => null,
            'is_active' => true,
            'description' => 'Main assets account'
        ]);

        // Current Assets
        $currentAssets = LedgerAccount::create([
            'code' => '1100',
            'name' => 'Current Assets',
            'name_ru' => 'Оборотные активы',
            'name_az' => 'Cari aktivlər',
            'name_ch' => '流动资产',
            'ledger_type' => 'general',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $assets->id,
            'is_active' => true,
            'description' => 'Current assets'
        ]);

        LedgerAccount::create([
            'code' => '1110',
            'name' => 'Cash',
            'name_ru' => 'Наличные',
            'name_az' => 'Nağd pul',
            'name_ch' => '现金',
            'ledger_type' => 'subsidiary',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $currentAssets->id,
            'is_active' => true,
            'description' => 'Cash on hand'
        ]);

        LedgerAccount::create([
            'code' => '1120',
            'name' => 'Bank Account',
            'name_ru' => 'Банковский счет',
            'name_az' => 'Bank hesabı',
            'name_ch' => '银行账户',
            'ledger_type' => 'subsidiary',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $currentAssets->id,
            'is_active' => true,
            'description' => 'Bank account'
        ]);

        LedgerAccount::create([
            'code' => '1130',
            'name' => 'Accounts Receivable',
            'name_ru' => 'Дебиторская задолженность',
            'name_az' => 'Debitor borcları',
            'name_ch' => '应收账款',
            'ledger_type' => 'subsidiary',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $currentAssets->id,
            'is_active' => true,
            'description' => 'Accounts receivable from customers'
        ]);

        LedgerAccount::create([
            'code' => '1140',
            'name' => 'Inventory',
            'name_ru' => 'Запасы',
            'name_az' => 'Ehtiyatlar',
            'name_ch' => '库存',
            'ledger_type' => 'subsidiary',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $currentAssets->id,
            'is_active' => true,
            'description' => 'Inventory and stock'
        ]);

        // Fixed Assets
        $fixedAssets = LedgerAccount::create([
            'code' => '1200',
            'name' => 'Fixed Assets',
            'name_ru' => 'Основные средства',
            'name_az' => 'Əsas vəsaitlər',
            'name_ch' => '固定资产',
            'ledger_type' => 'general',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $assets->id,
            'is_active' => true,
            'description' => 'Fixed assets'
        ]);

        LedgerAccount::create([
            'code' => '1210',
            'name' => 'Equipment',
            'name_ru' => 'Оборудование',
            'name_az' => 'Avadanlıq',
            'name_ch' => '设备',
            'ledger_type' => 'subsidiary',
            'account_class' => 'asset',
            'is_contra' => false,
            'parent_id' => $fixedAssets->id,
            'is_active' => true,
            'description' => 'Equipment and machinery'
        ]);

        // LIABILITIES
        $liabilities = LedgerAccount::create([
            'code' => '2000',
            'name' => 'Liabilities',
            'name_ru' => 'Обязательства',
            'name_az' => 'Öhdəliklər',
            'name_ch' => '负债',
            'ledger_type' => 'general',
            'account_class' => 'liability',
            'is_contra' => false,
            'parent_id' => null,
            'is_active' => true,
            'description' => 'Main liabilities account'
        ]);

        // Current Liabilities
        $currentLiabilities = LedgerAccount::create([
            'code' => '2100',
            'name' => 'Current Liabilities',
            'name_ru' => 'Краткосрочные обязательства',
            'name_az' => 'Cari öhdəliklər',
            'name_ch' => '流动负债',
            'ledger_type' => 'general',
            'account_class' => 'liability',
            'is_contra' => false,
            'parent_id' => $liabilities->id,
            'is_active' => true,
            'description' => 'Current liabilities'
        ]);

        LedgerAccount::create([
            'code' => '2110',
            'name' => 'Accounts Payable',
            'name_ru' => 'Кредиторская задолженность',
            'name_az' => 'Kreditor borcları',
            'name_ch' => '应付账款',
            'ledger_type' => 'subsidiary',
            'account_class' => 'liability',
            'is_contra' => false,
            'parent_id' => $currentLiabilities->id,
            'is_active' => true,
            'description' => 'Accounts payable to suppliers'
        ]);

        LedgerAccount::create([
            'code' => '2120',
            'name' => 'Accrued Expenses',
            'name_ru' => 'Начисленные расходы',
            'name_az' => 'Hesablanmış xərclər',
            'name_ch' => '应计费用',
            'ledger_type' => 'subsidiary',
            'account_class' => 'liability',
            'is_contra' => false,
            'parent_id' => $currentLiabilities->id,
            'is_active' => true,
            'description' => 'Accrued expenses'
        ]);

        // EQUITY
        $equity = LedgerAccount::create([
            'code' => '3000',
            'name' => 'Equity',
            'name_ru' => 'Капитал',
            'name_az' => 'Kapital',
            'name_ch' => '权益',
            'ledger_type' => 'general',
            'account_class' => 'equity',
            'is_contra' => false,
            'parent_id' => null,
            'is_active' => true,
            'description' => 'Main equity account'
        ]);

        LedgerAccount::create([
            'code' => '3100',
            'name' => 'Owner\'s Equity',
            'name_ru' => 'Собственный капитал',
            'name_az' => 'Sahibkar kapitalı',
            'name_ch' => '所有者权益',
            'ledger_type' => 'subsidiary',
            'account_class' => 'equity',
            'is_contra' => false,
            'parent_id' => $equity->id,
            'is_active' => true,
            'description' => 'Owner\'s equity'
        ]);

        LedgerAccount::create([
            'code' => '3200',
            'name' => 'Retained Earnings',
            'name_ru' => 'Нераспределенная прибыль',
            'name_az' => 'Bölüşdürülməmiş mənfəət',
            'name_ch' => '留存收益',
            'ledger_type' => 'subsidiary',
            'account_class' => 'equity',
            'is_contra' => false,
            'parent_id' => $equity->id,
            'is_active' => true,
            'description' => 'Retained earnings'
        ]);

        // REVENUE
        $revenue = LedgerAccount::create([
            'code' => '4000',
            'name' => 'Revenue',
            'name_ru' => 'Доходы',
            'name_az' => 'Gəlirlər',
            'name_ch' => '收入',
            'ledger_type' => 'general',
            'account_class' => 'revenue',
            'is_contra' => false,
            'parent_id' => null,
            'is_active' => true,
            'description' => 'Main revenue account'
        ]);

        LedgerAccount::create([
            'code' => '4100',
            'name' => 'Sales Revenue',
            'name_ru' => 'Выручка от продаж',
            'name_az' => 'Satış gəlirləri',
            'name_ch' => '销售收入',
            'ledger_type' => 'subsidiary',
            'account_class' => 'revenue',
            'is_contra' => false,
            'parent_id' => $revenue->id,
            'is_active' => true,
            'description' => 'Sales revenue'
        ]);

        LedgerAccount::create([
            'code' => '4200',
            'name' => 'Service Revenue',
            'name_ru' => 'Доходы от услуг',
            'name_az' => 'Xidmət gəlirləri',
            'name_ch' => '服务收入',
            'ledger_type' => 'subsidiary',
            'account_class' => 'revenue',
            'is_contra' => false,
            'parent_id' => $revenue->id,
            'is_active' => true,
            'description' => 'Service revenue'
        ]);

        // EXPENSES
        $expenses = LedgerAccount::create([
            'code' => '5000',
            'name' => 'Expenses',
            'name_ru' => 'Расходы',
            'name_az' => 'Xərclər',
            'name_ch' => '费用',
            'ledger_type' => 'general',
            'account_class' => 'expense',
            'is_contra' => false,
            'parent_id' => null,
            'is_active' => true,
            'description' => 'Main expenses account'
        ]);

        LedgerAccount::create([
            'code' => '5100',
            'name' => 'Cost of Goods Sold',
            'name_ru' => 'Себестоимость проданных товаров',
            'name_az' => 'Satılan malların maya dəyəri',
            'name_ch' => '销售成本',
            'ledger_type' => 'subsidiary',
            'account_class' => 'expense',
            'is_contra' => false,
            'parent_id' => $expenses->id,
            'is_active' => true,
            'description' => 'Cost of goods sold'
        ]);

        LedgerAccount::create([
            'code' => '5200',
            'name' => 'Operating Expenses',
            'name_ru' => 'Операционные расходы',
            'name_az' => 'Əməliyyat xərcləri',
            'name_ch' => '营业费用',
            'ledger_type' => 'subsidiary',
            'account_class' => 'expense',
            'is_contra' => false,
            'parent_id' => $expenses->id,
            'is_active' => true,
            'description' => 'Operating expenses'
        ]);

        LedgerAccount::create([
            'code' => '5300',
            'name' => 'Administrative Expenses',
            'name_ru' => 'Административные расходы',
            'name_az' => 'İnzibati xərclər',
            'name_ch' => '管理费用',
            'ledger_type' => 'subsidiary',
            'account_class' => 'expense',
            'is_contra' => false,
            'parent_id' => $expenses->id,
            'is_active' => true,
            'description' => 'Administrative expenses'
        ]);
    }
}
