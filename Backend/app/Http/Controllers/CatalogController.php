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

class CatalogController extends Controller
{
    public function exportPdf(Request $request)
    {
        try {
            // Build query based on filters
            $query = Product::with(['brand', 'categor', 'productinformation']);
            
            // Apply filters
            if ($request->has('search') && !empty($request->search)) {
                $query->where('description', 'like', '%' . $request->search . '%');
            }
            
            if ($request->has('category') && !empty($request->category)) {
                $query->where('category_id', $request->category);
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
            $query = Product::with(['brand', 'categor', 'productinformation']);
            
            // Apply filters
            if ($request->has('search') && !empty($request->search)) {
                $query->where('description', 'like', '%' . $request->search . '%');
            }
            
            if ($request->has('category') && !empty($request->category)) {
                $query->where('category_id', $request->category);
            }
            
            if ($request->has('cross_code') && !empty($request->cross_code)) {
                $query->where('brand_code', 'like', '%' . $request->cross_code . '%');
            }
            
            if ($request->has('car_model') && !empty($request->car_model)) {
                $query->whereHas('crosscars', function ($q) use ($request) {
                    $q->where('carmodel_id', $request->car_model);
                });
            }
            
            // Pagination
            $page = $request->get('page', 1);
            $size = $request->get('size', 8);
            
            $products = $query->orderBy('description')
                ->paginate($size, ['*'], 'page', $page);
            
            return response()->json([
                'success' => true,
                'data' => $products
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching catalog products: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function getProduct($id)
    {
        try {
            $product = Product::with([
                'brand', 
                'categor', 
                'productinformation',
                'productspecifications.specificationheadname',
                'crosscars.carmodel',
                'crosscodes.brand'
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
}
