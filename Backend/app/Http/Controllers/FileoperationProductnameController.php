<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Fileoperation;
use App\Models\Productname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;

class FileoperationProductnameController extends BaseController
{
    /**
     * Generate a unique display name based on original name with collision handling
     */
    private function generateUniqueFileName($originalName, $type)
    {
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $counter = 1;
        $uniqueName = $baseName . '_' . $type;

        while (Fileoperation::where('file_name', 'like', $uniqueName . '%')->exists()) {
            $uniqueName = $baseName . '_' . $type . '_' . $counter;
            $counter++;
        }

        return $uniqueName . '.' . $extension;
    }

    /**
     * Validate product names from Excel file
     */
    public function validateProductNames(Request $request)
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
            
            // Log file information for debugging
            Log::info('Product Names file upload started', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'extension' => $file->getClientOriginalExtension()
            ]);
            
            $data = Excel::toCollection(new class implements ToCollection {
                public function collection(Collection $rows)
                {
                    return $rows;
                }
            }, $file)->first();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'File is empty or could not be read'
                ], 422);
            }

            Log::info('Product Names Excel data loaded', [
                'total_rows' => $data->count(),
                'first_few_rows' => $data->take(3)->toArray()
            ]);

            // Extract headers from first row and create column mapping
            $headers = $data->first()->toArray();
            
            // Check if headers are all null/empty - might need to look at different row
            if (empty(array_filter($headers))) {
                Log::warning('First row appears to be empty, checking next rows');
                
                // Try to find the header row by looking for common header patterns
                $headerRowIndex = 0;
                foreach ($data->take(5) as $index => $row) {
                    $rowData = $row->toArray();
                    $hasHeaders = false;
                    
                    // Check for common product name headers with more flexible matching
                    foreach ($rowData as $cell) {
                        $cellValue = strtolower(trim($cell ?? ''));
                        // More flexible header matching
                        $headerPatterns = [
                            'hs code', 'hs_code', 'hscode', 'hs',
                            'name az', 'name_az', 'nameaz', 'az', 'azerbaijani',
                            'description en', 'description_en', 'description', 'desc', 'english',
                            'name ru', 'name_ru', 'nameru', 'ru', 'russian',
                            'name cn', 'name_cn', 'namecn', 'cn', 'chinese',
                            'categories', 'category', 'cat', 'kategori'
                        ];
                        
                        if (in_array($cellValue, $headerPatterns) || 
                            str_contains($cellValue, 'name') || 
                            str_contains($cellValue, 'description') ||
                            str_contains($cellValue, 'category') ||
                            str_contains($cellValue, 'code')) {
                            $hasHeaders = true;
                            break;
                        }
                    }
                    
                    if ($hasHeaders) {
                        $headerRowIndex = $index;
                        $headers = $rowData;
                        Log::info('Found headers at row ' . ($index + 1), ['headers' => $headers]);
                        break;
                    }
                }
                
                if (empty(array_filter($headers))) {
                    // Last resort: use the first non-empty row as headers and log what we found
                    Log::warning('Could not detect headers automatically, using first non-empty row');
                    foreach ($data->take(10) as $index => $row) {
                        $rowData = $row->toArray();
                        if (!empty(array_filter($rowData))) {
                            $headers = $rowData;
                            $headerRowIndex = $index;
                            Log::info('Using row ' . ($index + 1) . ' as headers', ['headers' => $headers]);
                            break;
                        }
                    }
                    
                    // If still no headers found, return detailed error
                    if (empty(array_filter($headers))) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Could not find valid headers in the Excel file. Please ensure your file has column headers. Expected headers: "HS Code", "Name AZ", "Description EN", "Name RU", "Name CN", "Categories". First few rows: ' . json_encode($data->take(3)->toArray())
                        ], 422);
                    }
                }
                
                // Skip rows up to and including the header row
                $dataRows = $data->skip($headerRowIndex + 1);
            } else {
                $dataRows = $data->skip(1);
            }
            
            $columnMap = [];
            foreach ($headers as $index => $header) {
                if ($header !== null && trim($header) !== '') {
                    // Store both exact and normalized versions for flexible matching
                    $exactHeader = trim($header);
                    $normalizedHeader = strtolower(trim($header));
                    $columnMap[$exactHeader] = $index;
                    $columnMap[$normalizedHeader] = $index;
                }
            }

            Log::info('Product Names Excel column mapping', ['headers' => $headers, 'column_map' => $columnMap]);

            // Helper function to get column value by name
            $getColumnValue = function($rowData, $columnName, $alternativeNames = []) use ($columnMap) {
                // First try exact match (case-sensitive)
                if (isset($columnMap[$columnName])) {
                    return $rowData[$columnMap[$columnName]] ?? '';
                }
                
                // Then try normalized (lowercase) match
                $normalizedName = strtolower(trim($columnName));
                if (isset($columnMap[$normalizedName])) {
                    return $rowData[$columnMap[$normalizedName]] ?? '';
                }
                
                // Try alternative names
                foreach ($alternativeNames as $altName) {
                    if (isset($columnMap[$altName])) {
                        return $rowData[$columnMap[$altName]] ?? '';
                    }
                    $normalizedAlt = strtolower(trim($altName));
                    if (isset($columnMap[$normalizedAlt])) {
                        return $rowData[$columnMap[$normalizedAlt]] ?? '';
                    }
                }
                
                return '';
            };

            // Validate product names data
            $validRows = [];
            $invalidRows = [];
            $duplicates = [];

            foreach ($dataRows as $index => $row) {
                $rowData = $row->toArray();
                
                // Skip empty rows
                if (empty(array_filter($rowData))) {
                    continue;
                }
                
                // Skip rows that contain header values
                if (in_array('Categories', $rowData) || in_array('HS Code', $rowData) || in_array('Name AZ', $rowData)) {
                    continue;
                }

                // Map columns by name instead of position with more flexible alternatives
                $hsCode = trim($getColumnValue($rowData, 'HS Code', ['hs code', 'hs_code', 'hscode', 'hs', 'code']));
                $nameAz = trim($getColumnValue($rowData, 'Name AZ', ['name az', 'name_az', 'nameaz', 'az', 'azerbaijani', 'name']));
                $descriptionEn = trim($getColumnValue($rowData, 'Description EN', ['description en', 'description_en', 'description', 'desc', 'english', 'name en']));
                $nameRu = trim($getColumnValue($rowData, 'Name RU', ['name ru', 'name_ru', 'nameru', 'ru', 'russian']));
                $nameCn = trim($getColumnValue($rowData, 'Name CN', ['name cn', 'name_cn', 'namecn', 'cn', 'chinese']));
                $category = trim($getColumnValue($rowData, 'Categories', ['categories', 'category', 'cat', 'kategori']));

                $isValid = true;
                $errors = [];

                // Required field validation
                if (empty($nameAz)) {
                    $isValid = false;
                    $errors[] = 'Name AZ is required';
                }

                if (empty($descriptionEn)) {
                    $isValid = false;
                    $errors[] = 'Description EN is required';
                }

                // Category validation - must exist in categories table
                if (!empty($category)) {
                    $categoryExists = \App\Models\Categor::where('category_code', $category)
                        ->orWhere('category_az', $category)
                        ->orWhere('category_en', $category)
                        ->orWhere('category_ru', $category)
                        ->orWhere('category_cn', $category)
                        ->exists();
                    
                    Log::info('Category validation for product name', [
                        'category' => $category,
                        'category_exists' => $categoryExists,
                        'row' => $index + 2
                    ]);
                    
                    if (!$categoryExists) {
                        $isValid = false;
                        $errors[] = 'Category "' . $category . '" does not exist in categories table';
                    }
                }

                if ($isValid) {
                    // Check for duplicates in existing product names (using description_en or name_az)
                    $duplicate = Productname::where('name_az', $nameAz)
                        ->orWhere('description_en', $descriptionEn)
                        ->exists();

                    Log::info('Duplicate check for product name', [
                        'name_az' => $nameAz,
                        'description_en' => $descriptionEn,
                        'duplicate_found' => $duplicate,
                        'row' => $index + 2
                    ]);

                    if ($duplicate) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Product name already exists in database']
                        ];
                    } else {
                        $validRows[] = [
                            'row' => $index + 2,
                            'data' => $rowData
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
            $seenNames = [];
            
            foreach ($validRows as $key => $row) {
                $rowData = $row['data'];
                $nameAz = trim($getColumnValue($rowData, 'Name AZ', ['name az', 'name_az']));
                $descriptionEn = trim($getColumnValue($rowData, 'Description EN', ['description en', 'description_en']));
                
                $identifier = $nameAz . '|' . $descriptionEn;
                
                if (isset($seenNames[$identifier])) {
                    // This is a duplicate within the file
                    $internalDuplicates[] = [
                        'row' => $row['row'],
                        'data' => $row['data'],
                        'errors' => ["Product name '{$nameAz}' appears multiple times in the Excel file. Each product name must be unique within the import file."]
                    ];
                    unset($validRows[$key]); // Remove from valid rows
                } else {
                    $seenNames[$identifier] = true;
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
            Log::error('Product names validation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process product names import
     */
    public function processProductNamesImport(Request $request)
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

            Log::info('Processing product names import', [
                'valid_rows_count' => count($validRows),
                'request_data' => $request->all()
            ]);

            DB::beginTransaction();

            // Helper function to get column value by name
            $getColumnValue = function($rowData, $columnName, $alternativeNames = []) {
                // Create a simple column map from the row data
                $headers = array_keys($rowData);
                $columnMap = [];
                foreach ($headers as $index => $header) {
                    $exactHeader = trim($header);
                    $normalizedHeader = strtolower(trim($header));
                    $columnMap[$exactHeader] = $index;
                    $columnMap[$normalizedHeader] = $index;
                }

                // First try exact match (case-sensitive)
                if (isset($columnMap[$columnName]) && isset($rowData[$columnMap[$columnName]])) {
                    return $rowData[$columnMap[$columnName]] ?? '';
                }
                
                // Then try normalized (lowercase) match
                $normalizedName = strtolower(trim($columnName));
                if (isset($columnMap[$normalizedName]) && isset($rowData[$columnMap[$normalizedName]])) {
                    return $rowData[$columnMap[$normalizedName]] ?? '';
                }
                
                // Try alternative names
                foreach ($alternativeNames as $altName) {
                    if (isset($columnMap[$altName]) && isset($rowData[$columnMap[$altName]])) {
                        return $rowData[$columnMap[$altName]] ?? '';
                    }
                    $normalizedAlt = strtolower(trim($altName));
                    if (isset($columnMap[$normalizedAlt]) && isset($rowData[$columnMap[$normalizedAlt]])) {
                        return $rowData[$columnMap[$normalizedAlt]] ?? '';
                    }
                }
                
                return '';
            };

            foreach ($validRows as $index => $rowData) {
                try {
                    Log::info("Processing product name row {$index}", ['row_data' => $rowData]);
                    
                    $data = $rowData['data'];
                    $hsCode = trim($getColumnValue($data, 'HS Code', ['hs code', 'hs_code']));
                    $nameAz = trim($getColumnValue($data, 'Name AZ', ['name az', 'name_az']));
                    $descriptionEn = trim($getColumnValue($data, 'Description EN', ['description en', 'description_en']));
                    $nameRu = trim($getColumnValue($data, 'Name RU', ['name ru', 'name_ru']));
                    $nameCn = trim($getColumnValue($data, 'Name CN', ['name cn', 'name_cn']));
                    $category = trim($getColumnValue($data, 'Categories', ['categories', 'category']));

                    Log::info('Processing product name row', [
                        'hs_code' => $hsCode,
                        'name_az' => $nameAz,
                        'description_en' => $descriptionEn,
                        'name_ru' => $nameRu,
                        'name_cn' => $nameCn,
                        'category' => $category
                    ]);

                    if (!empty($nameAz) && !empty($descriptionEn)) {
                        // Check if product name already exists (double check)
                        $exists = Productname::where('name_az', $nameAz)
                            ->orWhere('description_en', $descriptionEn)
                            ->exists();

                        if (!$exists) {
                            // Find category ID if category is provided
                            $categoryId = null;
                            if (!empty($category)) {
                                $categoryModel = \App\Models\Categor::where('category_code', $category)
                                    ->orWhere('category_az', $category)
                                    ->orWhere('category_en', $category)
                                    ->orWhere('category_ru', $category)
                                    ->orWhere('category_cn', $category)
                                    ->first();
                                
                                if ($categoryModel) {
                                    $categoryId = $categoryModel->id;
                                }
                            }

                            Log::info('Creating product name entry', [
                                'name_az' => $nameAz,
                                'description_en' => $descriptionEn,
                                'category' => $category,
                                'category_id' => $categoryId
                            ]);

                            Productname::create([
                                'hs_code' => $hsCode,
                                'name_az' => $nameAz,
                                'description_en' => $descriptionEn,
                                'name_ru' => $nameRu,
                                'name_cn' => $nameCn,
                                'category_id' => $categoryId
                            ]);
                            
                            $imported++;
                            Log::info('Created product name entry successfully', [
                                'name_az' => $nameAz,
                                'description_en' => $descriptionEn,
                                'category_id' => $categoryId
                            ]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate product name entry', [
                                'name_az' => $nameAz,
                                'description_en' => $descriptionEn
                            ]);
                        }
                    } else {
                        $errorMsg = "Missing required fields for product name";
                        $errors[] = $errorMsg;
                        Log::error('Missing required fields', [
                            'name_az' => $nameAz,
                            'description_en' => $descriptionEn,
                            'error' => $errorMsg
                        ]);
                    }

                } catch (\Exception $e) {
                    $errorMsg = "Error processing row {$index}: " . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Row processing error', [
                        'row' => $index,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // Create file operation record
            $originalFileName = $request->input('file_name', 'product_names_import.xlsx');
            $uniqueDisplayName = $this->generateUniqueFileName($originalFileName, 'product_names');
            $tempFilePath = 'imports/product_names/' . time() . '_' . $originalFileName;
            
            Fileoperation::create([
                'user_id' => auth()->id(),
                'product_id' => null,
                'file_path' => $tempFilePath,
                'file_name' => $uniqueDisplayName,
                'operation_type' => 'product_names',
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

            Log::info('Product names import completed', [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => count($errors)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product names import completed successfully',
                'data' => [
                    'imported' => $imported,
                    'skipped' => $skipped,
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Product names import error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error importing product names: ' . $e->getMessage()
            ], 500);
        }
    }
}
