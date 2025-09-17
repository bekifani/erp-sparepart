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
use App\Models\Crosscar;
use App\Models\Carmodel;

class FileoperationCrossCarController extends Controller
{
    /**
     * Validate cross cars Excel file
     */
    public function validateCrossCars(Request $request)
    {
        try {
            Log::info('Cross cars validation request received', [
                'files' => $request->hasFile('file'),
                'file_info' => $request->hasFile('file') ? [
                    'name' => $request->file('file')->getClientOriginalName(),
                    'size' => $request->file('file')->getSize(),
                    'mime' => $request->file('file')->getMimeType()
                ] : null,
                'operation_type' => $request->get('operation_type')
            ]);

            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
                'operation_type' => 'string'
            ]);

            if ($validator->fails()) {
                Log::error('Cross cars validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            Log::info('Processing Excel file', ['file_name' => $file->getClientOriginalName()]);
            
            $data = Excel::toCollection(new class implements ToCollection {
                public function collection(Collection $rows)
                {
                    return $rows;
                }
            }, $file)->first();
            
            Log::info('Excel data loaded', ['row_count' => $data->count()]);

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'File is empty'
                ], 422);
            }

            // Extract headers from first row
            $headers = $data->first()->toArray();
            $dataRows = $data->skip(1);

            // Validate template structure - flexible matching
            $requiredHeaders = ['Brand', 'Code', 'CarModel'];
            $actualHeaders = array_slice($headers, 0, 3); // Only check first 3 columns
            
            // Clean headers (trim whitespace)
            $actualHeaders = array_map('trim', $actualHeaders);
            
            // Create flexible mapping function
            $normalizeHeader = function($header) {
                $header = strtolower(trim($header));
                $header = preg_replace('/[^a-z0-9]/', '', $header); // Remove spaces, hyphens, underscores
                
                // Handle variations for each column
                $mappings = [
                    // Brand variations
                    'brand' => 'brand',
                    'brands' => 'brand',
                    'brandname' => 'brand',
                    'brandnames' => 'brand',
                    
                    // Code variations
                    'code' => 'code',
                    'codes' => 'code',
                    'productcode' => 'code',
                    'productcodes' => 'code',
                    'partcode' => 'code',
                    'partnumber' => 'code',
                    
                    // Car Model variations
                    'carmodel' => 'carmodel',
                    'carmodels' => 'carmodel',
                    'model' => 'carmodel',
                    'models' => 'carmodel',
                    'vehiclemodel' => 'carmodel',
                    'automodel' => 'carmodel'
                ];
                
                return $mappings[$header] ?? $header;
            };
            
            // Normalize both expected and actual headers
            $normalizedRequired = array_map($normalizeHeader, $requiredHeaders);
            $normalizedActual = array_map($normalizeHeader, $actualHeaders);
            
            // Check if normalized headers match
            $headerMismatch = false;
            $missingColumns = [];
            
            foreach ($normalizedRequired as $index => $expectedCol) {
                if (!isset($normalizedActual[$index]) || $normalizedActual[$index] !== $expectedCol) {
                    $headerMismatch = true;
                    $missingColumns[] = $requiredHeaders[$index];
                }
            }
            
            if ($headerMismatch) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid template structure. Please ensure your file has the required columns.',
                    'errors' => [
                        'template' => 'File must contain Brand, Code, and Car Model columns (case insensitive)',
                        'expected' => $requiredHeaders,
                        'found' => $actualHeaders,
                        'missing' => $missingColumns,
                        'help' => 'Accepted variations: Brand/Brands, Code/Codes/Brand Number, Car Model/Model/Vehicle Model'
                    ]
                ], 422);
            }

            Log::info('Cross cars validation started', [
                'headers' => $headers,
                'total_rows' => $dataRows->count()
            ]);

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

                $brand = trim($rowData[0] ?? '');
                $code = trim($rowData[1] ?? '');
                $carModel = trim($rowData[2] ?? '');

                Log::info("Processing row {$index}", [
                    'brand' => $brand,
                    'code' => $code,
                    'car_model' => $carModel
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

                if (empty($carModel)) {
                    $isValid = false;
                    $errors[] = 'Car model is required';
                }

                if ($isValid) {
                    // Validate brand and code exist in products
                    $product = Product::join('brandnames', 'products.brand_id', '=', 'brandnames.id')
                        ->where('brandnames.brand_name', $brand)
                        ->where('products.brand_code', $code)
                        ->first();

                    if (!$product) {
                        $isValid = false;
                        $errors[] = 'Brand/Code combination not found in products';
                        Log::error('Product not found', ['brand' => $brand, 'code' => $code]);
                    } else {
                        Log::info('Product found', ['product_id' => $product->id]);
                    }

                    // Validate car model exists
                    $carModelExists = Carmodel::where('car_model', $carModel)->exists();
                    if (!$carModelExists) {
                        $isValid = false;
                        $errors[] = 'Car model not found';
                        Log::error('Car model not found', ['car_model' => $carModel]);
                    } else {
                        Log::info('Car model found', ['car_model' => $carModel]);
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
                            Log::info('Duplicate found', [
                                'product_id' => $product->id,
                                'car_model_id' => $carModelRecord->id
                            ]);
                            continue;
                        }
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

            // Check for internal duplicates within the Excel file
            $internalDuplicates = [];
            $seenCombinations = [];
            
            foreach ($validRows as $key => $row) {
                $brand = trim($row['data'][0] ?? '');
                $code = trim($row['data'][1] ?? '');
                $carModel = trim($row['data'][2] ?? '');
                $combination = $brand . '|' . $code . '|' . $carModel;
                
                if (isset($seenCombinations[$combination])) {
                    // Move to duplicates
                    $internalDuplicates[] = [
                        'row' => $row['row'],
                        'data' => $row['data'],
                        'errors' => ['Duplicate within Excel file']
                    ];
                    unset($validRows[$key]);
                } else {
                    $seenCombinations[$combination] = true;
                }
            }
            
            // Merge internal duplicates with database duplicates
            $duplicates = array_merge($duplicates, $internalDuplicates);
            $validRows = array_values($validRows); // Re-index array

            Log::info('Cross cars validation completed', [
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
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Cross cars validation error: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error validating file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process cross cars import
     */
    public function processCrossCarsImport(Request $request)
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

            Log::info('Processing cross cars import', [
                'valid_rows_count' => count($validRows),
                'request_data' => $request->all()
            ]);

            DB::beginTransaction();

            foreach ($validRows as $index => $rowData) {
                try {
                    Log::info("Processing row {$index}", ['row_data' => $rowData]);
                    
                    $data = $rowData['data'];
                    $brand = trim($data[0] ?? '');
                    $code = trim($data[1] ?? '');
                    $carModel = trim($data[2] ?? '');

                    Log::info('Processing cross car row', [
                        'brand' => $brand,
                        'code' => $code,
                        'car_model' => $carModel
                    ]);

                    if (!empty($brand) && !empty($code) && !empty($carModel)) {
                        // Get product
                        $product = Product::join('brandnames', 'products.brand_id', '=', 'brandnames.id')
                            ->where('brandnames.brand_name', $brand)
                            ->where('products.brand_code', $code)
                            ->select('products.*')
                            ->first();

                        if (!$product) {
                            $errorMsg = "Product not found for brand '{$brand}' and code '{$code}'";
                            $errors[] = $errorMsg;
                            Log::error('Product lookup failed', [
                                'brand' => $brand,
                                'code' => $code,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }

                        Log::info('Product found', ['product_id' => $product->id]);

                        // Get car model
                        $carModelRecord = Carmodel::where('car_model', $carModel)->first();

                        if (!$carModelRecord) {
                            $errorMsg = "Car model '{$carModel}' not found";
                            $errors[] = $errorMsg;
                            Log::error('Car model lookup failed', [
                                'car_model' => $carModel,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }

                        Log::info('Car model found', ['car_model_id' => $carModelRecord->id]);

                        // Check if already exists (double check)
                        $exists = Crosscar::where('product_id', $product->id)
                            ->where('car_model_id', $carModelRecord->id)
                            ->exists();

                        if (!$exists) {
                            Log::info('Creating crosscar entry', [
                                'product_id' => $product->id,
                                'car_model_id' => $carModelRecord->id
                            ]);

                            Crosscar::create([
                                'product_id' => $product->id,
                                'car_model_id' => $carModelRecord->id
                            ]);
                            
                            $imported++;
                            Log::info('Created crosscar entry successfully', [
                                'product_id' => $product->id,
                                'car_model_id' => $carModelRecord->id
                            ]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate entry', [
                                'product_id' => $product->id,
                                'car_model_id' => $carModelRecord->id
                            ]);
                        }
                    } else {
                        $errorMsg = 'Required fields missing in row: Brand, Code, and Car Model are all required fields.';
                        $errors[] = $errorMsg;
                        Log::error('Missing required fields', [
                            'brand' => $brand,
                            'code' => $code,
                            'car_model' => $carModel,
                            'error' => $errorMsg
                        ]);
                    }
                } catch (\Exception $e) {
                    $errorMsg = 'Error processing row with brand "' . ($brand ?? 'N/A') . '": ' . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Error processing cross car row', [
                        'error' => $e->getMessage(),
                        'brand' => $brand ?? 'N/A',
                        'code' => $code ?? 'N/A',
                        'car_model' => $carModel ?? 'N/A',
                        'row_data' => $rowData,
                        'stack_trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // Create Fileoperation record for history tracking
            $originalFileName = $request->input('file_name', 'cross_cars_import.xlsx');
            $uniqueDisplayName = $this->generateUniqueFileName($originalFileName, 'cross_cars');
            $tempFilePath = 'imports/cross_cars/' . time() . '_' . $originalFileName;
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'product_id' => null,
                'file_path' => $tempFilePath,
                'file_name' => $uniqueDisplayName,
                'operation_type' => 'cross_cars',
                'status' => count($errors) > 0 ? 'completed_with_errors' : 'success',
                'records_processed' => $imported + $skipped + count($errors),
                'records_imported' => $imported,
                'records_skipped' => $skipped,
                'error_count' => count($errors)
            ]);

            DB::commit();

            Log::info('Cross cars import completed', [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => count($errors)
            ]);

            $message = "Cross cars import completed. Imported: {$imported}, Skipped: {$skipped}";
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
            Log::error('Cross cars import error: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error importing cross cars: ' . $e->getMessage()
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
