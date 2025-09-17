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
use App\Models\Crosscode;

class FileoperationCrossCodeController extends Controller
{
    /**
     * Normalize cross code by removing all non-alphanumeric characters
     */
    private function normalizeCrossCode($code)
    {
        return preg_replace('/[^a-zA-Z0-9]/', '', $code);
    }

    /**
     * Validate cross code Excel file
     */
    public function validateCrossCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
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

            // Validate template structure with case-insensitive column matching
            $normalizedHeaders = array_map(function($header) {
                return strtolower(trim(str_replace([' ', '_'], ' ', $header)));
            }, $headers);

            $expectedHeaders = [
                ['variations' => ['brand'], 'display' => 'Brand'],
                ['variations' => ['code'], 'display' => 'Code'],
                ['variations' => ['cross brand', 'crossbrand', 'cross_brand'], 'display' => 'Cross Brand'],
                ['variations' => ['cross code', 'crosscode', 'cross_code'], 'display' => 'Cross Code'],
                ['variations' => ['hide'], 'display' => 'Hide']
            ];

            $missingColumns = [];
            $foundColumns = [];

            foreach ($expectedHeaders as $expected) {
                $found = false;
                foreach ($expected['variations'] as $variation) {
                    if (in_array($variation, $normalizedHeaders)) {
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    $foundColumns[] = $expected['display'];
                } else {
                    $missingColumns[] = $expected['display'];
                }
            }

            if (!empty($missingColumns)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid template format. Missing columns: ' . implode(', ', $missingColumns) . '. Please use the template and upload a valid file with the correct column structure.'
                ], 422);
            }

            Log::info('Cross code validation started', [
                'headers' => $headers,
                'normalized_headers' => $normalizedHeaders,
                'found_columns' => $foundColumns,
                'total_rows' => $dataRows->count()
            ]);

            // Validate cross code data
            $validRows = [];
            $invalidRows = [];
            $duplicates = [];

            foreach ($dataRows as $index => $row) {
                $rowData = $row->toArray();
                
                // Skip empty rows
                if (empty(array_filter($rowData))) {
                    continue;
                }

                // Map columns based on header positions (case-insensitive)
                $columnMapping = [];
                foreach ($expectedHeaders as $expected) {
                    foreach ($expected['variations'] as $variation) {
                        $headerIndex = array_search($variation, $normalizedHeaders);
                        if ($headerIndex !== false) {
                            $columnMapping[$expected['display']] = $headerIndex;
                            break;
                        }
                    }
                }

                $brand = trim($rowData[$columnMapping['Brand']] ?? '');
                $code = trim($rowData[$columnMapping['Code']] ?? '');
                $crossBrand = trim($rowData[$columnMapping['Cross Brand']] ?? '');
                $crossCode = trim($rowData[$columnMapping['Cross Code']] ?? '');
                $hide = trim($rowData[$columnMapping['Hide']] ?? '');

                Log::info("Processing cross code row {$index}", [
                    'brand' => $brand,
                    'code' => $code,
                    'cross_brand' => $crossBrand,
                    'cross_code' => $crossCode,
                    'hide' => $hide
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

                if (empty($crossBrand)) {
                    $isValid = false;
                    $errors[] = 'Cross Brand is required';
                }

                if (empty($crossCode)) {
                    $isValid = false;
                    $errors[] = 'Cross Code is required';
                }

                // Validate Brand/Code combination exists in Products table
                if (!empty($brand) && !empty($code)) {
                    $product = Product::whereHas('brand', function($query) use ($brand) {
                        $query->where('brand_name', $brand);
                    })->where('brand_code', $code)->first();

                    if (!$product) {
                        $isValid = false;
                        $errors[] = 'Brand "' . $brand . '" with Code "' . $code . '" does not exist in Products table';
                    }
                }

                // Validate Hide field (should be Yes/No or 1/0 or true/false)
                $showValue = true; // Default to show (false for hide)
                if (!empty($hide)) {
                    $hideNormalized = strtolower(trim($hide));
                    if (in_array($hideNormalized, ['yes', 'y', '1', 'true', 'hide'])) {
                        $showValue = false; // Hide from website
                    } elseif (in_array($hideNormalized, ['no', 'n', '0', 'false', 'show'])) {
                        $showValue = true; // Show on website
                    } else {
                        $isValid = false;
                        $errors[] = 'Hide field must be Yes/No, 1/0, or True/False';
                    }
                }

                if ($isValid) {
                    // Normalize cross code for duplicate checking
                    $normalizedCrossCode = $this->normalizeCrossCode($crossCode);
                    
                    // Check for duplicates in existing cross codes (using normalized cross_code + cross_brand)
                    $duplicate = Crosscode::where('cross_band', $crossBrand)
                        ->where('cross_code', $normalizedCrossCode)
                        ->exists();

                    Log::info('Duplicate check for cross code', [
                        'cross_brand' => $crossBrand,
                        'cross_code' => $crossCode,
                        'normalized_cross_code' => $normalizedCrossCode,
                        'duplicate_found' => $duplicate,
                        'row' => $index + 2
                    ]);

                    if ($duplicate) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Cross code already exists in database']
                        ];
                    } else {
                        $validRows[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'normalized_cross_code' => $normalizedCrossCode,
                            'show_value' => $showValue
                        ];
                    }
                } else {
                    $invalidRows[] = [
                        'row' => $index + 2,
                        'data' => $rowData,
                        'errors' => $errors
                    ];
                }
            }

            // Check for internal duplicates within the Excel file
            $internalDuplicates = [];
            $seenCombinations = [];
            
            foreach ($validRows as $key => $row) {
                $rowData = $row['data'];
                $crossBrand = trim($rowData[2] ?? '');
                $crossCode = trim($rowData[3] ?? '');
                $normalizedCrossCode = $this->normalizeCrossCode($crossCode);
                
                $identifier = $crossBrand . '|' . $normalizedCrossCode;
                
                if (isset($seenCombinations[$identifier])) {
                    // This is a duplicate within the file
                    $internalDuplicates[] = [
                        'row' => $row['row'],
                        'data' => $rowData,
                        'errors' => ['Duplicate Cross Brand + Cross Code combination within file']
                    ];
                    // Remove from valid rows
                    unset($validRows[$key]);
                } else {
                    $seenCombinations[$identifier] = true;
                }
            }

            // Merge internal duplicates with external duplicates
            $duplicates = array_merge($duplicates, $internalDuplicates);

            return response()->json([
                'success' => true,
                'data' => [
                    'headers' => $headers,
                    'total_rows' => count($dataRows),
                    'file_name' => $file->getClientOriginalName()
                ],
                'validation' => [
                    'valid_rows' => array_values($validRows),
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
            Log::error('Cross code validation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during validation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process cross code import
     */
    public function processCrossCodeImport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'valid_rows' => 'required|array',
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

            Log::info('Processing cross code import', [
                'valid_rows_count' => count($validRows),
                'request_data' => $request->all()
            ]);

            DB::beginTransaction();

            foreach ($validRows as $index => $validRow) {
                try {
                    $data = $validRow['data'];
                    
                    $brand = trim($data[0] ?? '');
                    $code = trim($data[1] ?? '');
                    $crossBrand = trim($data[2] ?? '');
                    $crossCode = trim($data[3] ?? '');
                    $hide = trim($data[4] ?? '');

                    // Normalize cross code
                    $normalizedCrossCode = $this->normalizeCrossCode($crossCode);

                    // Determine show value
                    $showValue = true; // Default to show
                    if (!empty($hide)) {
                        $hideNormalized = strtolower(trim($hide));
                        if (in_array($hideNormalized, ['yes', 'y', '1', 'true', 'hide'])) {
                            $showValue = false;
                        }
                    }

                    Log::info('Processing cross code row', [
                        'brand' => $brand,
                        'code' => $code,
                        'cross_brand' => $crossBrand,
                        'cross_code' => $crossCode,
                        'normalized_cross_code' => $normalizedCrossCode,
                        'show' => $showValue
                    ]);

                    if (!empty($brand) && !empty($code) && !empty($crossBrand) && !empty($crossCode)) {
                        // Find the product by brand and code
                        $product = Product::whereHas('brand', function($query) use ($brand) {
                            $query->where('brand_name', $brand);
                        })->where('brand_code', $code)->first();

                        if (!$product) {
                            $errorMsg = 'Product with Brand "' . $brand . '" and Code "' . $code . '" not found';
                            $errors[] = $errorMsg;
                            Log::error('Product not found', [
                                'brand' => $brand,
                                'code' => $code,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }

                        // Check if cross code already exists (double check)
                        $exists = Crosscode::where('cross_band', $crossBrand)
                            ->where('cross_code', $normalizedCrossCode)
                            ->exists();

                        if (!$exists) {
                            Log::info('Creating cross code entry', [
                                'product_id' => $product->id,
                                'cross_brand' => $crossBrand,
                                'cross_code' => $normalizedCrossCode,
                                'show' => $showValue
                            ]);

                            Crosscode::create([
                                'product_id' => $product->id,
                                'cross_band' => $crossBrand,
                                'cross_code' => $normalizedCrossCode,
                                'show' => $showValue
                            ]);
                            
                            $imported++;
                            Log::info('Created cross code entry successfully', [
                                'product_id' => $product->id,
                                'cross_brand' => $crossBrand,
                                'cross_code' => $normalizedCrossCode
                            ]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate cross code entry', [
                                'product_id' => $product->id,
                                'cross_brand' => $crossBrand,
                                'cross_code' => $normalizedCrossCode
                            ]);
                        }
                    } else {
                        $errorMsg = "Missing required fields for cross code";
                        $errors[] = $errorMsg;
                        Log::error('Missing required fields', [
                            'brand' => $brand,
                            'code' => $code,
                            'cross_brand' => $crossBrand,
                            'cross_code' => $crossCode,
                            'error' => $errorMsg
                        ]);
                    }

                } catch (\Exception $e) {
                    $errorMsg = "Error processing row {$index}: " . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Error processing cross code row', [
                        'row_index' => $index,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // Create file operation record
            $displayName = $this->generateUniqueFileName($request->input('file_name', 'cross_code_import.xlsx'), 'cross_code');
            
            Fileoperation::create([
                'display_name' => $displayName,
                'file_name' => $request->input('file_name', 'cross_code_import.xlsx'),
                'file_path' => 'imports/cross_code/' . $displayName,
                'file_size' => 0,
                'operation_type' => 'cross_code_import',
                'status' => 'completed',
                'total_rows' => count($validRows),
                'imported_rows' => $imported,
                'skipped_rows' => $skipped,
                'error_rows' => count($errors),
                'notes' => 'Cross code import completed. Imported: ' . $imported . ', Skipped: ' . $skipped . ', Errors: ' . count($errors)
            ]);

            DB::commit();

            Log::info('Cross code import completed', [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => count($errors)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cross code import completed successfully',
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Cross code import error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during import: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate a unique display name based on original name with collision handling
     */
    private function generateUniqueFileName($originalName, $type)
    {
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        
        $counter = 1;
        $fileName = $baseName . '_' . $type . '.' . $extension;
        
        while (Fileoperation::where('display_name', $fileName)->exists()) {
            $fileName = $baseName . '_' . $type . '_' . $counter . '.' . $extension;
            $counter++;
        }
        
        return $fileName;
    }
}
