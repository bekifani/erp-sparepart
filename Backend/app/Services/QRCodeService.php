<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeService
{
    /**
     * Generate QR code for product information
     * 
     * @param array $data - Contains brand_code, oe_code, product_link
     * @return string - File path of generated QR code
     */
    public static function generateProductQR($data)
    {
        // Create QR content with brand code, OE code, and product link
        $qrContent = json_encode([
            'brand_code' => $data['brand_code'] ?? '',
            'oe_code' => $data['oe_code'] ?? '',
            'product_link' => $data['product_link'] ?? '',
            'generated_at' => now()->toISOString(),
        ]);

        // Generate unique filename (just the filename, not the path)
        $filename = 'product_' . ($data['product_id'] ?? 'unknown') . '_' . time() . '.svg';
        $fullPath = 'qr_codes/' . $filename;
        
        // Generate QR code image using SVG format (no imagick required)
        $qrCode = QrCode::format('svg')
            ->size(200)
            ->margin(2)
            ->generate($qrContent);

        // Store the QR code image
        Storage::disk('public')->put($fullPath, $qrCode);

        return $filename; // Return only the filename
    }

    /**
     * Update existing QR code or generate new one
     */
    public static function updateProductQR($productInfo, $oldQrFilename = null)
    {
        // Delete old QR code if exists
        if ($oldQrFilename && Storage::disk('public')->exists('qr_codes/' . $oldQrFilename)) {
            Storage::disk('public')->delete('qr_codes/' . $oldQrFilename);
        }

        // Generate new QR code
        return self::generateProductQR([
            'product_id' => $productInfo['product_id'],
            'brand_code' => $productInfo['brand_code'] ?? '',
            'oe_code' => $productInfo['oe_code'] ?? '',
            'product_link' => url("/product/{$productInfo['product_id']}"),
        ]);
    }
}
