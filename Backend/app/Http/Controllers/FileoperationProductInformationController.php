<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\ProductInformation;
use App\Models\Product;
use App\Models\Brandname;
use App\Models\Unit;
use App\Models\Boxe;
use App\Models\Label;
use App\Models\Fileoperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;

class FileoperationProductInformationController extends BaseController
{
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

    /**
     * Validate product information from Excel file
     */
    public function validateProductInformation(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls|max:10240',
                'operation_type' => 'required|string'
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

            Log::info('Product Information Excel file loaded', [
                'total_rows' => $data->count(),
                'first_few_rows' => $data->take(3)->toArray()
            ]);

            // Enhanced header detection
            $headers = null;
            $headerRowIndex = 0;
            
            // Look for headers in first 5 rows
            for ($i = 0; $i < min(5, $data->count()); $i++) {
                $row = $data->get($i);
                if ($row) {
                    $rowArray = $row->toArray();
                    
                    // Check if this row contains header-like values
                    $headerIndicators = ['brand', 'code', 'net weight', 'gross weight', 'unit', 'box', 'label'];
                    $matches = 0;
                    
                    foreach ($rowArray as $cell) {
                        if (is_string($cell)) {
                            foreach ($headerIndicators as $indicator) {
                                if (stripos($cell, $indicator) !== false) {
                                    $matches++;
                                    break;
                                }
                            }
                        }
                    }
                    
                    if ($matches >= 2) { // At least 2 header indicators found
                        $headers = $rowArray;
                        $headerRowIndex = $i;
                        break;
                    }
                }
            }
            
            // Fallback: use first non-empty row as headers
            if (!$headers) {
                foreach ($data as $index => $row) {
                    $rowArray = $row->toArray();
                    if (!empty(array_filter($rowArray))) {
                        $headers = $rowArray;
                        $headerRowIndex = $index;
                        break;
                    }
                }
            }

            Log::info('Product Information headers detected', [
                'headers' => $headers,
                'header_row_index' => $headerRowIndex
            ]);

            if (!$headers) {
                return response()->json([
                    'success' => false,
                    'message' => 'Could not detect headers in Excel file'
                ], 400);
            }

            // Get data rows (skip header row)
            if ($headerRowIndex !== null) {
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

            Log::info('Product Information Excel column mapping', ['headers' => $headers, 'column_map' => $columnMap]);

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

            // Validate product information data
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
                if (in_array('Brand', $rowData) || in_array('Brand code', $rowData) || in_array('Net weight', $rowData)) {
                    continue;
                }

                // Map columns by name with flexible alternatives
                $brand = trim($getColumnValue($rowData, 'Brand', ['brand', 'brand_name', 'brandname']));
                $brandCode = trim($getColumnValue($rowData, 'Brand code', ['brand code', 'brand_code', 'brandcode', 'code']));
                $oeCode = trim($getColumnValue($rowData, 'OE code', ['oe code', 'oe_code', 'oecode', 'oe']));
                $netWeight = trim($getColumnValue($rowData, 'Net weight', ['net weight', 'net_weight', 'netweight']));
                $grossWeight = trim($getColumnValue($rowData, 'Gross weight', ['gross weight', 'gross_weight', 'grossweight']));
                $unit = trim($getColumnValue($rowData, 'Unit', ['unit', 'unit_name', 'unitname']));
                $boxName = trim($getColumnValue($rowData, 'Box Name', ['box name', 'box_name', 'boxname', 'box']));
                $labelName = trim($getColumnValue($rowData, 'Label', ['label', 'label_name', 'labelname']));
                $qty = trim($getColumnValue($rowData, 'Qty', ['qty', 'quantity']));
                $productSizeA = trim($getColumnValue($rowData, 'Product size A (cm)', ['product size a', 'size_a', 'size a']));
                $productSizeB = trim($getColumnValue($rowData, 'Product size B (cm)', ['product size b', 'size_b', 'size b']));
                $productSizeC = trim($getColumnValue($rowData, 'Product size C (cm)', ['product size c', 'size_c', 'size c']));
                $additionalNote = trim($getColumnValue($rowData, 'Additional note', ['additional note', 'additional_note', 'note']));

                $isValid = true;
                $errors = [];

                // Required field validation: Brand and Brand Code must exist in Products
                if (empty($brand) || empty($brandCode)) {
                    $isValid = false;
                    $errors[] = 'Brand and Brand Code are required';
                } else {
                    // Check if Brand/Code combination exists in Products table
                    $product = Product::whereHas('brand', function($query) use ($brand) {
                        $query->where('brand_name', $brand);
                    })->where('brand_code', $brandCode)->first();
                    
                    if (!$product) {
                        $isValid = false;
                        $errors[] = 'Brand "' . $brand . '" with Code "' . $brandCode . '" does not exist in Products table';
                    }
                }

                // Unit validation - must exist in units table if provided
                if (!empty($unit)) {
                    $unitExists = \App\Models\Unit::where('name', $unit)->exists();
                    
                    if (!$unitExists) {
                        $isValid = false;
                        $errors[] = 'Unit "' . $unit . '" does not exist in units table';
                    }
                }

                // Box validation - must exist in boxes table if provided
                if (!empty($boxName)) {
                    $boxExists = \App\Models\Boxe::where('box_name', $boxName)->exists();
                    
                    if (!$boxExists) {
                        $isValid = false;
                        $errors[] = 'Box "' . $boxName . '" does not exist in boxes table';
                    }
                }

                // Label validation - must exist in labels table if provided
                if (!empty($labelName)) {
                    $labelExists = \App\Models\Label::where('label_name', $labelName)->exists();
                    
                    if (!$labelExists) {
                        $isValid = false;
                        $errors[] = 'Label "' . $labelName . '" does not exist in labels table';
                    }
                }

                if ($isValid) {
                    // Check for duplicates in existing products (using brand_code + oe_code)
                    $duplicate = Product::where('brand_code', $brandCode)
                        ->where('oe_code', $oeCode)
                        ->exists();

                    Log::info('Duplicate check for product information', [
                        'brand_code' => $brandCode,
                        'oe_code' => $oeCode,
                        'duplicate_found' => $duplicate,
                        'row' => $index + 2
                    ]);

                    if ($duplicate) {
                        $duplicates[] = [
                            'row' => $index + 2,
                            'data' => $rowData,
                            'errors' => ['Product information already exists in database']
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
            $seenCombinations = [];
            
            foreach ($validRows as $key => $row) {
                $rowData = $row['data'];
                $brandCode = trim($getColumnValue($rowData, 'Brand code', ['brand code', 'brand_code']));
                $oeCode = trim($getColumnValue($rowData, 'OE code', ['oe code', 'oe_code']));
                
                $identifier = $brandCode . '|' . $oeCode;
                
                if (isset($seenCombinations[$identifier])) {
                    // This is a duplicate within the file
                    $internalDuplicates[] = [
                        'row' => $row['row'],
                        'data' => $rowData,
                        'errors' => ['Duplicate Brand Code + OE Code combination within file']
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
            Log::error('Product information validation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process product information import
     */
    public function processProductInformationImport(Request $request)
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

            Log::info('Processing product information import', [
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

            foreach ($validRows as $index => $validRow) {
                try {
                    $data = $validRow['data'];
                    
                    // Extract values using helper function
                    $brand = trim($getColumnValue($data, 'Brand', ['brand', 'brand_name']));
                    $brandCode = trim($getColumnValue($data, 'Brand code', ['brand code', 'brand_code']));
                    $oeCode = trim($getColumnValue($data, 'OE code', ['oe code', 'oe_code']));
                    $netWeight = trim($getColumnValue($data, 'Net weight', ['net weight', 'net_weight']));
                    $grossWeight = trim($getColumnValue($data, 'Gross weight', ['gross weight', 'gross_weight']));
                    $unit = trim($getColumnValue($data, 'Unit', ['unit', 'unit_name']));
                    $boxName = trim($getColumnValue($data, 'Box Name', ['box name', 'box_name']));
                    $labelName = trim($getColumnValue($data, 'Label', ['label', 'label_name']));
                    $qty = trim($getColumnValue($data, 'Qty', ['qty', 'quantity']));
                    $productSizeA = trim($getColumnValue($data, 'Product size A (cm)', ['product size a', 'size_a']));
                    $productSizeB = trim($getColumnValue($data, 'Product size B (cm)', ['product size b', 'size_b']));
                    $productSizeC = trim($getColumnValue($data, 'Product size C (cm)', ['product size c', 'size_c']));
                    $additionalNote = trim($getColumnValue($data, 'Additional note', ['additional note', 'additional_note']));

                    Log::info('Processing product information row', [
                        'brand' => $brand,
                        'brand_code' => $brandCode,
                        'oe_code' => $oeCode,
                        'net_weight' => $netWeight,
                        'gross_weight' => $grossWeight,
                        'unit' => $unit
                    ]);

                    if (!empty($brand) && !empty($brandCode)) {
                        // Find the product by brand and brand_code
                        $product = Product::whereHas('brand', function($query) use ($brand) {
                            $query->where('brand_name', $brand);
                        })->where('brand_code', $brandCode)->first();

                        if (!$product) {
                            $errorMsg = 'Product with Brand "' . $brand . '" and Code "' . $brandCode . '" not found';
                            $errors[] = $errorMsg;
                            Log::error('Product not found', [
                                'brand' => $brand,
                                'brand_code' => $brandCode,
                                'error' => $errorMsg
                            ]);
                            continue;
                        }

                        // Check if product information already exists (double check)
                        $exists = ProductInformation::where('product_id', $product->id)->exists();

                        if (!$exists) {
                            // Find related IDs
                            $unitId = null;
                            if (!empty($unit)) {
                                $unitModel = \App\Models\Unit::where('name', $unit)->first();
                                if ($unitModel) {
                                    $unitId = $unitModel->id;
                                }
                            }

                            $boxId = null;
                            if (!empty($boxName)) {
                                $boxModel = \App\Models\Boxe::where('box_name', $boxName)->first();
                                if ($boxModel) {
                                    $boxId = $boxModel->id;
                                }
                            }

                            $labelId = null;
                            if (!empty($labelName)) {
                                $labelModel = \App\Models\Label::where('label_name', $labelName)->first();
                                if ($labelModel) {
                                    $labelId = $labelModel->id;
                                }
                            }

                            Log::info('Creating product information entry', [
                                'product_id' => $product->id,
                                'brand_code' => $brandCode,
                                'oe_code' => $oeCode,
                                'unit_id' => $unitId,
                                'box_id' => $boxId,
                                'label_id' => $labelId
                            ]);

                            ProductInformation::create([
                                'product_id' => $product->id,
                                'product_name_id' => $product->productname_id,
                                'product_code' => 'PI-' . $product->id . '-' . time(),
                                'brand_code' => $brandCode,
                                'oe_code' => $oeCode,
                                'description' => $product->description ?? '',
                                'qty' => is_numeric($qty) ? (float)$qty : null,
                                'net_weight' => is_numeric($netWeight) ? (float)$netWeight : null,
                                'gross_weight' => is_numeric($grossWeight) ? (float)$grossWeight : null,
                                'unit_id' => $unitId,
                                'box_id' => $boxId,
                                'label_id' => $labelId,
                                'product_size_a' => is_numeric($productSizeA) ? (float)$productSizeA : null,
                                'product_size_b' => is_numeric($productSizeB) ? (float)$productSizeB : null,
                                'product_size_c' => is_numeric($productSizeC) ? (float)$productSizeC : null,
                                'additional_note' => $additionalNote
                            ]);
                            
                            $imported++;
                            Log::info('Created product information entry successfully', [
                                'product_id' => $product->id,
                                'brand_code' => $brandCode
                            ]);
                        } else {
                            $skipped++;
                            Log::info('Skipped duplicate product information entry', [
                                'product_id' => $product->id,
                                'brand_code' => $brandCode
                            ]);
                        }
                    } else {
                        $errorMsg = "Missing required fields for product information";
                        $errors[] = $errorMsg;
                        Log::error('Missing required fields', [
                            'brand' => $brand,
                            'brand_code' => $brandCode,
                            'error' => $errorMsg
                        ]);
                    }

                } catch (\Exception $e) {
                    $errorMsg = "Error processing row {$index}: " . $e->getMessage();
                    $errors[] = $errorMsg;
                    Log::error('Error processing product information row', [
                        'row_index' => $index,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }

            // Create file operation record
            $displayName = $this->generateUniqueFileName($request->input('file_name', 'product_information_import.xlsx'), 'product_information');
            
            Fileoperation::create([
                'display_name' => $displayName,
                'file_path' => 'imports/product_information/' . $displayName,
                'operation_type' => 'product_information',
                'status' => 'completed',
                'imported_count' => $imported,
                'error_count' => count($errors),
                'skipped_count' => $skipped
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Import completed successfully. {$imported} product information records imported, {$skipped} skipped.",
                'data' => [
                    'imported_count' => $imported,
                    'skipped_count' => $skipped,
                    'error_count' => count($errors),
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product information import error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error importing product information: ' . $e->getMessage()
            ], 500);
        }
    }
}
