<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;
use App\Models\Fileoperation;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Unit;

class FileoperationProductController extends Controller
{
    /**
     * Validate products Excel file
     */
    public function validateProducts(Request $request)
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

            Log::info('Products validation started', [
                'headers' => $headers,
                'total_rows' => $dataRows->count()
            ]);

            // Validate products data
            $validRows = [];
            $invalidRows = [];
            $duplicates = [];

            foreach ($dataRows as $index => $row) {
                $rowData = $row->toArray();
                
                // Skip empty rows
                if (empty(array_filter($rowData))) {
                    continue;
                }

                $supplier = trim($rowData[0] ?? '');
                $supplierCode = trim($rowData[1] ?? '');
                $brand = trim($rowData[2] ?? '');
                $brandCode = trim($rowData[3] ?? '');
                $description = trim($rowData[5] ?? '');
                $qty = trim($rowData[6] ?? '');
                $unitType = trim($rowData[7] ?? '');

                Log::info("Processing row {$index}", [
                    'supplier' => $supplier,
                    'supplier_code' => $supplierCode,
                    'brand' => $brand,
                    'brand_code' => $brandCode,
                    'description' => $description,
                    'qty' => $qty,
                    'unit_type' => $unitType
                ]);

                $isValid = true;
                $errors = [];

                // Validate required fields
                if (empty($supplier)) {
                    $isValid = false;
                    $errors[] = 'Supplier is required';
                }

                if (empty($supplierCode)) {
                    $isValid = false;
                    $errors[] = 'Supplier code is required';
                }

                if (empty($brand)) {
                    $isValid = false;
                    $errors[] = 'Brand is required';
                }

                if (empty($brandCode)) {
                    $isValid = false;
                    $errors[] = 'Brand code is required';
                }

                if (empty($description)) {
                    $isValid = false;
                    $errors[] = 'Description is required';
                }

                // Validate unit type exists (only check by exact name match)
                if (!empty($unitType)) {
                    $unitExists = Unit::where('name', $unitType)->exists();
                    
                    if (!$unitExists) {
                        $isValid = false;
                        $errors[] = "Unit type '{$unitType}' not found";
                        Log::error('Unit type not found', [
                            'unit_type' => $unitType, 
                            'row' => $index + 2,
                            'available_units' => Unit::pluck('name')->toArray()
                        ]);
                    } else {
                        Log::info('Unit type found by name', ['unit_type' => $unitType, 'row' => $index + 2]);
                    }
                }

                if ($isValid) {
                    // Validate supplier exists
                    $supplierModel = Supplier::where('supplier', $supplier)->where('code', $supplierCode)->first();
                    if (!$supplierModel) {
                        $supplierModel = Supplier::where('supplier', $supplier)->orWhere('code', $supplierCode)->first();
                    }

                    if (!$supplierModel) {
                        $isValid = false;
                        $errors[] = 'Supplier not found';
                        Log::error('Supplier not found', ['supplier' => $supplier, 'code' => $supplierCode, 'row' => $index + 2]);
                    }


                    // Validate product name exists in productnames table
                    if ($isValid && !empty($description)) {
                        $productNameExists = \App\Models\Productname::where('name_az', $description)->exists();
                        if (!$productNameExists) {
                            $isValid = false;
                            $errors[] = "Product name '{$description}' not found in productnames table";
                            Log::error('Product name not found in productnames', ['description' => $description, 'row' => $index + 2]);
                        }
                    } else {
                        Log::info('Supplier found', ['supplier_id' => $supplierModel->id, 'row' => $index + 2]);
                    }
                }

                // Check for duplicates in existing products by description (only for valid rows)
                if ($isValid && !empty($description)) {
                    // Test the duplicate query with debug info
                    $duplicateQuery = Product::where('description', $description);
                    $duplicate = $duplicateQuery->exists();
                    $duplicateProduct = $duplicateQuery->first();
                    
                    Log::info('Checking for duplicate', [
                        'description' => $description,
                        'row' => $index + 2,
                        'duplicate_exists' => $duplicate,
                        'duplicate_product_id' => $duplicateProduct ? $duplicateProduct->id : null,
                        'sql_query' => $duplicateQuery->toSql(),
                        'bindings' => $duplicateQuery->getBindings()
                    ]);
                    
                    if ($duplicate) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Product with this description already exists']
                        ];
                        Log::info('Duplicate found', [
                            'description' => $description,
                            'row' => $index + 2,
                            'existing_product_id' => $duplicateProduct->id
                        ]);
                        continue;
                    }
                }

                // If we reach here and row is still valid, it's not a duplicate

                if ($isValid) {
                    $validRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData,
                        'description' => $description
                    ];
                } else {
                    $invalidRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData,
                        'errors' => $errors
                    ];
                    Log::info('Row marked as invalid', [
                        'row' => $index + 2,
                        'description' => $description,
                        'errors' => $errors,
                        'isValid' => $isValid
                    ]);
                }
            }

            // Check for internal duplicates within the Excel file
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

            Log::info('Products validation completed', [
                'valid_rows' => count($validRows),
                'invalid_rows' => count($invalidRows),
                'duplicates' => count($duplicates)
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'headers' => $headers,
                    'total_rows' => $dataRows->count()
                ],
                'validation' => [
                    'valid_rows' => $validRows,
                    'invalid_rows' => $invalidRows,
                    'duplicates' => $duplicates
                ],
                'debug' => [
                    'total_processed' => count($validRows) + count($invalidRows) + count($duplicates),
                    'validation_summary' => [
                        'valid' => count($validRows),
                        'invalid' => count($invalidRows), 
                        'duplicates' => count($duplicates)
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Products validation error: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error validating file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process products import
     */
    public function processProductsImport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'valid_rows' => 'required|array',
                'valid_rows.*.data' => 'required|array',
                'file_name' => 'string'
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

            Log::info('Processing products import', [
                'valid_rows_count' => count($validRows),
                'request_data' => $request->all()
            ]);

            DB::beginTransaction();

            foreach ($validRows as $index => $rowData) {
                try {
                    Log::info("Processing row {$index}", ['row_data' => $rowData]);
                    
                    $data = $rowData['data'];
                    $supplier = trim($data[0] ?? '');
                    $supplierCode = trim($data[1] ?? '');
                    $brand = trim($data[2] ?? '');
                    $brandCode = trim($data[3] ?? '');
                    $description = trim($data[5] ?? '');

                    Log::info('Processing product row', [
                        'supplier' => $supplier,
                        'supplier_code' => $supplierCode,
                        'brand' => $brand,
                        'brand_code' => $brandCode,
                        'description' => $description
                    ]);

                    if (!empty($supplier) && !empty($supplierCode) && !empty($brand) && !empty($brandCode) && !empty($description)) {
                        // Get supplier
                        $supplierModel = Supplier::where('supplier', $supplier)->where('code', $supplierCode)->first();
                        if (!$supplierModel) {
                            $supplierModel = Supplier::where('supplier', $supplier)->orWhere('code', $supplierCode)->first();
                        }

                        if (!$supplierModel) {
                            $errorMsg = "Supplier not found for '{$supplier}' with code '{$supplierCode}'";
                            $errors[] = $errorMsg;
                            Log::error('Supplier lookup failed', [
                                'supplier' => $supplier,
                                'supplier_code' => $supplierCode,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }

                        // Get or create brand in brandnames table
                        $brandModel = \App\Models\Brandname::where('brand_name', $brand)->first();
                        if (!$brandModel) {
                            // Create new brand if it doesn't exist
                            $brandModel = \App\Models\Brandname::create([
                                'brand_name' => $brand
                            ]);
                            Log::info('Created new brand', [
                                'brand' => $brand,
                                'brand_id' => $brandModel->id
                            ]);
                        }

                        // Get product name ID from productnames table
                        $productNameModel = \App\Models\Productname::where('name_az', $description)->first();
                        if (!$productNameModel) {
                            $errorMsg = "Product name '{$description}' not found in productnames table";
                            $errors[] = $errorMsg;
                            Log::error('Product name lookup failed', [
                                'description' => $description,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }

                        Log::info('Supplier, brand, and product name found', [
                            'supplier_id' => $supplierModel->id,
                            'brand_id' => $brandModel->id,
                            'productname_id' => $productNameModel->id
                        ]);

                        // Check if product already exists (double check)
                        $exists = Product::where('description', $description)->exists();

                        if (!$exists) {
                            Log::info('Creating product entry', [
                                'supplier_id' => $supplierModel->id,
                                'brand' => $brand,
                                'brand_code' => $brandCode,
                                'description' => $description
                            ]);

                            // Extract all fields from Excel data
                            $oeCode = trim($data[4] ?? '');
                            $qty = trim($data[6] ?? '');
                            $unitType = trim($data[7] ?? '');
                            $minQty = trim($data[8] ?? '');
                            $purchasePrice = trim($data[9] ?? '');
                            $extraCost = trim($data[10] ?? '');
                            $costBasis = trim($data[11] ?? '');
                            $sellingPrice = trim($data[12] ?? '');

                            Product::create([
                                'supplier_id' => $supplierModel->id,
                                'brand_id' => $brandModel->id,
                                'productname_id' => $productNameModel->id,
                                'brand_code' => $brandCode,
                                'oe_code' => $oeCode,
                                'description' => $description,
                                'qty' => is_numeric($qty) ? (int)$qty : 0,
                                'min_qty' => is_numeric($minQty) ? (float)$minQty : 0,
                                'purchase_price' => is_numeric($purchasePrice) ? (float)$purchasePrice : 0,
                                'extra_cost' => is_numeric($extraCost) ? (float)$extraCost : 0,
                                'cost_basis' => is_numeric($costBasis) ? (float)$costBasis : 0,
                                'selling_price' => is_numeric($sellingPrice) ? (float)$sellingPrice : 0,
                                'status' => 'active'
                            ]);
                            
                            $imported++;
                            Log::info('Created product entry successfully', [
                                'supplier_id' => $supplierModel->id,
                                'description' => $description
                            ]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate entry', [
                                'description' => $description
                            ]);
                        }
                    } else {
                        $errorMsg = 'Required fields missing in row: Supplier, Supplier Code, Brand, Brand Code, and Description are all required fields.';
                        $errors[] = $errorMsg;
                        Log::error('Missing required fields', [
                            'supplier' => $supplier,
                            'supplier_code' => $supplierCode,
                            'brand' => $brand,
                            'brand_code' => $brandCode,
                            'description' => $description,
                            'error' => $errorMsg
                        ]);
                    }
                } catch (\Exception $e) {
                    $errorMsg = 'Error processing row with description "' . ($description ?? 'N/A') . '": ' . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Error processing product row', [
                        'error' => $e->getMessage(),
                        'supplier' => $supplier ?? 'N/A',
                        'description' => $description ?? 'N/A',
                        'row_data' => $rowData,
                        'stack_trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // Create Fileoperation record for history tracking
            $originalFileName = $request->input('file_name', 'products_import.xlsx');
            $uniqueDisplayName = $this->generateUniqueFileName($originalFileName, 'products');
            $tempFilePath = 'imports/products/' . time() . '_' . $originalFileName;
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'product_id' => null,
                'file_path' => $tempFilePath,
                'file_name' => $uniqueDisplayName,
                'operation_type' => 'products',
                'status' => count($errors) > 0 ? 'completed_with_errors' : 'success',
                'total_rows' => $imported + $skipped + count($errors),
                'valid_rows' => 0,
                'invalid_rows' => 0,
                'duplicate_rows' => 0,
                'imported_rows' => $imported,
                'skipped_rows' => $skipped,
                'error_details' => json_encode($errors)
            ]);

            DB::commit();

            Log::info('Products import completed', [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => count($errors)
            ]);

            $message = "Products import completed. Imported: {$imported}, Skipped: {$skipped}";
            if (count($errors) > 0) {
                $message .= ", Errors: " . count($errors);
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'imported' => $imported,
                    'skipped' => $skipped,
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Products import error: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error importing products: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate unique file name for display
     */
    private function generateUniqueFileName($originalFileName, $operationType)
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $pathInfo = pathinfo($originalFileName);
        $baseName = $pathInfo['filename'] ?? 'import';
        $extension = $pathInfo['extension'] ?? 'xlsx';
        
        return "{$operationType}_{$baseName}_{$timestamp}.{$extension}";
    }
}
