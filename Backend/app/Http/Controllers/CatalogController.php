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
            $pdf = Pdf::loadView('catalog.pdf', $data);
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
            // Build query with necessary relationships for catalog display
            $query = Product::with(['brand', 'productinformation', 'productname.category']);
            
            // Simplified search functionality to avoid relationship errors
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                \Log::info('Catalog search initiated', ['search_term' => $searchTerm]);
                
                $query->where(function ($q) use ($searchTerm) {
                    // Search in basic product fields first
                    $q->where('description', 'like', '%' . $searchTerm . '%')
                      ->orWhere('brand_code', 'like', '%' . $searchTerm . '%');
                      
                    // Add OE code search if column exists
                    if (\Schema::hasColumn('products', 'oe_code')) {
                        $q->orWhere('oe_code', 'like', '%' . $searchTerm . '%');
                    }
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
            
            return response()->json([
                'success' => true,
                'data' => $products
            ]);
            
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
}
