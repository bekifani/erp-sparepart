<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Productstatus;

class ProductStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coreStatuses = [
            [
                'status_key' => 'processing',
                'status_name_en' => 'Processing',
                'status_name_ch' => '处理中',
                'status_name_az' => 'Emal edilir',
                'description_en' => 'Customer order confirmed. Not yet ordered from suppliers.',
                'description_ch' => '客户订单已确认。尚未向供应商下单。',
                'description_az' => 'Müştəri sifarişi təsdiqləndi. Hələ təchizatçılardan sifariş verilməyib.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 1,
                'color_code' => '#3B82F6'
            ],
            [
                'status_key' => 'in_production',
                'status_name_en' => 'In Production',
                'status_name_ch' => '生产中',
                'status_name_az' => 'İstehsalda',
                'description_en' => 'Order has been placed with the supplier(s).',
                'description_ch' => '已向供应商下单。',
                'description_az' => 'Təchizatçı(lar)a sifariş verildi.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 2,
                'color_code' => '#F59E0B'
            ],
            [
                'status_key' => 'on_the_way',
                'status_name_en' => 'On the Way',
                'status_name_ch' => '运输中',
                'status_name_az' => 'Yolda',
                'description_en' => 'Supplier has shipped the goods; we have not received them.',
                'description_ch' => '供应商已发货；我们尚未收到货物。',
                'description_az' => 'Təchizatçı malları göndərdi; biz hələ almamışıq.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 3,
                'color_code' => '#8B5CF6'
            ],
            [
                'status_key' => 'in_warehouse',
                'status_name_en' => 'In the Warehouse',
                'status_name_ch' => '在仓库',
                'status_name_az' => 'Anbarda',
                'description_en' => 'Goods have been received at our warehouse.',
                'description_ch' => '货物已在我们的仓库收到。',
                'description_az' => 'Mallar anbarımızda qəbul edildi.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 4,
                'color_code' => '#10B981'
            ],
            [
                'status_key' => 'ready_to_ship',
                'status_name_en' => 'Ready to Ship',
                'status_name_ch' => '准备发货',
                'status_name_az' => 'Göndərilməyə hazır',
                'description_en' => 'Order is packaged, labeled, and ready for the carrier.',
                'description_ch' => '订单已包装、贴标，准备交给承运商。',
                'description_az' => 'Sifariş qablaşdırılıb, etiketlənib və daşıyıcıya hazırdır.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 5,
                'color_code' => '#06B6D4'
            ],
            [
                'status_key' => 'loading_goods',
                'status_name_en' => 'Loading Goods',
                'status_name_ch' => '装货中',
                'status_name_az' => 'Mal yüklənir',
                'description_en' => 'Order is being physically loaded onto the delivery vehicle. Editing invoices/packing lists is disabled.',
                'description_ch' => '订单正在物理装载到运输车辆上。编辑发票/装箱单被禁用。',
                'description_az' => 'Sifariş fiziki olaraq çatdırılma nəqliyyat vasitəsinə yüklənir. Faktura/qablaşdırma siyahılarının redaktəsi deaktivdir.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => true, // This status locks editing
                'sort_order' => 6,
                'color_code' => '#F97316'
            ],
            [
                'status_key' => 'shipped',
                'status_name_en' => 'Shipped',
                'status_name_ch' => '已发货',
                'status_name_az' => 'Göndərildi',
                'description_en' => 'Order has been dispatched to the customer.',
                'description_ch' => '订单已发送给客户。',
                'description_az' => 'Sifariş müştəriyə göndərildi.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 7,
                'color_code' => '#22C55E'
            ],
            [
                'status_key' => 'cancelled',
                'status_name_en' => 'Cancelled',
                'status_name_ch' => '已取消',
                'status_name_az' => 'Ləğv edildi',
                'description_en' => 'Order or specific items have been cancelled.',
                'description_ch' => '订单或特定项目已被取消。',
                'description_az' => 'Sifariş və ya xüsusi məhsullar ləğv edildi.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 8,
                'color_code' => '#EF4444'
            ],
            [
                'status_key' => 'in_stock',
                'status_name_en' => 'In Stock',
                'status_name_ch' => '有库存',
                'status_name_az' => 'Stokda',
                'description_en' => 'Goods are available in own warehouse (for stock items).',
                'description_ch' => '货物在自己的仓库中可用（用于库存物品）。',
                'description_az' => 'Mallar öz anbarımızda mövcuddur (stok məhsulları üçün).',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 9,
                'color_code' => '#16A34A'
            ],
            [
                'status_key' => 'out_of_stock',
                'status_name_en' => 'Out of Stock',
                'status_name_ch' => '缺货',
                'status_name_az' => 'Stokda yoxdur',
                'description_en' => 'Goods are not available (for stock items).',
                'description_ch' => '货物不可用（用于库存物品）。',
                'description_az' => 'Mallar mövcud deyil (stok məhsulları üçün).',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 10,
                'color_code' => '#DC2626'
            ],
            [
                'status_key' => 'in_supplier_warehouse',
                'status_name_en' => 'In Supplier Warehouse',
                'status_name_ch' => '在供应商仓库',
                'status_name_az' => 'Təchizatçı anbarında',
                'description_en' => 'Goods are owned by us but stored at the supplier\'s location.',
                'description_ch' => '货物归我们所有，但存储在供应商的位置。',
                'description_az' => 'Mallar bizimdir, lakin təchizatçının yerində saxlanılır.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 11,
                'color_code' => '#7C3AED'
            ],
            [
                'status_key' => 'packaging_at_supplier',
                'status_name_en' => 'Packaging at Supplier',
                'status_name_ch' => '供应商包装',
                'status_name_az' => 'Təchizatçıda qablaşdırma',
                'description_en' => 'We have sent packaging materials to the supplier; they are packaging our order.',
                'description_ch' => '我们已向供应商发送包装材料；他们正在包装我们的订单。',
                'description_az' => 'Biz təchizatçıya qablaşdırma materialları göndərdik; onlar sifarişimizi qablaşdırırlar.',
                'is_core_status' => true,
                'is_active' => true,
                'locks_editing' => false,
                'sort_order' => 12,
                'color_code' => '#EC4899'
            ]
        ];

        foreach ($coreStatuses as $status) {
            Productstatus::updateOrCreate(
                ['status_key' => $status['status_key']],
                $status
            );
        }
    }
}
