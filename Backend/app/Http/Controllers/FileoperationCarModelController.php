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
use App\Models\Carmodel;

class FileoperationCarModelController extends Controller
{
    /**
     * Validate car models Excel file
     */
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

            Log::info('Car models validation started', [
                'headers' => $headers,
                'total_rows' => $dataRows->count()
            ]);

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

                $carModel = trim($rowData[0] ?? '');

                Log::info("Processing row {$index}", [
                    'car_model' => $carModel
                ]);

                $isValid = true;
                $errors = [];

                // Validate required fields
                if (empty($carModel)) {
                    $isValid = false;
                    $errors[] = 'Car model is required';
                }

                if ($isValid) {
                    // Check for duplicates in existing car models
                    $duplicate = Carmodel::where('car_model', $carModel)->exists();
                    
                    if ($duplicate) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Car model already exists']
                        ];
                        Log::info('Duplicate found', [
                            'car_model' => $carModel
                        ]);
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

            // Check for internal duplicates within the Excel file
            $internalDuplicates = [];
            $seenCarModels = [];
            
            foreach ($validRows as $key => $row) {
                $carModel = trim($row['data'][0] ?? '');
                
                if (isset($seenCarModels[$carModel])) {
                    // Move to duplicates
                    $internalDuplicates[] = [
                        'row' => $row['row'],
                        'data' => $row['data'],
                        'errors' => ['Duplicate within Excel file']
                    ];
                    unset($validRows[$key]);
                } else {
                    $seenCarModels[$carModel] = true;
                }
            }
            
            // Merge internal duplicates with database duplicates
            $duplicates = array_merge($duplicates, $internalDuplicates);
            $validRows = array_values($validRows); // Re-index array

            Log::info('Car models validation completed', [
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
            Log::error('Car models validation error: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error validating file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process car models import
     */
    public function processCarModelsImport(Request $request)
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

            Log::info('Processing car models import', [
                'valid_rows_count' => count($validRows),
                'request_data' => $request->all()
            ]);

            DB::beginTransaction();

            foreach ($validRows as $index => $rowData) {
                try {
                    Log::info("Processing row {$index}", ['row_data' => $rowData]);
                    
                    $data = $rowData['data'];
                    $carModel = trim($data[0] ?? '');

                    Log::info('Processing car model row', [
                        'car_model' => $carModel
                    ]);

                    if (!empty($carModel)) {
                        // Check if already exists (double check)
                        $exists = Carmodel::where('car_model', $carModel)->exists();

                        if (!$exists) {
                            Log::info('Creating car model entry', [
                                'car_model' => $carModel
                            ]);

                            Carmodel::create([
                                'car_model' => $carModel,
                                'is_visible' => 1
                            ]);
                            
                            $imported++;
                            Log::info('Created car model entry successfully', [
                                'car_model' => $carModel
                            ]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate entry', [
                                'car_model' => $carModel
                            ]);
                        }
                    } else {
                        $errorMsg = 'Car model is required';
                        $errors[] = $errorMsg;
                        Log::error('Missing required field', [
                            'car_model' => $carModel,
                            'error' => $errorMsg
                        ]);
                    }
                } catch (\Exception $e) {
                    $errorMsg = 'Error processing row with car model "' . ($carModel ?? 'N/A') . '": ' . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Error processing car model row', [
                        'error' => $e->getMessage(),
                        'car_model' => $carModel ?? 'N/A',
                        'row_data' => $rowData,
                        'stack_trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // Create Fileoperation record for history tracking
            $originalFileName = $request->input('file_name', 'car_models_import.xlsx');
            $uniqueDisplayName = $this->generateUniqueFileName($originalFileName, 'car_models');
            $tempFilePath = 'imports/car_models/' . time() . '_' . $originalFileName;
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'product_id' => null,
                'file_path' => $tempFilePath,
                'file_name' => $uniqueDisplayName,
                'operation_type' => 'car_models',
                'status' => count($errors) > 0 ? 'completed_with_errors' : 'success',
                'records_processed' => $imported + $skipped + count($errors),
                'records_imported' => $imported,
                'records_skipped' => $skipped,
                'error_count' => count($errors)
            ]);

            DB::commit();

            Log::info('Car models import completed', [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => count($errors)
            ]);

            $message = "Car models import completed. Imported: {$imported}, Skipped: {$skipped}";
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
            Log::error('Car models import error: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error importing car models: ' . $e->getMessage()
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
