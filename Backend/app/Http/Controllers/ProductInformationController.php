<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\ProductInformation;
use App\Models\Product;
use App\Models\Boxe;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductInformationController extends BaseController
{
    protected $searchableColumns = [
        'products.description',
        'brandnames.brand_name',
        'products.brand_code',
        'boxes.box_name',
        'labels.label_name'
    ];

    // Map frontend alias fields to actual DB columns for filtering/sorting
    private function mapField(string $field): string
    {
        $map = [
            'brand_name' => 'brandnames.brand_name',
            'brand_code_name' => 'products.brand_code',
            'box_name' => 'boxes.box_name',
            'label_name' => 'labels.label_name',
            'unit_name' => 'units.name',
            'description' => 'products.description',
        ];
        return $map[$field] ?? $field;
    }

    public function index(Request $request)
    {
        $sortBy = 'product_information.id';
        $sortDir = 'desc';
        if(!empty($request['sort'])){
            $candidate = $request['sort'][0]['field'];
            $sortBy = $this->mapField($candidate);
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        
        $query = ProductInformation::with(['brandname', 'box', 'label', 'unit'])
            // switch to products and brandnames via products
            ->leftJoin('products', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select([
                'product_information.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                'boxes.box_name',
                'labels.label_name',
                DB::raw('units.name as unit_name'),
                DB::raw('products.description as description'),
                DB::raw('products.oe_code as oe_code'),
            ])
            ->orderBy($sortBy, $sortDir);
            
        if($filters){
            foreach ($filters as $filter) {
                $field = $this->mapField($filter['field']);
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                $query->where($field, $operator, $searchTerm);
            }
        }
        $productinformation = $query->paginate($perPage); 
        
        $data = [
            "data" => $productinformation->toArray(), 
            'current_page' => $productinformation->currentPage(),
            'total_pages' => $productinformation->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productInformations(){
        $data = ProductInformation::with(['brandname', 'box', 'label', 'unit'])
            ->leftJoin('products', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select([
                'product_information.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                'boxes.box_name',
                'labels.label_name',
                DB::raw('units.name as unit_name'),
                DB::raw('products.description as description'),
                DB::raw('products.oe_code as oe_code'),
            ])
            ->get();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        
        $results = ProductInformation::with(['brandname', 'box', 'label', 'unit'])
            ->leftJoin('products', 'product_information.product_id', '=', 'products.id')
            ->leftJoin('brandnames', 'products.brand_id', '=', 'brandnames.id')
            ->leftJoin('boxes', 'product_information.box_id', '=', 'boxes.id')
            ->leftJoin('labels', 'product_information.label_id', '=', 'labels.id')
            ->leftJoin('units', 'product_information.unit_id', '=', 'units.id')
            ->select([
                'product_information.*',
                'brandnames.brand_name',
                DB::raw('products.brand_code as brand_code_name'),
                'boxes.box_name',
                'labels.label_name',
                DB::raw('units.name as unit_name'),
                DB::raw('products.description as description'),
                DB::raw('products.oe_code as oe_code'),
            ])
            ->where(function ($query) use ($searchTerm) {
                $query->where('products.description', 'like', "%$searchTerm%")
                      ->orWhere('brandnames.brand_name', 'like', "%$searchTerm%")
                      ->orWhere('products.brand_code', 'like', "%$searchTerm%")
                      ->orWhere('boxes.box_name', 'like', "%$searchTerm%")
                      ->orWhere('labels.label_name', 'like', "%$searchTerm%");
            })
            ->paginate(20);
            
        return $this->sendResponse($results , 'search results for productinformation');
    }


    public function store(Request $request)
    {
        $validationRules = [
          // now product_id is required
          "product_id"=>"required|exists:products,id",
          // product_name_id is not required anymore
          "product_name_id"=>"nullable|exists:productnames,id",
          "product_code"=>"nullable|string|max:255",
          // moved fields removed from validation
          "qty"=>"nullable|numeric|min:0",
          "net_weight"=>"nullable|numeric",
          "gross_weight"=>"nullable|numeric",
          "unit_id"=>"required|exists:units,id",
          "box_id"=>"nullable|exists:boxes,id",
          "box_type"=>"nullable|string|in:2D,3D",
          "product_size_a"=>"nullable|numeric",
          "product_size_b"=>"nullable|numeric",
          "product_size_c"=>"nullable|numeric",
          "volume"=>"nullable|numeric",
          "label_id"=>"nullable|exists:labels,id",
          "properties"=>"nullable|string|max:255",
          "pictures"=>"nullable|array",
          "pictures.*"=>"nullable|string",
          "technical_image"=>"nullable|string",
          "image"=>"nullable|string",
          "size_mode"=>"nullable|string|max:255",
          "additional_note"=>"nullable|string",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        // Auto-generate product_code if missing
        if (!array_key_exists('product_code', $validated) || $validated['product_code'] === null || $validated['product_code'] === '') {
            $validated['product_code'] = 'PI-' . ($validated['product_id'] ?? 'X') . '-' . time();
        }

        // Handle box selection and auto-fill sizes for 3D boxes
        if (!empty($validated['box_id'])) {
            $box = Boxe::find($validated['box_id']);
            if ($box) {
                $validated['box_type'] = $box->material === '3D' ? '3D' : '2D';
                
                // Auto-fill sizes for 3D boxes
                if ($validated['box_type'] === '3D') {
                    $validated['product_size_a'] = $box->size_a ?? $validated['product_size_a'];
                    $validated['product_size_b'] = $box->size_b ?? $validated['product_size_b'];
                    $validated['product_size_c'] = $box->size_c ?? $validated['product_size_c'];
                }
            }
        }

        // Handle multiple images array
        if (isset($validated['pictures']) && is_array($validated['pictures'])) {
            $validated['pictures'] = array_filter($validated['pictures']); // Remove empty values
        }

        $productinformation = ProductInformation::create($validated);

        // Auto-generate QR code
        try {
            $product = Product::with('brandname')->find($validated['product_id']);
            if ($product) {
                \Log::info('Generating QR code for product: ' . $product->id);
                $qrPath = QRCodeService::generateProductQR([
                    'product_id' => $product->id,
                    'brand_code' => $product->brand_code ?? '',
                    'oe_code' => $product->oe_code ?? '',
                    'product_link' => url("/product/{$product->id}"),
                ]);
                \Log::info('QR code generated: ' . $qrPath);
                $productinformation->update(['qr_code' => $qrPath]);
                $productinformation->refresh(); // Refresh to get updated QR code
                \Log::info('QR code saved to database: ' . $productinformation->qr_code);
            }
        } catch (\Exception $e) {
            \Log::error('QR Code generation failed: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            // Continue without QR code if generation fails
        }
        return $this->sendResponse($productinformation, "productinformation created succesfully");
    }

    public function show($id)
    {
        $productinformation = ProductInformation::findOrFail($id);
        return $this->sendResponse($productinformation, "");
    }


    public function update(Request $request, $id)
    {
        $productinformation = ProductInformation::findOrFail($id);
         $validationRules = [
          "product_id"=>"required|exists:products,id",
          "product_name_id"=>"nullable|exists:productnames,id",
          "product_code"=>"nullable|string|max:255",
          "qty"=>"nullable|numeric|min:0",
          "net_weight"=>"nullable|numeric",
          "gross_weight"=>"nullable|numeric",
          "unit_id"=>"required|exists:units,id",
          "box_id"=>"nullable|exists:boxes,id",
          "box_type"=>"nullable|string|in:2D,3D",
          "product_size_a"=>"nullable|numeric",
          "product_size_b"=>"nullable|numeric",
          "product_size_c"=>"nullable|numeric",
          "volume"=>"nullable|numeric",
          "label_id"=>"nullable|exists:labels,id",
          "properties"=>"nullable|string|max:255",
          "technical_image"=>"nullable|string",
          "image"=>"nullable|string",
          "pictures"=>"nullable|array",
          "pictures.*"=>"nullable|string",
          "size_mode"=>"nullable|string|max:255",
          "additional_note"=>"nullable|string",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        $oldQrPath = $productinformation->qr_code;
        
        // Handle box selection and auto-fill sizes for 3D boxes
        if (!empty($validated['box_id'])) {
            $box = Boxe::find($validated['box_id']);
            if ($box) {
                $validated['box_type'] = $box->material === '3D' ? '3D' : '2D';
                
                // Auto-fill sizes for 3D boxes
                if ($validated['box_type'] === '3D') {
                    $validated['product_size_a'] = $box->size_a ?? $validated['product_size_a'];
                    $validated['product_size_b'] = $box->size_b ?? $validated['product_size_b'];
                    $validated['product_size_c'] = $box->size_c ?? $validated['product_size_c'];
                }
            }
        }

        // Handle multiple images array
        if (isset($validated['pictures']) && is_array($validated['pictures'])) {
            $validated['pictures'] = array_filter($validated['pictures']); // Remove empty values
        }

        $productinformation->update($validated);

        // Regenerate QR code if product changed
        try {
            $product = Product::with('brandname')->find($validated['product_id']);
            if ($product) {
                $qrPath = QRCodeService::updateProductQR([
                    'product_id' => $product->id,
                    'brand_code' => $product->brand_code ?? '',
                    'oe_code' => $product->oe_code ?? '',
                    'product_link' => url("/product/{$product->id}"),
                ], $oldQrPath);
                $productinformation->update(['qr_code' => $qrPath]);
                $productinformation->refresh(); // Refresh to get updated QR code
            }
        } catch (\Exception $e) {
            \Log::error('QR Code update failed: ' . $e->getMessage());
            // Continue without QR code if generation fails
        }
        return $this->sendResponse($productinformation, "productinformation updated successfully");
    }

    public function destroy($id)
    {
        $productinformation = ProductInformation::findOrFail($id);
        $productinformation->delete();

        $this->deleteFile($productinformation->technical_image);$this->deleteFile($productinformation->image);

        //delete files uploaded
        return $this->sendResponse(1, "productinformation deleted succesfully");
    }

    public function deleteFile($filePath) {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }
}
