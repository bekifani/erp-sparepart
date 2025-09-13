<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\ProductInformation;
use App\Models\Boxe;
use App\Models\Label;

class ImageController extends Controller
{
    /**
     * Get product pictures from product_information table
     */
    public function getProductPictures()
    {
        try {
            $images = DB::table('product_information')
                ->select('id', 'product_id', 'product_name_id', 'product_code', 'image', 'created_at')
                ->whereNotNull('image')
                ->where('image', '!=', '')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name_id' => $item->product_name_id,
                        'product_code' => $item->product_code,
                        'product_name' => 'N/A', // Can be enhanced later with joins
                        'brand_name' => 'N/A',   // Can be enhanced later with joins
                        'image' => $item->image,
                        'image_type' => 'Product Picture',
                        'source_table' => 'product_information',
                        'created_at' => $item->created_at
                    ];
                });

            return response()->json($images);
        } catch (\Exception $e) {
            Log::error('Error fetching product pictures: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to fetch product pictures', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get technical images from product_information table
     */
    public function getTechnicalImages()
    {
        try {
            $images = DB::table('product_information')
                ->select('id', 'product_id', 'product_name_id', 'product_code', 'technical_image', 'created_at')
                ->whereNotNull('technical_image')
                ->where('technical_image', '!=', '')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name_id' => $item->product_name_id,
                        'product_code' => $item->product_code,
                        'product_name' => 'N/A', // Can be enhanced later with joins
                        'brand_name' => 'N/A',   // Can be enhanced later with joins
                        'image' => $item->technical_image,
                        'image_type' => 'Technical Image',
                        'source_table' => 'product_information',
                        'created_at' => $item->created_at
                    ];
                });

            return response()->json($images);
        } catch (\Exception $e) {
            Log::error('Error fetching technical images: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to fetch technical images', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get box images from boxes table
     */
    public function getBoxImages()
    {
        try {
            $images = Boxe::select('id', 'box_name', 'material', 'image', 'design_file', 'created_at')
                ->where(function($query) {
                    $query->whereNotNull('image')->where('image', '!=', '')
                          ->orWhere(function($q) {
                              $q->whereNotNull('design_file')->where('design_file', '!=', '');
                          });
                })
                ->with(['brandRelation:id,brand_name,brand_code', 'labelRelation:id,label_name'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->flatMap(function ($item) {
                    $results = [];
                    
                    // Add image if exists
                    if (!empty($item->image)) {
                        $results[] = [
                            'id' => $item->id,
                            'box_name' => $item->box_name,
                            'material' => $item->material,
                            'brand_name' => $item->brandRelation->brand_name ?? 'N/A',
                            'label_name' => $item->labelRelation->label_name ?? 'N/A',
                            'image' => $item->image,
                            'image_type' => 'Box Image',
                            'source_table' => 'boxes',
                            'created_at' => $item->created_at
                        ];
                    }
                    
                    // Add design file if exists
                    if (!empty($item->design_file)) {
                        $results[] = [
                            'id' => $item->id,
                            'box_name' => $item->box_name,
                            'material' => $item->material,
                            'brand_name' => $item->brandRelation->brand_name ?? 'N/A',
                            'label_name' => $item->labelRelation->label_name ?? 'N/A',
                            'image' => $item->design_file,
                            'image_type' => 'Box Design File',
                            'source_table' => 'boxes',
                            'created_at' => $item->created_at
                        ];
                    }
                    
                    return $results;
                });

            return response()->json($images);
        } catch (\Exception $e) {
            Log::error('Error fetching box images: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch box images'], 500);
        }
    }

    /**
     * Get label images from labels table
     */
    public function getLabelImages()
    {
        try {
            $images = Label::select('id', 'label_name', 'price', 'image', 'design_file', 'created_at')
                ->where(function($query) {
                    $query->whereNotNull('image')->where('image', '!=', '')
                          ->orWhere(function($q) {
                              $q->whereNotNull('design_file')->where('design_file', '!=', '');
                          });
                })
                ->with(['brandname:id,brand_name,brand_code'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->flatMap(function ($item) {
                    $results = [];
                    
                    // Add image if exists
                    if (!empty($item->image)) {
                        $results[] = [
                            'id' => $item->id,
                            'label_name' => $item->label_name,
                            'price' => $item->price,
                            'brand_name' => $item->brandname->brand_name ?? 'N/A',
                            'image' => $item->image,
                            'image_type' => 'Label Image',
                            'source_table' => 'labels',
                            'created_at' => $item->created_at
                        ];
                    }
                    
                    // Add design file if exists
                    if (!empty($item->design_file)) {
                        $results[] = [
                            'id' => $item->id,
                            'label_name' => $item->label_name,
                            'price' => $item->price,
                            'brand_name' => $item->brandname->brand_name ?? 'N/A',
                            'image' => $item->design_file,
                            'image_type' => 'Label Design File',
                            'source_table' => 'labels',
                            'created_at' => $item->created_at
                        ];
                    }
                    
                    return $results;
                });

            return response()->json($images);
        } catch (\Exception $e) {
            Log::error('Error fetching label images: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch label images'], 500);
        }
    }

    public function getOtherImages()
    {
        try {
            $images = collect();

            // Get images from customers table
            try {
                $customerImages = DB::table('customers')
                    ->select('id', 'name_surname as name', 'email', 'image', 'created_at')
                    ->whereNotNull('image')
                    ->where('image', '!=', '')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name ?? 'N/A',
                            'email' => $item->email ?? 'N/A',
                            'image' => $item->image,
                            'image_type' => 'Customer Image',
                            'source_table' => 'customers',
                            'created_at' => $item->created_at
                        ];
                    });
                $images = $images->merge($customerImages);
            } catch (\Exception $e) {
                Log::warning('Could not fetch customer images: ' . $e->getMessage());
            }

            // Get images from suppliers table
            try {
                $supplierImages = DB::table('suppliers')
                    ->select('id', 'company_name as name', 'email', 'images as image', 'created_at')
                    ->whereNotNull('images')
                    ->where('images', '!=', '')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name ?? 'N/A',
                            'email' => $item->email ?? 'N/A',
                            'image' => $item->image,
                            'image_type' => 'Supplier Image',
                            'source_table' => 'suppliers',
                            'created_at' => $item->created_at
                        ];
                    });
                $images = $images->merge($supplierImages);
            } catch (\Exception $e) {
                Log::warning('Could not fetch supplier images: ' . $e->getMessage());
            }

            // Get images from employees table
            try {
                $employeeImages = DB::table('employees')
                    ->select('id', 'name_surname as name', 'email', 'image', 'created_at')
                    ->whereNotNull('image')
                    ->where('image', '!=', '')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name ?? 'N/A',
                            'email' => $item->email ?? 'N/A',
                            'image' => $item->image,
                            'image_type' => 'Employee Image',
                            'source_table' => 'employees',
                            'created_at' => $item->created_at
                        ];
                    });
                $images = $images->merge($employeeImages);
            } catch (\Exception $e) {
                Log::warning('Could not fetch employee images: ' . $e->getMessage());
            }

            // Get images from compans table
            try {
                $companImages = DB::table('compans')
                    ->select('id', 'company_name as name', 'email', 'logo as image', 'created_at')
                    ->whereNotNull('logo')
                    ->where('logo', '!=', '')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name ?? 'N/A',
                            'email' => $item->email ?? 'N/A',
                            'image' => $item->image,
                            'image_type' => 'Company Logo',
                            'source_table' => 'compans',
                            'created_at' => $item->created_at
                        ];
                    });
                $images = $images->merge($companImages);
            } catch (\Exception $e) {
                Log::warning('Could not fetch company images: ' . $e->getMessage());
            }

            // Sort by created_at desc
            $images = $images->sortByDesc('created_at')->values();

            return response()->json($images);
        } catch (\Exception $e) {
            Log::error('Error fetching other images: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch other images'], 500);
        }
    }
}
