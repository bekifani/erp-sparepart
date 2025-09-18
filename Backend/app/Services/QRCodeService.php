<?php

namespace App\Services;

use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class QRCodeService
{
    /**
     * Generate QR code for a product
     */
    public static function generateProductQR($data)
    {
        try {
            // Create QR code content
            $qrContent = self::buildQRContent($data);
            
            // Generate unique filename
            $filename = 'product_' . ($data['product_id'] ?? 'unknown') . '_' . time() . '.png';
            $path = 'qr_codes/' . $filename;
            
            // Generate QR code
            $qrCode = QrCode::format('png')
                ->size(300)
                ->margin(2)
                ->errorCorrection('M')
                ->generate($qrContent);
            
            // Store the QR code
            Storage::disk('public')->put($path, $qrCode);
            
            \Log::info('QR code generated successfully', [
                'product_id' => $data['product_id'] ?? 'unknown',
                'path' => $path
            ]);
            
            return $path;
            
        } catch (\Exception $e) {
            \Log::error('QR code generation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }
    
    /**
     * Update existing QR code
     */
    public static function updateProductQR($data, $oldPath = null)
    {
        try {
            // Delete old QR code if exists
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            
            // Generate new QR code
            return self::generateProductQR($data);
            
        } catch (\Exception $e) {
            \Log::error('QR code update failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }
    
    /**
     * Generate QR code for sharing
     */
    public static function generateShareQR($url, $title = null)
    {
        try {
            $qrContent = $url;
            if ($title) {
                $qrContent = $title . "\n\n" . $url;
            }
            
            $filename = 'share_' . Str::random(10) . '_' . time() . '.png';
            $path = 'qr_codes/share/' . $filename;
            
            $qrCode = QrCode::format('png')
                ->size(200)
                ->margin(2)
                ->errorCorrection('M')
                ->generate($qrContent);
            
            Storage::disk('public')->put($path, $qrCode);
            
            return $path;
            
        } catch (\Exception $e) {
            \Log::error('Share QR code generation failed', [
                'error' => $e->getMessage(),
                'url' => $url
            ]);
            throw $e;
        }
    }
    
    /**
     * Build QR code content for product
     */
    private static function buildQRContent($data)
    {
        $content = [];
        
        // Add product information
        if (isset($data['product_id'])) {
            $content[] = "Product ID: " . $data['product_id'];
        }
        
        if (isset($data['brand_code'])) {
            $content[] = "Brand Code: " . $data['brand_code'];
        }
        
        if (isset($data['oe_code'])) {
            $content[] = "OE Code: " . $data['oe_code'];
        }
        
        if (isset($data['product_link'])) {
            $content[] = "Link: " . $data['product_link'];
        }
        
        // Add timestamp
        $content[] = "Generated: " . now()->format('Y-m-d H:i:s');
        
        return implode("\n", $content);
    }
    
    /**
     * Get QR code URL
     */
    public static function getQRCodeUrl($path)
    {
        if (!$path) {
            return null;
        }
        
        return Storage::disk('public')->url($path);
    }
    
    /**
     * Delete QR code
     */
    public static function deleteQRCode($path)
    {
        try {
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                return true;
            }
            return false;
        } catch (\Exception $e) {
            \Log::error('QR code deletion failed', [
                'error' => $e->getMessage(),
                'path' => $path
            ]);
            return false;
        }
    }
}