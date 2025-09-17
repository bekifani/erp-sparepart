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
     * Generate a unique display name based on original name with collision handling
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
        
        // Check if file name already exists in database (check file_name column)
        while (Fileoperation::where('file_name', $fileName)->exists()) {
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
            public function collection(Collection $rows)
            {
                return $rows;
            }
        }, $file);

        $sheet = $data->first();
        $headers = $sheet->first()->toArray(); // First row as headers
        $dataRows = $sheet->skip(1)->filter(function($row) {
            // Skip empty rows and header-like rows
            $rowArray = $row->toArray();
            return !empty(array_filter($rowArray)) && 
                   !in_array('Categories', $rowArray) && 
                   !in_array('HS Code', $rowArray);
        }); // Skip header row and filter out empty/header rows

        // Validate data based on import type
        $validationResult = $this->validateImportData($dataRows, $importType, $headers);

        // Store file operation record with both file path and display name
        $uniqueDisplayName = $this->generateUniqueFileName($file->getClientOriginalName(), $importType);
            
            $fileOperation = Fileoperation::create([
                'user_id' => auth()->id(),
                'file_path' => $filePath,
                'file_name' => $uniqueDisplayName,
                'operation_type' => $importType,
                'status' => 'uploaded'
            ]);

            return response()->json([
                'success' => true,
                'file_id' => $fileOperation->id,
                'headers' => $headers,
                'data' => $dataRows->take(100)->toArray(), // Limit preview to 100 rows
                'total_rows' => $dataRows->count(),
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
            case 'cross_code':
                $errors = $this->validateCrossCodeRow($rowData, $headers);
                break;
            case 'information':
                $errors = $this->validateInformationRow($rowData, $headers);
                break;
            case 'specifications':
                $errors = $this->validateSpecificationsRow($rowData, $headers);
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

            // Create file operation record with both file path and display name
            $uniqueDisplayName = $this->generateUniqueFileName($fileName, $importType);
            
            // Store the file temporarily for tracking
            $tempFilePath = 'imports/' . $importType . '/' . time() . '_' . $fileName;
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'file_path' => $tempFilePath,
                'file_name' => $uniqueDisplayName,
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

    public function downloadFile($id)
    {
        try {
            $fileOperation = Fileoperation::findOrFail($id);
            
            // Check if file exists
            if (!Storage::disk('public')->exists($fileOperation->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

            $filePath = Storage::disk('public')->path($fileOperation->file_path);
            $fileName = $fileOperation->file_name ?: basename($fileOperation->file_path);

            return response()->download($filePath, $fileName);

        } catch (\Exception $e) {
            Log::error('File download error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error downloading file: ' . $e->getMessage()
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

            
            // After processing all rows, check for internal duplicates within the Excel file
            $descriptionCounts = [];
            
            // First pass: count occurrences of each description
            foreach ($validRows as $row) {
                $description = trim($row['description'] ?? '');
                if (!empty($description)) {
                    $descriptionCounts[$description] = ($descriptionCounts[$description] ?? 0) + 1;
                }
            }
            
            // Second pass: move duplicate rows from valid to duplicates array
            $filteredValidRows = [];
            foreach ($validRows as $row) {
                $description = trim($row['description'] ?? '');
                if (!empty($description) && $descriptionCounts[$description] > 1) {
                    // This is a duplicate within the file
                    $duplicates[] = [
                        'row' => $row['row'],
                        'data' => $row['data'],
                        'errors' => ["Product with description '{$description}' appears multiple times in the Excel file. Each product description must be unique within the import file."]
                    ];
                } else {
                    // This is a unique product within the file - remove description field before adding
                    $cleanRow = $row;
                    unset($cleanRow['description']);
                    $filteredValidRows[] = $cleanRow;
                }
            }
            
            // Update valid rows to exclude internal duplicates
            $validRows = $filteredValidRows;


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

    public function importCarModels(Request $request)
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

            DB::beginTransaction();

            foreach ($validRows as $index => $rowData) {
                try {
                    $data = $rowData['data'];
                    $carModel = trim($data[0] ?? '');

                    if (!empty($carModel)) {
                        Carmodel::create([
                            'car_model' => $carModel
                        ]);
                        $imported++;
                    }
                } catch (\Exception $e) {
                    $errors[] = 'Error processing row ' . ($index + 1) . ': ' . $e->getMessage();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Import completed. {$imported} car models imported",
                'data' => [
                    'imported_count' => $imported,
                    'error_count' => count($errors),
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

    public function processProductsImport(Request $request)
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

            DB::beginTransaction();

            Log::info('Processing products import', [
                'valid_rows_count' => count($validRows),
                'request_data' => $request->all()
            ]);

            foreach ($validRows as $index => $rowData) {
                try {
                    Log::info("Processing row {$index}", ['row_data' => $rowData]);
                    $data = $rowData['data'];
                    
                    // Use correct column mapping based on Excel structure
                    $supplier = trim($data[0] ?? ''); // Supplier
                    $supplierCode = trim($data[1] ?? ''); // Supplier Code
                    $brand = trim($data[2] ?? ''); // Brand
                    $brandCode = trim($data[3] ?? ''); // Brand code
                    $oeCode = trim($data[4] ?? ''); // OE code
                    $description = trim($data[5] ?? ''); // Description
                    $qty = trim($data[6] ?? ''); // Qty
                    $unitType = trim($data[7] ?? ''); // Unit type
                    $minQty = trim($data[8] ?? ''); // Min Qty
                    $purchasePrice = trim($data[9] ?? ''); // Purchase Price
                    $extraCost = trim($data[10] ?? ''); // Extra cost
                    $costBasis = trim($data[11] ?? ''); // Cost Basis
                    $sellingPrice = trim($data[12] ?? ''); // Selling Price
                    $supplierPosition = '0'; // Default to 0 (just add)

                    Log::info('Processing product row', [
                        'supplier' => $supplier,
                        'supplier_code' => $supplierCode,
                        'brand' => $brand,
                        'description' => $description,
                        'unit_type' => $unitType,
                        'brand_code' => $brandCode,
                        'oe_code' => $oeCode,
                        'qty' => $qty,
                        'purchase_price' => $purchasePrice
                    ]);

                    if (!empty($supplierCode) && !empty($brand) && !empty($description) && !empty($unitType)) {
                        // Note: Duplicate checking was already done in validation phase
                        // We should import all valid rows that passed validation

                        // Get supplier ID using both supplier name and code
                        $supplierModel = \App\Models\Supplier::where('supplier', $supplier)
                                                             ->where('code', $supplierCode)
                                                             ->first();
                        
                        // Fallback to individual checks if exact match not found
                        if (!$supplierModel) {
                            $supplierModel = \App\Models\Supplier::where('supplier', $supplier)
                                                                 ->orWhere('code', $supplierCode)
                                                                 ->first();
                        }
                        
                        if (!$supplierModel) {
                            $errorMsg = "Supplier '{$supplier}' (code: {$supplierCode}) not found for product '{$description}'";
                            $errors[] = $errorMsg;
                            Log::error('Supplier lookup failed', [
                                'supplier' => $supplier,
                                'supplier_code' => $supplierCode,
                                'description' => $description,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }
                        
                        Log::info('Supplier found', ['supplier_id' => $supplierModel->id, 'supplier_name' => $supplierModel->supplier]);

                        // Get brand ID
                        $brandModel = \App\Models\Brandname::where('brand_name', $brand)
                                                           ->first();
                        
                        if (!$brandModel) {
                            $errorMsg = "Brand '{$brand}' not found for product '{$description}'";
                            $errors[] = $errorMsg;
                            Log::error('Brand lookup failed', [
                                'brand' => $brand,
                                'description' => $description,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }
                        
                        Log::info('Brand found', ['brand_id' => $brandModel->id, 'brand_name' => $brandModel->brand_name]);

                        // Get unit ID
                        $unitModel = \App\Models\Unit::where('name', $unitType)
                                                     ->first();
                        
                        if (!$unitModel) {
                            $errorMsg = "Unit Type '{$unitType}' not found for product '{$description}'";
                            $errors[] = $errorMsg;
                            Log::error('Unit lookup failed', [
                                'unit_type' => $unitType,
                                'description' => $description,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }
                        
                        Log::info('Unit found', ['unit_id' => $unitModel->id, 'unit_name' => $unitModel->name]);

                        // Use brand code from Excel or generate if empty
                        $finalBrandCode = $brandCode;
                        if (empty($brandCode)) {
                            // Auto-generate brand code
                            $finalBrandCode = strtoupper(substr($brand, 0, 3)) . '_' . strtoupper(substr(md5($description . time()), 0, 6));
                        }

                        // Find existing product name or skip if not found
                        $productName = Productname::where('description_en', $description)
                            ->orWhere('name_az', $description)
                            ->first();
                        
                        if (!$productName) {
                            $errorMsg = 'Product name "' . $description . '" not found. Please import product names first.';
                            $errors[] = $errorMsg;
                            Log::error('Product name not found', [
                                'description' => $description,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }
                        
                        Log::info('Found existing product name', ['product_name_id' => $productName->id, 'description' => $description]);

                        // Create product with all Excel data
                        Log::info('Creating product', [
                            'supplier_id' => $supplierModel->id,
                            'productname_id' => $productName->id,
                            'brand_id' => $brandModel->id,
                            'brand_code' => $finalBrandCode,
                            'purchase_price' => $purchasePrice ?: 0,
                            'qty' => $qty ?: 0
                        ]);
                        
                        $product = Product::create([
                            'supplier_id' => $supplierModel->id,
                            'productname_id' => $productName->id,
                            'brand_id' => $brandModel->id,
                            'brand_code' => $finalBrandCode,
                            'purchase_price' => $purchasePrice ?: 0,
                            'qty' => $qty ?: 0,
                            'status' => 'active',
                            'min_qty' => $minQty ?: null,
                            'selling_price' => $sellingPrice ?: null,
                            'extra_cost' => $extraCost ?: null,
                            'cost_basis' => $costBasis ?: null,
                            'oe_code' => $oeCode ?: null
                        ]);
                        
                        Log::info('Product created successfully', ['product_id' => $product->id]);
                        
                        $imported++;
                        Log::info('Imported product', [
                            'description' => $description, 
                            'brand' => $brand,
                            'brand_code' => $finalBrandCode,
                            'supplier_position' => $supplierPosition
                        ]);
                    } else {
                        $errorMsg = 'Required fields missing in row: Supplier, Brand, Description, and Unit Type are all required fields.';
                        $errors[] = $errorMsg;
                        Log::error('Missing required fields', [
                            'supplier' => $supplier,
                            'supplier_code' => $supplierCode,
                            'brand' => $brand,
                            'description' => $description,
                            'unit_type' => $unitType,
                            'error' => $errorMsg
                        ]);
                    }
                } catch (\Exception $e) {
                    $errorMsg = 'Error processing row with description "' . ($description ?? 'N/A') . '": ' . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Error processing product row', [
                        'error' => $e->getMessage(),
                        'description' => $description ?? 'N/A',
                        'row_data' => $rowData,
                        'stack_trace' => $e->getTraceAsString(),
                        'data' => $data,
                        'supplier' => $supplier ?? 'N/A',
                        'brand' => $brand ?? 'N/A'
                    ]);
                }
            }

            // Create Fileoperation record for history tracking
            Fileoperation::create([
                'user_id' => auth()->id(),
                'product_id' => null,
                'file_path' => 'products/' . ($request->input('file_name') ?: 'products_import.xlsx'),
                'operation_type' => 'products',
                'status' => 'success'
            ]);

            DB::commit();

            $message = "Import completed. {$imported} products imported";
            if ($skipped > 0) {
                $message .= ", {$skipped} skipped (already exist)";
            }
            if (!empty($errors)) {
                $message .= ", " . count($errors) . " errors occurred";
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'imported_count' => $imported,
                    'skipped_count' => $skipped,
                    'error_count' => count($errors),
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Products import error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error importing products: ' . $e->getMessage()
            ], 500);
        }
    }
}
