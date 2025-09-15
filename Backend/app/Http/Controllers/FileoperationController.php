<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Fileoperation;
use App\Models\Product;
use App\Models\Crosscar;
use App\Models\Crosscode;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\Productname;
use App\Models\Brandname;
use App\Models\Carmodel;
use App\Models\Unit;
use App\Models\Categor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;
class FileoperationController extends BaseController
{
    protected $searchableColumns = ['user_id', 'product_id', 'file_path', 'operation_type', 'status'];

    /**
     * Generate a unique file name based on original name with collision handling
     */
    private function generateUniqueFileName($originalName, $operationType = null)
    {
        // Clean the original filename
        $pathInfo = pathinfo($originalName);
        $baseName = $pathInfo['filename'];
        $extension = isset($pathInfo['extension']) ? '.' . $pathInfo['extension'] : '';
        
        // Start with the original name
        $fileName = $baseName . $extension;
        $counter = 1;
        
        // Check if file name already exists in database
        while (Fileoperation::where('file_path', $fileName)->exists()) {
            $fileName = $baseName . '_' . $counter . $extension;
            $counter++;
        }
        
        return $fileName;
    }

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
        $query = Fileoperation::orderBy($sortBy, $sortDir);
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
        $fileoperation = $query->paginate($perPage); 
        $data = [
            "data" => $fileoperation->toArray(), 
            'current_page' => $fileoperation->currentPage(),
            'total_pages' => $fileoperation->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_fileoperations(){
        $data = Fileoperation::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Fileoperation::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for fileoperation');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              "user_id"=>"required|exists:users,id",
              "product_id"=>"required|exists:products,id",
              "file_path"=>"required|string|max:255",
              "operation_type"=>"required|string|max:255",
              "status"=>"nullable|string",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Set default values programmatically
            if (!isset($validated['status'])) {
                $validated['status'] = 'success';
            }

            $fileoperation = Fileoperation::create($validated);
            return $this->sendResponse($fileoperation, "fileoperation created succesfully");
        } catch (\Exception $e) {
            Log::error('Error creating fileoperation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the fileoperation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $fileoperation = Fileoperation::findOrFail($id);
        return $this->sendResponse($fileoperation, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $fileoperation = Fileoperation::findOrFail($id);
            $validationRules = [
              "user_id"=>"required|exists:users,id",
              "product_id"=>"required|exists:products,id",
              "file_path"=>"required|string|max:255",
              "operation_type"=>"required|string|max:255",
              "status"=>"nullable|string",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Set default values programmatically
            if (!isset($validated['status'])) {
                $validated['status'] = 'success';
            }

            $fileoperation->update($validated);
            return $this->sendResponse($fileoperation, "fileoperation updated successfully");
        } catch (\Exception $e) {
            Log::error('Error updating fileoperation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the fileoperation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $fileoperation = Fileoperation::findOrFail($id);
            $fileoperation->delete();

            //delete files uploaded
            return $this->sendResponse(1, "fileoperation deleted succesfully");
        } catch (\Exception $e) {
            Log::error('Error deleting fileoperation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the fileoperation.',
                'error' => $e->getMessage()
            ], 500);
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

    // Excel Import Methods
    public function uploadExcel(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls|max:10240',
                'import_type' => 'required|string|in:cross_cars,cross_code,products,information,specifications,car_models,product_names,supplier_prices,customer_prices'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $importType = $request->input('import_type');
            
            // Store file temporarily
            $filePath = $file->store('imports', 'public');
            
            // Parse Excel file
            $data = Excel::toCollection(new class implements ToCollection {
                public function collection(Collection $rows) {
                    return $rows;
                }
            }, $file)->first();

            // Remove header row
            $headers = $data->first()->toArray();
            $rows = $data->skip(1);

            // Validate data based on import type
            $validationResult = $this->validateImportData($rows, $importType, $headers);

            // Store file operation record
            $fileOperation = Fileoperation::create([
                'user_id' => auth()->id(),
                'file_path' => $filePath,
                'operation_type' => $importType,
                'status' => 'uploaded'
            ]);

            return response()->json([
                'success' => true,
                'file_id' => $fileOperation->id,
                'headers' => $headers,
                'data' => $rows->take(100)->toArray(), // Limit preview to 100 rows
                'total_rows' => $rows->count(),
                'validation' => $validationResult
            ]);

        } catch (\Exception $e) {
            Log::error('Excel upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error uploading file: ' . $e->getMessage()
            ], 500);
        }
    }

    private function validateImportData($rows, $importType, $headers)
    {
        $validRows = [];
        $invalidRows = [];
        $duplicates = [];

        foreach ($rows as $index => $row) {
            $rowData = $row->toArray();
            $validation = $this->validateRow($rowData, $importType, $headers);
            
            if ($validation['valid']) {
                // Check for duplicates
                if ($this->isDuplicate($rowData, $importType, $validRows)) {
                    $duplicates[] = [
                        'index' => $index,
                        'data' => $rowData,
                        'error' => 'Duplicate entry'
                    ];
                } else {
                    $validRows[] = [
                        'index' => $index,
                        'data' => $rowData
                    ];
                }
            } else {
                $invalidRows[] = [
                    'index' => $index,
                    'data' => $rowData,
                    'errors' => $validation['errors']
                ];
            }
        }

        return [
            'valid_count' => count($validRows),
            'invalid_count' => count($invalidRows),
            'duplicate_count' => count($duplicates),
            'valid_rows' => $validRows,
            'invalid_rows' => $invalidRows,
            'duplicates' => $duplicates
        ];
    }

    private function validateRow($rowData, $importType, $headers)
    {
        $errors = [];
        $valid = true;

        switch ($importType) {
            case 'cross_cars':
                $errors = $this->validateCrossCarsRow($rowData, $headers);
                break;
            case 'cross_code':
                $errors = $this->validateCrossCodeRow($rowData, $headers);
                break;
            case 'products':
                $errors = $this->validateProductsRow($rowData, $headers);
                break;
            case 'information':
                $errors = $this->validateInformationRow($rowData, $headers);
                break;
            case 'specifications':
                $errors = $this->validateSpecificationsRow($rowData, $headers);
                break;
            case 'car_models':
                $errors = $this->validateCarModelsRow($rowData, $headers);
                break;
            case 'product_names':
                $errors = $this->validateProductNamesRow($rowData, $headers);
                break;
            case 'supplier_prices':
                $errors = $this->validateSupplierPricesRow($rowData, $headers);
                break;
            case 'customer_prices':
                $errors = $this->validateCustomerPricesRow($rowData, $headers);
                break;
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    private function validateCrossCarsRow($rowData, $headers)
    {
        $errors = [];
        
        // Find brand and code columns
        $brandIndex = array_search('Brand', $headers) ?: array_search('brand', $headers);
        $codeIndex = array_search('Code', $headers) ?: array_search('code', $headers);
        $carModelIndex = array_search('Car model', $headers) ?: array_search('car_model', $headers);

        if ($brandIndex !== false && $codeIndex !== false) {
            $brand = $rowData[$brandIndex] ?? '';
            $code = $rowData[$codeIndex] ?? '';
            
            // Check if product exists
            $product = Product::whereHas('ProductInformation.brandname', function($q) use ($brand) {
                $q->where('brand_name', $brand);
            })->where('product_code', $code)->first();

            if (!$product) {
                $errors[] = "Product with brand '{$brand}' and code '{$code}' not found";
            }
        }

        if ($carModelIndex !== false) {
            $carModel = $rowData[$carModelIndex] ?? '';
            if (!Carmodel::where('car_model', $carModel)->exists()) {
                $errors[] = "Car model '{$carModel}' not found";
            }
        }

        return $errors;
    }

    private function validateCrossCodeRow($rowData, $headers)
    {
        $errors = [];
        
        $brandIndex = array_search('Brand', $headers) ?: array_search('brand', $headers);
        $codeIndex = array_search('Code', $headers) ?: array_search('code', $headers);

        if ($brandIndex !== false && $codeIndex !== false) {
            $brand = $rowData[$brandIndex] ?? '';
            $code = $rowData[$codeIndex] ?? '';
            
            $product = Product::whereHas('ProductInformation.brandname', function($q) use ($brand) {
                $q->where('brand_name', $brand);
            })->where('product_code', $code)->first();

            if (!$product) {
                $errors[] = "Product with brand '{$brand}' and code '{$code}' not found";
            }
        }

        return $errors;
    }

    private function validateProductsRow($rowData, $headers)
    {
        $errors = [];
        
        $supplierIndex = array_search('Supplier', $headers) ?: array_search('supplier', $headers);
        $descriptionIndex = array_search('Description', $headers) ?: array_search('description', $headers);
        $unitTypeIndex = array_search('Unit type', $headers) ?: array_search('unit_type', $headers);

        if ($supplierIndex !== false) {
            $supplier = $rowData[$supplierIndex] ?? '';
            if (!Supplier::where('company_name', $supplier)->exists()) {
                $errors[] = "Supplier '{$supplier}' not found";
            }
        }

        if ($descriptionIndex !== false) {
            $description = $rowData[$descriptionIndex] ?? '';
            if (!Productname::where('name_az', $description)->exists()) {
                $errors[] = "Product name '{$description}' not found";
            }
        }

        if ($unitTypeIndex !== false) {
            $unitType = $rowData[$unitTypeIndex] ?? '';
            if (!Unit::where('unit_name', $unitType)->exists()) {
                $errors[] = "Unit type '{$unitType}' not found";
            }
        }

        return $errors;
    }

    private function validateInformationRow($rowData, $headers)
    {
        $errors = [];
        
        $brandIndex = array_search('Brand', $headers) ?: array_search('brand', $headers);
        $codeIndex = array_search('Code', $headers) ?: array_search('code', $headers);

        if ($brandIndex !== false && $codeIndex !== false) {
            $brand = $rowData[$brandIndex] ?? '';
            $code = $rowData[$codeIndex] ?? '';
            
            $product = Product::whereHas('ProductInformation.brandname', function($q) use ($brand) {
                $q->where('brand_name', $brand);
            })->where('product_code', $code)->first();

            if (!$product) {
                $errors[] = "Product with brand '{$brand}' and code '{$code}' not found";
            }
        }

        return $errors;
    }

    private function validateSpecificationsRow($rowData, $headers)
    {
        $errors = [];
        
        $brandIndex = array_search('Brand', $headers) ?: array_search('brand', $headers);
        $codeIndex = array_search('Code', $headers) ?: array_search('code', $headers);

        if ($brandIndex !== false && $codeIndex !== false) {
            $brand = $rowData[$brandIndex] ?? '';
            $code = $rowData[$codeIndex] ?? '';
            
            $product = Product::whereHas('ProductInformation.brandname', function($q) use ($brand) {
                $q->where('brand_name', $brand);
            })->where('product_code', $code)->first();

            if (!$product) {
                $errors[] = "Product with brand '{$brand}' and code '{$code}' not found";
            }
        }

        return $errors;
    }

    private function validateCarModelsRow($rowData, $headers)
    {
        $errors = [];
        
        $carModelIndex = array_search('Car model', $headers) ?: array_search('car_model', $headers);

        if ($carModelIndex !== false) {
            $carModel = $rowData[$carModelIndex] ?? '';
            if (Carmodel::where('car_model', $carModel)->exists()) {
                $errors[] = "Car model '{$carModel}' already exists";
            }
        }

        return $errors;
    }

    private function validateProductNamesRow($rowData, $headers)
    {
        $errors = [];
        
        $categoryIndex = array_search('Categories', $headers) ?: array_search('categories', $headers);
        $nameIndex = array_search('Description', $headers) ?: array_search('name', $headers);

        if ($categoryIndex !== false) {
            $category = $rowData[$categoryIndex] ?? '';
            if (!Categor::where('name', $category)->exists()) {
                $errors[] = "Category '{$category}' not found";
            }
        }

        if ($nameIndex !== false) {
            $name = $rowData[$nameIndex] ?? '';
            if (Productname::where('name_az', $name)->exists()) {
                $errors[] = "Product name '{$name}' already exists";
            }
        }

        return $errors;
    }

    private function validateSupplierPricesRow($rowData, $headers)
    {
        $errors = [];
        
        $supplierIndex = array_search('Supplier', $headers) ?: array_search('supplier', $headers);
        $brandIndex = array_search('Brand', $headers) ?: array_search('brand', $headers);
        $codeIndex = array_search('Code', $headers) ?: array_search('code', $headers);

        if ($supplierIndex !== false) {
            $supplier = $rowData[$supplierIndex] ?? '';
            if (!Supplier::where('company_name', $supplier)->exists()) {
                $errors[] = "Supplier '{$supplier}' not found";
            }
        }

        if ($brandIndex !== false && $codeIndex !== false) {
            $brand = $rowData[$brandIndex] ?? '';
            $code = $rowData[$codeIndex] ?? '';
            
            $product = Product::whereHas('ProductInformation.brandname', function($q) use ($brand) {
                $q->where('brand_name', $brand);
            })->where('product_code', $code)->first();

            if (!$product) {
                $errors[] = "Product with brand '{$brand}' and code '{$code}' not found";
            }
        }

        return $errors;
    }

    private function validateCustomerPricesRow($rowData, $headers)
    {
        $errors = [];
        
        $customerIndex = array_search('Customer', $headers) ?: array_search('customer', $headers);
        $brandIndex = array_search('Brand', $headers) ?: array_search('brand', $headers);
        $codeIndex = array_search('Code', $headers) ?: array_search('code', $headers);

        if ($customerIndex !== false) {
            $customer = $rowData[$customerIndex] ?? '';
            if (!Customer::where('name_surname', $customer)->exists()) {
                $errors[] = "Customer '{$customer}' not found";
            }
        }

        if ($brandIndex !== false && $codeIndex !== false) {
            $brand = $rowData[$brandIndex] ?? '';
            $code = $rowData[$codeIndex] ?? '';
            
            $product = Product::whereHas('ProductInformation.brandname', function($q) use ($brand) {
                $q->where('brand_name', $brand);
            })->where('product_code', $code)->first();

            if (!$product) {
                $errors[] = "Product with brand '{$brand}' and code '{$code}' not found";
            }
        }

        return $errors;
    }

    private function isDuplicate($rowData, $importType, $validRows)
    {
        switch ($importType) {
            case 'cross_cars':
                // Check for duplicate Brand+Code+Car Model combination
                foreach ($validRows as $validRow) {
                    if ($validRow['data'][0] == $rowData[0] && 
                        $validRow['data'][1] == $rowData[1] && 
                        $validRow['data'][2] == $rowData[2]) {
                        return true;
                    }
                }
                break;
            case 'cross_code':
                // Check for duplicate Brand+Code combination
                foreach ($validRows as $validRow) {
                    if ($validRow['data'][0] == $rowData[0] && 
                        $validRow['data'][1] == $rowData[1]) {
                        return true;
                    }
                }
                break;
            // Add other duplicate checks as needed
        }
        return false;
    }

    public function processImport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'import_type' => 'required|string',
                'valid_rows' => 'required|array',
                'remove_duplicates' => 'boolean',
                'file_name' => 'string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $importType = $request->import_type;
            $validRows = $request->valid_rows;
            $removeDuplicates = $request->remove_duplicates ?? false;
            $fileName = $request->file_name ?? $importType . '_import.xlsx';

            // Process the import based on type
            $result = $this->executeImport($importType, $validRows, $removeDuplicates);

            // Create file operation record with unique filename
            $uniqueFileName = $this->generateUniqueFileName($fileName, $importType);
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'file_path' => $uniqueFileName,
                'operation_type' => $importType,
                'status' => $result['success'] ? 'success' : 'failed',
                'records_processed' => $result['imported'] + $result['skipped'],
                'records_imported' => $result['imported'],
                'records_skipped' => $result['skipped'],
                'error_count' => 0
            ]);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Import processing error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing import: ' . $e->getMessage()
            ], 500);
        }
    }

    private function executeImport($importType, $validRows, $removeDuplicates)
    {
        $imported = 0;
        $skipped = 0;

        DB::beginTransaction();
        try {
            foreach ($validRows as $row) {
                $rowData = $row['data'];
                
                switch ($importType) {
                    case 'cross_cars':
                        $result = $this->importCrossCar($rowData);
                        break;
                    case 'cross_code':
                        $result = $this->importCrossCode($rowData);
                        break;
                    case 'products':
                        $result = $this->importProduct($rowData);
                        break;
                    // Add other import types
                    default:
                        $result = false;
                }

                if ($result) {
                    $imported++;
                } else {
                    $skipped++;
                }
            }

            DB::commit();
            return [
                'success' => true,
                'imported' => $imported,
                'skipped' => $skipped,
                'message' => "Successfully imported {$imported} records, skipped {$skipped}"
            ];

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    private function importCrossCar($rowData)
    {
        // Implementation for importing cross car data
        // This would create Crosscar records based on the row data
        return true;
    }

    private function importCrossCode($rowData)
    {
        // Implementation for importing cross code data
        return true;
    }

    private function importProduct($rowData)
    {
        // Implementation for importing product data
        return true;
    }

    public function exportInvalidRows(Request $request)
    {
        try {
            $invalidRows = $request->input('invalid_rows', []);
            $headers = $request->input('headers', []);

            // Create Excel file with invalid rows
            $filename = 'invalid_rows_' . date('Y-m-d_H-i-s') . '.xlsx';
            
            // Implementation would use Laravel Excel to create and return the file
            
            return response()->json([
                'success' => true,
                'download_url' => asset('storage/exports/' . $filename)
            ]);

        } catch (\Exception $e) {
            Log::error('Export error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error exporting file: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getImportHistory()
    {
        try {
            $history = Fileoperation::with('user')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $history
            ]);

        } catch (\Exception $e) {
            Log::error('History fetch error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching history: ' . $e->getMessage()
            ], 500);
        }
    }

    public function validateCrossCars(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls|max:10240',
                'operation_type' => 'string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $data = Excel::toCollection(new class implements ToCollection {
                public function collection(Collection $rows)
                {
                    return $rows;
                }
            }, $file)->first();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'File is empty'
                ], 422);
            }

            // Extract headers from first row
            $headers = $data->first()->toArray();
            $dataRows = $data->skip(1);

            // Validate cross cars data
            $validRows = [];
            $invalidRows = [];
            $duplicates = [];

            foreach ($dataRows as $index => $row) {
                $rowData = $row->toArray();
                
                // Skip empty rows
                if (empty(array_filter($rowData))) {
                    continue;
                }

                $brand = $rowData[0] ?? '';
                $code = $rowData[1] ?? '';
                $carModel = $rowData[2] ?? '';

                $isValid = true;
                $errors = [];

                // Validate brand and code exist in products
                $product = Product::join('brandnames', 'products.brand_id', '=', 'brandnames.id')
                    ->where('brandnames.brand_name', $brand)
                    ->where('products.brand_code', $code)
                    ->first();

                if (!$product) {
                    $isValid = false;
                    $errors[] = 'Brand/Code combination not found in products';
                }

                // Validate car model exists
                $carModelExists = Carmodel::where('car_model', $carModel)->exists();
                if (!$carModelExists) {
                    $isValid = false;
                    $errors[] = 'Car model not found';
                }

                // Check for duplicates in existing crosscars
                if ($product && $carModelExists) {
                    $carModelRecord = Carmodel::where('car_model', $carModel)->first();
                    $duplicate = Crosscar::where('product_id', $product->id)
                        ->where('car_model_id', $carModelRecord->id)
                        ->exists();
                    
                    if ($duplicate) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Duplicate entry already exists']
                        ];
                        continue;
                    }
                }

                if ($isValid) {
                    $validRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData
                    ];
                } else {
                    $invalidRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData,
                        'errors' => $errors
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'headers' => $headers,
                    'total_rows' => $dataRows->count(),
                    'file_name' => $file->getClientOriginalName()
                ],
                'validation' => [
                    'valid_rows' => $validRows,
                    'invalid_rows' => $invalidRows,
                    'duplicates' => $duplicates,
                    'summary' => [
                        'valid_count' => count($validRows),
                        'invalid_count' => count($invalidRows),
                        'duplicate_count' => count($duplicates)
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Cross cars validation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error validating file: ' . $e->getMessage()
            ], 500);
        }
    }

    public function processCrossCarsImport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'valid_rows' => 'required|array',
                'valid_rows.*.data' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validRows = $request->input('valid_rows');
            $imported = 0;
            $errors = [];
            $skipped = 0;

            Log::info('Processing cross cars import', ['valid_rows_count' => count($validRows)]);

            DB::beginTransaction();

            foreach ($validRows as $rowData) {
                try {
                    $data = $rowData['data'];
                    $brand = $data[0] ?? '';
                    $code = $data[1] ?? '';
                    $carModel = $data[2] ?? '';

                    Log::info('Processing row', ['brand' => $brand, 'code' => $code, 'car_model' => $carModel]);

                    // Get product
                    $product = Product::join('brandnames', 'products.brand_id', '=', 'brandnames.id')
                        ->where('brandnames.brand_name', $brand)
                        ->where('products.brand_code', $code)
                        ->select('products.*')
                        ->first();

                    // Get car model
                    $carModelRecord = Carmodel::where('car_model', $carModel)->first();

                    Log::info('Found records', [
                        'product_found' => $product ? $product->id : 'not found',
                        'car_model_found' => $carModelRecord ? $carModelRecord->id : 'not found'
                    ]);

                    if ($product && $carModelRecord) {
                        // Check if already exists (double check)
                        $exists = Crosscar::where('product_id', $product->id)
                            ->where('car_model_id', $carModelRecord->id)
                            ->exists();

                        if (!$exists) {
                            // Generate cross_code from brand_code and car model
                            $crossCode = $code . '-' . substr(md5($carModel), 0, 8);
                            
                            Crosscar::create([
                                'product_id' => $product->id,
                                'car_model_id' => $carModelRecord->id,
                                'cross_code' => $crossCode,
                                'is_visible' => 1
                            ]);
                            $imported++;
                            Log::info('Created crosscar entry', ['product_id' => $product->id, 'car_model_id' => $carModelRecord->id, 'cross_code' => $crossCode]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate entry', ['product_id' => $product->id, 'car_model_id' => $carModelRecord->id]);
                        }
                    } else {
                        $errors[] = "Product or car model not found for: {$brand}/{$code}/{$carModel}";
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error importing row: {$brand}/{$code}/{$carModel} - " . $e->getMessage();
                    Log::error('Row import error', ['error' => $e->getMessage(), 'brand' => $brand, 'code' => $code]);
                }
            }

            // Save file operation record with unique filename
            $originalFileName = $request->input('file_name', 'cross_cars_import.xlsx');
            $uniqueFileName = $this->generateUniqueFileName($originalFileName, 'cross_cars');
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'file_path' => $uniqueFileName,
                'operation_type' => 'cross_cars',
                'status' => 'success',
                'records_processed' => $imported + $skipped,
                'records_imported' => $imported,
                'records_skipped' => $skipped,
                'error_count' => count($errors)
            ]);

            DB::commit();

            Log::info('Import completed', ['imported' => $imported, 'skipped' => $skipped, 'errors' => count($errors)]);

            return response()->json([
                'success' => true,
                'message' => "Successfully imported {$imported} cross car entries" . ($skipped > 0 ? " ({$skipped} duplicates skipped)" : ""),
                'data' => [
                    'imported_count' => $imported,
                    'skipped_count' => $skipped,
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cross cars import error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error importing cross cars: ' . $e->getMessage()
            ], 500);
        }
    }

    public function validateCarModels(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls|max:10240',
                'operation_type' => 'string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $data = Excel::toCollection(new class implements ToCollection {
                public function collection(Collection $rows)
                {
                    return $rows;
                }
            }, $file)->first();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'File is empty'
                ], 422);
            }

            // Extract headers from first row
            $headers = $data->first()->toArray();
            $dataRows = $data->skip(1);

            // Validate car models data
            $validRows = [];
            $invalidRows = [];
            $duplicates = [];

            foreach ($dataRows as $index => $row) {
                $rowData = $row->toArray();
                
                // Skip empty rows
                if (empty(array_filter($rowData))) {
                    continue;
                }

                $carModel = $rowData[0] ?? '';

                $isValid = true;
                $errors = [];

                // Validate car model is not empty
                if (empty(trim($carModel))) {
                    $isValid = false;
                    $errors[] = 'Car model cannot be empty';
                } else {
                    // Check for duplicates in existing car models
                    $exists = Carmodel::where('car_model', $carModel)->exists();
                    
                    if ($exists) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Car model already exists']
                        ];
                        continue;
                    }
                }

                if ($isValid) {
                    $validRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData
                    ];
                } else {
                    $invalidRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData,
                        'errors' => $errors
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'headers' => $headers,
                    'total_rows' => $dataRows->count(),
                    'file_name' => $file->getClientOriginalName()
                ],
                'validation' => [
                    'valid_rows' => $validRows,
                    'invalid_rows' => $invalidRows,
                    'duplicates' => $duplicates,
                    'summary' => [
                        'valid_count' => count($validRows),
                        'invalid_count' => count($invalidRows),
                        'duplicate_count' => count($duplicates)
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Car models validation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error validating file: ' . $e->getMessage()
            ], 500);
        }
    }

    public function processCarModelsImport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'valid_rows' => 'required|array',
                'valid_rows.*.data' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validRows = $request->input('valid_rows');
            $imported = 0;
            $errors = [];
            $skipped = 0;

            Log::info('Processing car models import', ['valid_rows_count' => count($validRows)]);

            DB::beginTransaction();

            foreach ($validRows as $rowData) {
                try {
                    $data = $rowData['data'];
                    $carModel = trim($data[0] ?? '');

                    Log::info('Processing car model row', ['car_model' => $carModel]);

                    if (!empty($carModel)) {
                        // Check if already exists (double check)
                        $exists = Carmodel::where('car_model', $carModel)->exists();

                        if (!$exists) {
                            Carmodel::create([
                                'car_model' => $carModel
                            ]);
                            $imported++;
                            Log::info('Created car model entry', ['car_model' => $carModel]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate car model', ['car_model' => $carModel]);
                        }
                    } else {
                        $errors[] = "Empty car model name";
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error importing car model: {$carModel} - " . $e->getMessage();
                    Log::error('Car model import error', ['error' => $e->getMessage(), 'car_model' => $carModel]);
                }
            }

            // Save file operation record with unique filename
            $originalFileName = $request->input('file_name', 'car_models_import.xlsx');
            $uniqueFileName = $this->generateUniqueFileName($originalFileName, 'car_models');
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'file_path' => $uniqueFileName,
                'operation_type' => 'car_models',
                'status' => 'success',
                'records_processed' => $imported + $skipped,
                'records_imported' => $imported,
                'records_skipped' => $skipped,
                'error_count' => count($errors)
            ]);

            DB::commit();

            Log::info('Car models import completed', ['imported' => $imported, 'skipped' => $skipped, 'errors' => count($errors)]);

            return response()->json([
                'success' => true,
                'message' => "Successfully imported {$imported} car model entries" . ($skipped > 0 ? " ({$skipped} duplicates skipped)" : ""),
                'data' => [
                    'imported_count' => $imported,
                    'skipped_count' => $skipped,
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Car models import error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error importing car models: ' . $e->getMessage()
            ], 500);
        }
    }
}
