<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Categor;
use App\Models\Carmodel;
use App\Models\Productspecification;
use App\Models\Crosscar;
use App\Models\Crosscode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use App\Services\QRCodeService;
use Log;

class CatalogController extends Controller
{
    public function exportPdf(Request $request)
    {
        try {
            // Build query based on filters
            $query = Product::with(['brand', 'productinformation', 'productname.category']);

            
            // Apply filters
            if ($request->has('search') && !empty($request->search)) {
                $query->where('description', 'like', '%' . $request->search . '%');
            }
            
            if ($request->has('category') && !empty($request->category)) {
                // Filter by category through productnames relationship
                $query->whereHas('productname', function ($q) use ($request) {
                    $q->where('category_id', $request->category);
                });
            }
            
            if ($request->has('cross_code') && !empty($request->cross_code)) {
                $query->where('brand_code', 'like', '%' . $request->cross_code . '%');
            }
            
            if ($request->has('car_model') && !empty($request->car_model)) {
                // Join with crosscar table to filter by car model
                $query->whereHas('crosscars', function ($q) use ($request) {
                    $q->where('carmodel_id', $request->car_model);
                });
            }
            
            // Get products
            $products = $query->orderBy('description')->get();
            
            // Generate title based on filters
            $title = $this->generatePdfTitle($request);
            
            // Prepare data for PDF
            $data = [
                'products' => $products,
                'title' => $title,
                'generated_at' => now()->format('Y-m-d H:i:s'),
                'total_products' => $products->count(),
                'filters' => $this->getActiveFilters($request)
            ];
            
            // Generate PDF
            $pdf = Pdf::loadView('catalog.product', $data);
            $pdf->setPaper('A4', 'portrait');
            
            // Generate filename
            $filename = 'catalog-' . now()->format('Y-m-d') . '.pdf';
            if ($request->has('search') || $request->has('category') || $request->has('car_model') || $request->has('cross_code')) {
                $filename = 'catalog-filtered-' . now()->format('Y-m-d-H-i-s') . '.pdf';
            }
            
            return $pdf->download($filename);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function exportSingleProductPdf($id)
    {
        try {
            \Log::info('Starting single product PDF generation', ['product_id' => $id]);
            
            $product = Product::with([
                'brand', 
                'productinformation', 
                'productname.category',
                'productspecifications',
                'crosscars',
                'crosscodes'
            ])->findOrFail($id);
            
            \Log::info('Product found for PDF generation', [
                'product_id' => $product->id,
                'brand_code' => $product->brand_code,
                'description' => $product->description
            ]);
            
            // Prepare data for PDF
            $data = [
                'product' => $product,
                'generated_at' => now()->format('Y-m-d H:i:s')
            ];
            
            \Log::info('Generating PDF with data', ['data_keys' => array_keys($data)]);
            
            // Generate PDF
            \Log::info('Loading PDF view with data', ['product_id' => $product->id]);
            $pdf = Pdf::loadView('catalog.single-product', $data);
            $pdf->setPaper('A4', 'portrait');
            \Log::info('PDF view loaded successfully');
            
            // Generate filename
            $filename = 'product-' . ($product->brand_code ?? $product->id) . '-' . now()->format('Y-m-d') . '.pdf';
            
            \Log::info('PDF generated successfully', ['filename' => $filename]);
            
            return $pdf->download($filename);
            
        } catch (\Exception $e) {
            \Log::error('Single product PDF generation failed', [
                'product_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error generating product PDF: ' . $e->getMessage()
            ], 500);
        }
    }
    
    private function generatePdfTitle(Request $request)
    {
        $title = 'Product Catalog';
        $filters = [];
        
        if ($request->has('search') && !empty($request->search)) {
            $filters[] = 'Search: "' . $request->search . '"';
        }
        
        if ($request->has('category') && !empty($request->category)) {
            $category = Categor::find($request->category);
            if ($category) {
                $filters[] = 'Category: ' . $category->name;
            }
        }
        
        if ($request->has('car_model') && !empty($request->car_model)) {
            $carModel = Carmodel::find($request->car_model);
            if ($carModel) {
                $filters[] = 'Car Model: ' . $carModel->brand . ' ' . $carModel->model . ' (' . $carModel->year . ')';
            }
        }
        
        if ($request->has('cross_code') && !empty($request->cross_code)) {
            $filters[] = 'Cross Code: "' . $request->cross_code . '"';
        }
        
        if (!empty($filters)) {
            $title .= ' - ' . implode(', ', $filters);
        }
        
        return $title;
    }
    
    private function getActiveFilters(Request $request)
    {
        $filters = [];
        
        if ($request->has('search') && !empty($request->search)) {
            $filters['Search'] = $request->search;
        }
        
        if ($request->has('category') && !empty($request->category)) {
            $category = Categor::find($request->category);
            $filters['Category'] = $category ? $category->name : 'Unknown';
        }
        
        if ($request->has('car_model') && !empty($request->car_model)) {
            $carModel = Carmodel::find($request->car_model);
            $filters['Car Model'] = $carModel ? $carModel->brand . ' ' . $carModel->model . ' (' . $carModel->year . ')' : 'Unknown';
        }
        
        if ($request->has('cross_code') && !empty($request->cross_code)) {
            $filters['Cross Code'] = $request->cross_code;
        }
        
        return $filters;
    }
    
    public function getCatalogProducts(Request $request)
    {
        try {
            // Get locale from request header or default to 'en'
            $locale = $request->header('Accept-Language', 'en');
            if (!in_array($locale, ['en', 'az', 'ru', 'cn'])) {
                $locale = 'en';
            }
            
            // Create cache key based on request parameters
            $cacheKey = 'catalog_products_' . md5(json_encode([
                'page' => $request->get('page', 1),
                'size' => $request->get('size', 8),
                'search' => $request->get('search', ''),
                'category' => $request->get('category', ''),
                'car_model' => $request->get('car_model', ''),
                'cross_code' => $request->get('cross_code', ''),
                'locale' => $locale
            ]));
            
            // Try to get from cache first
            $cachedResult = Cache::get($cacheKey);
            if ($cachedResult) {
                \Log::info('Catalog products served from cache', ['cache_key' => $cacheKey]);
                return response()->json($cachedResult);
            }
            
            // Build query with necessary relationships for catalog display
            $query = Product::with(['brand', 'productinformation', 'productname.category']);

            
            // Enhanced search functionality with multi-language support
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                \Log::info('Catalog search initiated', ['search_term' => $searchTerm, 'locale' => $locale]);
                
                $query->where(function ($q) use ($searchTerm, $locale) {
                    // Search in basic product fields first
                    $q->where('description', 'like', '%' . $searchTerm . '%')
                      ->orWhere('brand_code', 'like', '%' . $searchTerm . '%');
                      
                    // Add OE code search if column exists
                    if (\Schema::hasColumn('products', 'oe_code')) {
                        $q->orWhere('oe_code', 'like', '%' . $searchTerm . '%');
                    }
                    
                    // Multi-language search in productnames
                    $q->orWhereHas('productname', function ($subQuery) use ($searchTerm, $locale) {
                        $subQuery->where('description_en', 'like', '%' . $searchTerm . '%')
                                ->orWhere('name_az', 'like', '%' . $searchTerm . '%')
                                ->orWhere('name_ru', 'like', '%' . $searchTerm . '%')
                                ->orWhere('name_cn', 'like', '%' . $searchTerm . '%');
                    });
                });
            }
            
            if ($request->has('category') && !empty($request->category)) {
                // Filter by category through productnames relationship
                $query->whereHas('productname', function ($q) use ($request) {
                    $q->where('category_id', $request->category);
                });
            }
            
            if ($request->has('cross_code') && !empty($request->cross_code)) {
                $query->where('brand_code', 'like', '%' . $request->cross_code . '%');
            }
            
            if ($request->has('car_model') && !empty($request->car_model)) {
                // Only use this if crosscars relationship exists
                try {
                    $query->whereHas('crosscars', function ($q) use ($request) {
                        $q->where('carmodel_id', $request->car_model);
                    });
                } catch (\Exception $e) {
                    \Log::warning('Crosscars relationship not available', ['error' => $e->getMessage()]);
                }
            }
            
            // Pagination
            $page = $request->get('page', 1);
            $size = $request->get('size', 8);
            
            \Log::info('Executing catalog query', [
                'page' => $page,
                'size' => $size,
                'has_search' => $request->has('search'),
                'has_category' => $request->has('category')
            ]);
            
            $products = $query->orderBy('description')
                ->paginate($size, ['*'], 'page', $page);
            
            \Log::info('Catalog query successful', ['count' => $products->count()]);
            
            // Transform products to include localized data
            $localizedProducts = $products->map(function ($product) use ($locale) {
                $productData = $product->toArray();
                
                // Add localized description
                $productData['localized_description'] = $product->getLocalizedDescription($locale);
                $productData['localized_name'] = $product->getLocalizedName($locale);
                $productData['available_languages'] = $product->getAvailableLanguages();
                $productData['current_locale'] = $locale;
                
                return $productData;
            });
            
            $result = [
                'success' => true,
                'data' => $products->setCollection($localizedProducts),
                'locale' => $locale
            ];
            
            // Cache the result for 15 minutes
            Cache::put($cacheKey, $result, 900);
            \Log::info('Catalog products cached', ['cache_key' => $cacheKey]);
            
            return response()->json($result);
            
        } catch (\Exception $e) {
            \Log::error('Catalog search error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_params' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching catalog products: ' . $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }
    
    public function getProduct($id)
    {
        try {
            $product = Product::with([
                'brand', 
                'productinformation',
                'productname.category',

                'productspecifications.specificationheadname',
                'crosscars.carmodel',
                'crosscodes.brandname'
            ])->find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching product: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProductSpecifications($id)
    {
        try {
            $product = Product::find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            $specifications = Productspecification::with([
                'specificationheadname'
            ])
            ->where('product_id', $id)
            ->orderBy('id')
            ->get();
            
            return response()->json([
                'success' => true,
                'data' => $specifications
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching product specifications: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProductCrossCars($id)
    {
        try {
            $product = Product::find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            $crossCars = Crosscar::with([
                'carmodel'
            ])
            ->where('product_id', $id)
            ->orderBy('id')
            ->get();
            
            return response()->json([
                'success' => true,
                'data' => $crossCars
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching product cross cars: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProductCrossCodes($id)
    {
        try {
            $product = Product::find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            $crossCodes = Crosscode::with([
                'brandname'
            ])
            ->where('product_id', $id)
            ->orderBy('id')
            ->get();
            
            return response()->json([
                'success' => true,
                'data' => $crossCodes
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching product cross codes: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Clear catalog cache
     */
    public function clearCache()
    {
        try {
            // Clear all catalog-related cache
            $pattern = 'catalog_products_*';
            $keys = Cache::getRedis()->keys($pattern);
            
            if (!empty($keys)) {
                Cache::getRedis()->del($keys);
                \Log::info('Catalog cache cleared', ['keys_count' => count($keys)]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Catalog cache cleared successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error clearing catalog cache', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error clearing cache: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get cache statistics
     */
    public function getCacheStats()
    {
        try {
            $pattern = 'catalog_products_*';
            $keys = Cache::getRedis()->keys($pattern);
            
            return response()->json([
                'success' => true,
                'cache_keys_count' => count($keys),
                'cache_memory_usage' => Cache::getRedis()->info()['used_memory_human'] ?? 'N/A'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting cache stats: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generate QR code for product sharing
     */
    public function generateProductQRCode(Request $request, $id)
    {
        try {
            $product = Product::with(['brand', 'productinformation'])->findOrFail($id);
            
            $qrData = [
                'product_id' => $product->id,
                'brand_code' => $product->brand_code,
                'oe_code' => $product->oe_code,
                'product_link' => $request->input('url', url("/public/catalog?product={$product->id}"))
            ];
            
            $qrPath = QRCodeService::generateShareQR(
                $qrData['product_link'],
                $request->input('title', $product->description)
            );
            
            $qrCodeUrl = QRCodeService::getQRCodeUrl($qrPath);
            
            return response()->json([
                'success' => true,
                'qr_code_url' => $qrCodeUrl,
                'qr_code_path' => $qrPath
            ]);
            
        } catch (\Exception $e) {
            \Log::error('QR code generation failed', [
                'error' => $e->getMessage(),
                'product_id' => $id
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error generating QR code: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Test PDF generation (simple version)
     */
    public function testPdf($id)
    {
        try {
            $product = Product::with(['brand', 'productinformation'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'product_id' => $product->id,
                'brand_code' => $product->brand_code,
                'description' => $product->description,
                'brand_name' => $product->brand ? $product->brand->brand_name : 'No brand',
                'has_product_info' => $product->productinformation ? true : false,
                'message' => 'Product found successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Test PDF generation with actual PDF creation
     */
    public function testPdfGeneration($id)
    {
        try {
            \Log::info('Testing PDF generation for product: ' . $id);
            
            $product = Product::with(['brand', 'productinformation'])->findOrFail($id);
            
            $data = [
                'product' => $product,
                'generated_at' => now()->format('Y-m-d H:i:s')
            ];
            
            \Log::info('Product data prepared', [
                'product_id' => $product->id,
                'brand_name' => $product->brand ? $product->brand->brand_name : 'No brand',
                'has_product_info' => $product->productinformation ? true : false
            ]);
            
            // Try to generate PDF
            $pdf = Pdf::loadView('catalog.single-product', $data);
            $pdf->setPaper('A4', 'portrait');
            
            \Log::info('PDF generated successfully');
            
            return response()->json([
                'success' => true,
                'message' => 'PDF generation test successful',
                'product_id' => $product->id
            ]);
            
        } catch (\Exception $e) {
            \Log::error('PDF generation test failed', [
                'product_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'PDF generation test failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
