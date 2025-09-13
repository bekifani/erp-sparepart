<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplier;
use App\Models\SupplierImage;
use App\Models\Supplierproduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SupplierController extends BaseController
{
    protected $searchableColumns = ['supplier', 'name_surname', 'occupation', 'code', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'image', 'category_of_products', 'name_of_products', 'additional_note'];

    public function index(Request $request)
    {
        $sortBy = 'id';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Supplier::with(['products.productname.category', 'products.ProductInformation.productname.category', 'products', 'images'])
            ->orderBy($sortBy, $sortDir);
        if($filters){
            foreach ($filters as $filter) {
                $field = $filter['field'];
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                $query->where($field, $operator, $searchTerm);
            }
        }
        $supplier = $query->paginate($perPage);

        // Compute derived fields from related products and map related images for FE
        $supplier->getCollection()->transform(function ($s) {
            $products = $s->products ?? collect();
            
            // Get product names from productname relationship (products now have productname_id)
            $names = collect($products)->map(function ($p) {
                // First try direct productname relationship
                if ($p->productname) {
                    return $p->productname->name_az ?? null;
                }
                // Fallback to ProductInformation->productname
                $pi = $p->ProductInformation ?? null;
                return $pi && $pi->productname ? $pi->productname->name_az : null;
            })->filter()->unique()->values();

            // Get categories from productname->category relationship
            $categories = collect($products)->map(function ($p) {
                // First try direct productname->category relationship
                if ($p->productname && $p->productname->category) {
                    return $p->productname->category->category_en ?? null;
                }
                // Fallback to ProductInformation->productname->category
                $pi = $p->ProductInformation ?? null;
                return $pi && $pi->productname && $pi->productname->category ? $pi->productname->category->category_en : null;
            })->filter()->unique()->values();

            // Get main supplier product names (where is_primary = true)
            $mainSupplierProducts = $s->supplierProducts()
                ->where('is_primary', true)
                ->with(['product.productname', 'product.ProductInformation.productname'])
                ->get()
                ->map(function ($sp) {
                    $product = $sp->product;
                    if (!$product) return null;
                    
                    // First try direct productname relationship
                    if ($product->productname) {
                        return $product->productname->name_az ?? null;
                    }
                    // Fallback to ProductInformation->productname
                    $pi = $product->ProductInformation ?? null;
                    return $pi && $pi->productname ? $pi->productname->name_az : null;
                })
                ->filter()
                ->unique()
                ->values();

            // Set computed attributes for response
            $s->setAttribute('name_of_products', $names->join(', '));
            $s->setAttribute('category_of_products', $categories->join(', '));
            $s->setAttribute('number_of_products', collect($products)->count());
            $s->setAttribute('main_supplier_products', $mainSupplierProducts->join(', '));

            // map related images to a simple array of paths
            $imagePaths = ($s->images ?? collect())->pluck('image')->values();
            unset($s->images); // don't expose relation object
            $s->setAttribute('images', $imagePaths);

            return $s;
        });

        $data = [
            'data' => $supplier->toArray(),
            'current_page' => $supplier->currentPage(),
            'total_pages' => $supplier->lastPage(),
            'per_page' => $perPage,
        ];
        return response()->json($data);
    }

    public function all_suppliers(){
        $data = Supplier::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplier::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplier');
    }


    public function store(Request $request)
    {
        Log::info('Incoming request to store supplier:', $request->all());
    
        $validationRules = [
            "supplier" => "required|string|max:255",
            "name_surname" => "required|string|max:255",
            "occupation" => "nullable|string|max:255",
            "code" => "nullable|string|max:255",
            "address" => "nullable|string|max:255",
            "email" => "required|email|unique:suppliers,email",
            "phone_number" => "nullable|string|max:20|unique:suppliers,phone_number",
            "whatsapp" => "nullable|string|max:20|unique:suppliers,whatsapp",
            "wechat_id" => "nullable|string|max:255|unique:suppliers,wechat_id",
            "images" => "nullable|array",
            "images.*" => "nullable|string",
            "additional_note" => "nullable|string",
            "price_adjustment_type" => "nullable|string|in:increase,decrease",
            "price_adjustment_percent" => "nullable|numeric|min:0|max:100",
            "is_main_supplier" => "nullable|boolean",
            "selected_products" => "nullable|array",
            "selected_products.*" => "nullable|integer|exists:products,id",
        ];
    
        $validation = Validator::make($request->all(), $validationRules);
        if ($validation->fails()) {
            Log::error('Supplier validation failed:', $validation->errors()->toArray());
            
            // Enhanced error handling with descriptive messages
            $errors = $validation->errors();
            $friendlyErrors = [];
            
            foreach ($errors->all() as $error) {
                if (strpos($error, 'email has already been taken') !== false) {
                    $friendlyErrors[] = 'This email address is already registered with another supplier.';
                } elseif (strpos($error, 'phone number has already been taken') !== false) {
                    $friendlyErrors[] = 'This phone number is already registered with another supplier.';
                } elseif (strpos($error, 'whatsapp has already been taken') !== false) {
                    $friendlyErrors[] = 'This WhatsApp number is already registered with another supplier.';
                } elseif (strpos($error, 'wechat id has already been taken') !== false) {
                    $friendlyErrors[] = 'This WeChat ID is already registered with another supplier.';
                } else {
                    $friendlyErrors[] = $error;
                }
            }
            
            return $this->sendError($friendlyErrors[0] ?? "Invalid Values", ['errors' => $validation->errors()]);
        }
        
        $validated = $validation->validated();
        Log::info('Validated supplier data:', $validated);
    
        try {
            // Create supplier with all validated data except images
            $images = $validated['images'] ?? [];
            unset($validated['images']);
            
            // Handle main supplier logic
            $isMainSupplier = $validated['is_main_supplier'] ?? false;
            $selectedProducts = $validated['selected_products'] ?? [];
            unset($validated['is_main_supplier'], $validated['selected_products']);
            
            $supplier = Supplier::create($validated);
            Log::info('Supplier created successfully:', $supplier->toArray());
            
            // Handle supplier-product associations
            if ($isMainSupplier && !empty($selectedProducts)) {
                $this->handleMainSupplierAssociations($supplier->id, $selectedProducts);
            }
    
            // Handle images - process base64 data and file uploads
            if (!empty($images)) {
                $processedImages = [];
                
                Log::info('Processing supplier images:', [
                    'supplier_id' => $supplier->id,
                    'total_images' => count($images),
                    'image_types' => array_map(function($img) {
                        if (is_string($img) && strpos($img, 'data:image') === 0) {
                            return 'base64_camera';
                        } else {
                            return 'uploaded_file: ' . $img;
                        }
                    }, $images)
                ]);
                
                foreach ($images as $index => $imageData) {
                    $fileName = null;
                    
                    Log::info("Processing image {$index}:", [
                        'type' => gettype($imageData),
                        'is_base64' => is_string($imageData) && strpos($imageData, 'data:image') === 0,
                        'data_preview' => is_string($imageData) ? substr($imageData, 0, 50) : $imageData
                    ]);
                    
                    // Check if it's base64 data (camera capture)
                    if (is_string($imageData) && strpos($imageData, 'data:image') === 0) {
                        // Extract base64 data
                        $base64Data = substr($imageData, strpos($imageData, ',') + 1);
                        
                        // Decode and save as file
                        $decodedImageData = base64_decode($base64Data);
                        if ($decodedImageData !== false) {
                            // Use microtime to ensure unique filenames even when processing multiple images quickly
                            $fileName = 'supplier_image_' . time() . '_' . $index . '_' . rand(1000, 9999) . '.jpg';
                            $filePath = 'uploads/' . $fileName;
                            Storage::disk('public')->put($filePath, $decodedImageData);
                            Log::info("Base64 image saved:", ['fileName' => $fileName, 'size' => strlen($decodedImageData)]);
                        } else {
                            Log::error("Failed to decode base64 image at index {$index}");
                        }
                    } else {
                        // It's already a filename from file upload
                        $fileName = $imageData;
                        Log::info("Using uploaded filename:", ['fileName' => $fileName]);
                    }
                    
                    if ($fileName) {
                        $processedImages[] = [
                            'supplier_id' => $supplier->id,
                            'image' => $fileName,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        Log::info("Added to processed images:", ['fileName' => $fileName]);
                    } else {
                        Log::warning("No filename generated for image at index {$index}");
                    }
                }
                
                Log::info('Final processed images:', [
                    'count' => count($processedImages),
                    'filenames' => array_column($processedImages, 'image')
                ]);
                
                if (!empty($processedImages)) {
                    SupplierImage::insert($processedImages);
                    Log::info('Supplier images inserted successfully:', ['count' => count($processedImages)]);
                } else {
                    Log::warning('No images to insert - processedImages array is empty');
                }
            }
    
            return $this->sendResponse($supplier, "Supplier created successfully");
            
        } catch (\Exception $e) {
            Log::error('Supplier creation failed:', ['error' => $e->getMessage()]);
            return $this->sendError("Database Error", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $supplier = Supplier::with(['supplierProducts.product.productname', 'supplierProducts.product.ProductInformation.productname'])->findOrFail($id);
        
        // Get main supplier product IDs for this supplier
        $mainSupplierProductIds = $supplier->supplierProducts()
            ->where('is_primary', true)
            ->pluck('product_id')
            ->toArray();
        
        $supplier->setAttribute('main_supplier_product_ids', $mainSupplierProductIds);
        
        return $this->sendResponse($supplier, "supplier retrieved successfully");
    }


    public function update(Request $request, $id)
    {
        try {
            Log::info('Incoming request to update supplier:', ['id' => $id, 'data' => $request->all()]);
            
            $supplier = Supplier::findOrFail($id);
            $validationRules = [
                "supplier" => "required|string|max:255",
                "name_surname" => "required|string|max:255",
                "occupation" => "nullable|string|max:255",
                "code" => "nullable|string|max:255",
                "address" => "nullable|string|max:255",
                "email" => "required|email|unique:suppliers,email," . $id,
                "phone_number" => "nullable|string|max:20|unique:suppliers,phone_number," . $id,
                "whatsapp" => "nullable|string|max:20|unique:suppliers,whatsapp," . $id,
                "wechat_id" => "nullable|string|max:255|unique:suppliers,wechat_id," . $id,
                "images" => "nullable|array",
                "images.*" => "nullable|string",
                "additional_note" => "nullable|string",
                "price_adjustment_type" => "nullable|string|in:increase,decrease",
                "price_adjustment_percent" => "nullable|numeric|min:0|max:100",
                "is_main_supplier" => "nullable|boolean",
                "selected_products" => "nullable|array",
                "selected_products.*" => "nullable|integer|exists:products,id",
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                Log::error('Supplier update validation failed:', $validation->errors()->toArray());
                
                // Enhanced error handling with descriptive messages for update
                $errors = $validation->errors();
                $friendlyErrors = [];
                
                foreach ($errors->all() as $error) {
                    if (strpos($error, 'email has already been taken') !== false) {
                        $friendlyErrors[] = 'This email address is already registered with another supplier.';
                    } elseif (strpos($error, 'phone number has already been taken') !== false) {
                        $friendlyErrors[] = 'This phone number is already registered with another supplier.';
                    } elseif (strpos($error, 'whatsapp has already been taken') !== false) {
                        $friendlyErrors[] = 'This WhatsApp number is already registered with another supplier.';
                    } elseif (strpos($error, 'wechat id has already been taken') !== false) {
                        $friendlyErrors[] = 'This WeChat ID is already registered with another supplier.';
                    } else {
                        $friendlyErrors[] = $error;
                    }
                }
                
                return $this->sendError($friendlyErrors[0] ?? "Invalid Values", ['errors' => $validation->errors()]);
            }
            
            $validated = $validation->validated();
            Log::info('Validated supplier update data:', $validated);

            // Handle main supplier logic
            $isMainSupplier = filter_var($validated['is_main_supplier'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $selectedProducts = $validated['selected_products'] ?? [];
            unset($validated['is_main_supplier'], $validated['selected_products']);

            Log::info('Main supplier logic:', [
                'is_main_supplier' => $isMainSupplier,
                'is_main_supplier_type' => gettype($isMainSupplier),
                'selected_products' => $selectedProducts,
                'supplier_id' => $supplier->id
            ]);

            // Use images[] as-is for replace-or-no-change
            $images = $validated['images'] ?? null; // null means no change, array means replace
            unset($validated['images']);
            Log::info('Supplier.update: images', ['id' => $supplier->id, 'images' => $images]);

            $supplier->update($validated);
            Log::info('Supplier updated successfully:', $supplier->toArray());
            
            // Handle supplier-product associations - call if products are selected regardless of checkbox
            if (!empty($selectedProducts)) {
                $this->handleMainSupplierAssociations($supplier->id, $selectedProducts, $isMainSupplier);
            }
            
            if (is_array($images)) {
                // replace strategy: delete existing image rows then insert provided
                SupplierImage::where('supplier_id', $supplier->id)->delete();
                
                $processedImages = [];
                
                foreach ($images as $imageData) {
                    $fileName = null;
                    
                    // Check if it's base64 data (camera capture)
                    if (is_string($imageData) && strpos($imageData, 'data:image') === 0) {
                        // Extract base64 data
                        $base64Data = substr($imageData, strpos($imageData, ',') + 1);
                        
                        // Decode and save as file
                        $decodedImageData = base64_decode($base64Data);
                        if ($decodedImageData !== false) {
                            $fileName = 'supplier_image_' . time() . '_' . rand(1000, 9999) . '.jpg';
                            $filePath = 'uploads/' . $fileName;
                            Storage::disk('public')->put($filePath, $decodedImageData);
                        }
                    } else {
                        // It's already a filename from file upload
                        $fileName = $imageData;
                    }
                    
                    if ($fileName) {
                        $processedImages[] = [
                            'supplier_id' => $supplier->id,
                            'image' => $fileName,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
                
                if (!empty($processedImages)) {
                    SupplierImage::insert($processedImages);
                }
            }
            
            return $this->sendResponse($supplier, "supplier updated successfully");
            
        } catch (\Exception $e) {
            Log::error('Supplier update failed:', ['id' => $id, 'error' => $e->getMessage()]);
            return $this->sendError("Database Error", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('Incoming request to delete supplier:', ['id' => $id]);
            
            $supplier = Supplier::with('images')->findOrFail($id);
            
            // Delete associated supplier-product relationships first
            Supplierproduct::where('supplier_id', $id)->delete();
            Log::info('Deleted supplier-product relationships for supplier:', ['id' => $id]);
            
            // Delete associated image files and records
            foreach (($supplier->images ?? collect()) as $img) {
                if (!empty($img->image)) {
                    $this->deleteFile('uploads/' . $img->image);
                }
            }
            
            // Delete supplier images records
            SupplierImage::where('supplier_id', $id)->delete();
            
            // Delete the supplier
            $supplier->delete();
            Log::info('Supplier deleted successfully:', ['id' => $id]);
            
            return $this->sendResponse(1, "supplier deleted successfully");
            
        } catch (\Exception $e) {
            Log::error('Supplier deletion failed:', ['id' => $id, 'error' => $e->getMessage()]);
            return $this->sendError("Database Error", ['error' => $e->getMessage()]);
        }
    }

    public function deleteFile($filePath) {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Handle main supplier associations - ensure only one primary supplier per product
     */
    private function handleMainSupplierAssociations($supplierId, $productIds, $isMainSupplier = true)
    {
        try {
            DB::beginTransaction();
            
            foreach ($productIds as $productId) {
                if ($isMainSupplier) {
                    // First, remove any existing primary supplier for this product
                    Supplierproduct::where('product_id', $productId)
                        ->where('is_primary', true)
                        ->update(['is_primary' => false]);
                    
                    // Then set this supplier as primary for the product
                    Supplierproduct::updateOrCreate(
                        [
                            'supplier_id' => $supplierId,
                            'product_id' => $productId
                        ],
                        [
                            'is_primary' => true
                        ]
                    );
                } else {
                    // Just create association without primary status
                    Supplierproduct::updateOrCreate(
                        [
                            'supplier_id' => $supplierId,
                            'product_id' => $productId
                        ],
                        [
                            'is_primary' => false
                        ]
                    );
                }
            }
            
            DB::commit();
            Log::info('Supplier-product associations updated successfully', [
                'supplier_id' => $supplierId,
                'product_ids' => $productIds,
                'is_main_supplier' => $isMainSupplier
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to update supplier-product associations', [
                'supplier_id' => $supplierId,
                'product_ids' => $productIds,
                'is_main_supplier' => $isMainSupplier,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
