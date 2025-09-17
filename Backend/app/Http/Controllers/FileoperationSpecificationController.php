<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Productspecification;
use App\Models\Specificationheadname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class FileoperationSpecificationController extends Controller
{
    /**
     * Validate specification Excel file
     */
    public function validateSpecification(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
                'operation_type' => 'string'
            ]);

            $file = $request->file('file');
            
            Log::info('Specification validation started', [
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize()
            ]);

            // Load Excel data
            $data = Excel::toCollection(null, $file)->filter(function ($item) {
                return !empty(array_filter($item->toArray(), function ($value) {
                    return !is_null($value) && $value !== '';
                }));
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

            Log::info('Specification validation started', [
                'headers' => $headers,
                'total_rows' => $dataRows->count()
            ]);

            // Validate that we have at least Brand and Code columns
            if (count($headers) < 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'File must have at least Brand, Code, and one specification column'
                ], 422);
            }

            // First two columns must be Brand and Code
            $brandColumn = $headers[0] ?? '';
            $codeColumn = $headers[1] ?? '';
            
            if (empty($brandColumn) || empty($codeColumn)) {
                return response()->json([
                    'success' => false,
                    'message' => 'First two columns must be Brand and Code'
                ], 422);
            }

            // Get specification columns (all columns after Brand and Code)
            $specificationColumns = array_slice($headers, 2);

            // Validate specification data
            $validRows = [];
            $invalidRows = [];
            $duplicates = [];
            $processedCombinations = [];

            foreach ($dataRows as $index => $row) {
                $rowData = $row->toArray();
                
                // Skip empty rows
                if (empty(array_filter($rowData))) {
                    continue;
                }

                $brand = trim($rowData[0] ?? '');
                $code = trim($rowData[1] ?? '');

                Log::info("Processing specification row {$index}", [
                    'brand' => $brand,
                    'code' => $code,
                    'specifications' => array_slice($rowData, 2)
                ]);

                $isValid = true;
                $errors = [];

                // Validate required fields
                if (empty($brand)) {
                    $isValid = false;
                    $errors[] = 'Brand is required';
                }

                if (empty($code)) {
                    $isValid = false;
                    $errors[] = 'Code is required';
                }

                // Validate Brand/Code combination exists in Products table
                $product = null;
                if (!empty($brand) && !empty($code)) {
                    $product = Product::whereHas('brand', function($query) use ($brand) {
                        $query->where('brand_name', $brand);
                    })->where('brand_code', $code)->first();

                    if (!$product) {
                        $isValid = false;
                        $errors[] = 'Brand "' . $brand . '" with Code "' . $code . '" does not exist in Products table';
                    }
                }

                // Check for duplicates within the file
                $combinationKey = $brand . '|' . $code;
                if (isset($processedCombinations[$combinationKey])) {
                    $duplicates[] = [
                        'row' => $index + 2, // +2 because we skip header and 0-based index
                        'data' => $rowData,
                        'errors' => ['Duplicate Brand/Code combination in file']
                    ];
                    continue;
                }
                $processedCombinations[$combinationKey] = true;

                // Validate that at least one specification value is provided
                $hasSpecificationValue = false;
                foreach ($specificationColumns as $colIndex => $columnName) {
                    $value = trim($rowData[$colIndex + 2] ?? '');
                    if (!empty($value)) {
                        $hasSpecificationValue = true;
                        break;
                    }
                }

                if (!$hasSpecificationValue) {
                    $isValid = false;
                    $errors[] = 'At least one specification value is required';
                }

                $rowResult = [
                    'row' => $index + 2,
                    'data' => $rowData,
                    'product_id' => $product ? $product->id : null,
                    'specifications' => []
                ];

                // Process specification values
                foreach ($specificationColumns as $colIndex => $columnName) {
                    $value = trim($rowData[$colIndex + 2] ?? '');
                    if (!empty($value)) {
                        $rowResult['specifications'][] = [
                            'headname' => trim($columnName),
                            'value' => $value
                        ];
                    }
                }

                if ($isValid) {
                    $validRows[] = $rowResult;
                } else {
                    $rowResult['errors'] = $errors;
                    $invalidRows[] = $rowResult;
                }
            }

            $response = [
                'success' => true,
                'data' => [
                    'headers' => $headers,
                    'specification_columns' => $specificationColumns,
                    'valid_rows' => $validRows,
                    'invalid_rows' => $invalidRows,
                    'duplicates' => $duplicates,
                    'summary' => [
                        'total_rows' => count($validRows) + count($invalidRows) + count($duplicates),
                        'valid_count' => count($validRows),
                        'invalid_count' => count($invalidRows),
                        'duplicate_count' => count($duplicates)
                    ]
                ]
            ];

            Log::info('Specification validation completed', [
                'valid_rows' => count($validRows),
                'invalid_rows' => count($invalidRows),
                'duplicates' => count($duplicates)
            ]);

            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Specification validation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process specification import
     */
    public function processSpecificationImport(Request $request)
    {
        try {
            $request->validate([
                'valid_rows' => 'required|array',
                'file_name' => 'string'
            ]);

            $validRows = $request->input('valid_rows');
            $fileName = $request->input('file_name', 'specification_import.xlsx');

            Log::info('Specification import started', [
                'file_name' => $fileName,
                'rows_count' => count($validRows)
            ]);

            DB::beginTransaction();

            $importedCount = 0;
            $createdHeadnames = [];

            foreach ($validRows as $row) {
                $productId = $row['product_id'];
                $specifications = $row['specifications'] ?? [];

                foreach ($specifications as $spec) {
                    $headname = trim($spec['headname']);
                    $value = trim($spec['value']);

                    // Find or create specification headname
                    $headnameRecord = Specificationheadname::where('headname', $headname)->first();
                    
                    if (!$headnameRecord) {
                        $headnameRecord = Specificationheadname::create([
                            'headname' => $headname,
                            'translate_az' => null,
                            'translate_ru' => null,
                            'translate_ch' => null
                        ]);
                        $createdHeadnames[] = $headname;
                        
                        Log::info('Created new specification headname', [
                            'headname' => $headname,
                            'id' => $headnameRecord->id
                        ]);
                    }

                    // Check if specification already exists for this product and headname
                    $existingSpec = Productspecification::where('product_id', $productId)
                        ->where('headname_id', $headnameRecord->id)
                        ->first();

                    if ($existingSpec) {
                        // Update existing specification
                        $existingSpec->update(['value' => $value]);
                        Log::info('Updated existing specification', [
                            'product_id' => $productId,
                            'headname' => $headname,
                            'old_value' => $existingSpec->value,
                            'new_value' => $value
                        ]);
                    } else {
                        // Create new specification
                        Productspecification::create([
                            'product_id' => $productId,
                            'headname_id' => $headnameRecord->id,
                            'value' => $value
                        ]);
                        Log::info('Created new specification', [
                            'product_id' => $productId,
                            'headname' => $headname,
                            'value' => $value
                        ]);
                    }

                    $importedCount++;
                }
            }

            DB::commit();

            Log::info('Specification import completed successfully', [
                'imported_count' => $importedCount,
                'created_headnames' => $createdHeadnames
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Specifications imported successfully',
                'imported' => $importedCount,
                'created_headnames' => $createdHeadnames
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Specification import error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
