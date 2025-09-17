<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\OtherSupplierPrice;

class FileoperationOtherSuppliersPricesController extends Controller
{
    public function validateOtherSuppliersPrices(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
                'operation_type' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray();

            // Remove empty rows and get headers
            $data = array_filter($data, function($row) {
                return !empty(array_filter($row));
            });

            if (empty($data)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File is empty or contains no valid data'
                ], 400);
            }

            $headers = array_shift($data); // Remove header row
            $totalRows = count($data);

            // Expected columns: Supplier, Brand, Code, Purchase Price, Extra Cost, Supplier Position
            $expectedColumns = ['supplier', 'brand', 'code', 'purchase_price', 'extra_cost', 'supplier_position'];
            
            // Get all suppliers and products for validation
            $suppliers = Supplier::pluck('name', 'id')->toArray();
            $products = Product::select('id', 'brand', 'code')->get()->keyBy(function($item) {
                return strtolower($item->brand . '|' . $item->code);
            });

            $validRows = [];
            $invalidRows = [];
            $duplicates = [];
            $seenRows = [];

            foreach ($data as $index => $row) {
                $rowNumber = $index + 2; // +2 because we removed header and array is 0-indexed
                $rowData = array_pad($row, 6, ''); // Ensure we have 6 columns
                
                // Check for duplicates
                $rowKey = implode('|', array_slice($rowData, 0, 3)); // Supplier|Brand|Code
                if (in_array($rowKey, $seenRows)) {
                    $duplicates[] = [
                        'row' => $rowNumber,
                        'data' => $rowData,
                        'errors' => ['Duplicate row detected']
                    ];
                    continue;
                }
                $seenRows[] = $rowKey;

                $errors = [];
                
                // Validate Supplier
                $supplierName = trim($rowData[0]);
                if (empty($supplierName)) {
                    $errors[] = 'Supplier is required';
                } elseif (!in_array($supplierName, $suppliers)) {
                    $errors[] = 'Supplier not found in system';
                }

                // Validate Brand and Code combination
                $brand = trim($rowData[1]);
                $code = trim($rowData[2]);
                if (empty($brand)) {
                    $errors[] = 'Brand is required';
                }
                if (empty($code)) {
                    $errors[] = 'Code is required';
                }
                
                $productKey = strtolower($brand . '|' . $code);
                if (!empty($brand) && !empty($code) && !$products->has($productKey)) {
                    $errors[] = 'Product (Brand/Code combination) not found in system';
                }

                // Validate Purchase Price
                $purchasePrice = trim($rowData[3]);
                if (empty($purchasePrice)) {
                    $errors[] = 'Purchase Price is required';
                } elseif (!is_numeric($purchasePrice) || $purchasePrice < 0) {
                    $errors[] = 'Purchase Price must be a valid positive number';
                }

                // Validate Extra Cost (optional)
                $extraCost = trim($rowData[4]);
                if (!empty($extraCost) && (!is_numeric($extraCost) || $extraCost < 0)) {
                    $errors[] = 'Extra Cost must be a valid positive number';
                }

                // Validate Supplier Position
                $supplierPosition = trim($rowData[5]);
                if (empty($supplierPosition)) {
                    $errors[] = 'Supplier Position is required';
                } elseif (!is_numeric($supplierPosition) || $supplierPosition < 1) {
                    $errors[] = 'Supplier Position must be a positive integer';
                }

                if (empty($errors)) {
                    $validRows[] = [
                        'row' => $rowNumber,
                        'data' => $rowData
                    ];
                } else {
                    $invalidRows[] = [
                        'row' => $rowNumber,
                        'data' => $rowData,
                        'errors' => $errors
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'total_rows' => $totalRows,
                    'headers' => $headers,
                    'expected_columns' => $expectedColumns
                ],
                'validation' => [
                    'valid_rows' => $validRows,
                    'invalid_rows' => $invalidRows,
                    'duplicates' => $duplicates
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing file: ' . $e->getMessage()
            ], 500);
        }
    }

    public function importOtherSuppliersPrices(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'data' => 'required|array',
                'data.*.data' => 'required|array',
                'file_name' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $validRows = $request->input('data');
            $fileName = $request->input('file_name');

            // Get suppliers and products for mapping
            $suppliers = Supplier::pluck('id', 'name')->toArray();
            $products = Product::select('id', 'brand', 'code')->get()->keyBy(function($item) {
                return strtolower($item->brand . '|' . $item->code);
            });

            $importedCount = 0;
            $errors = [];

            DB::beginTransaction();

            foreach ($validRows as $row) {
                try {
                    $rowData = $row['data'];
                    
                    $supplierName = trim($rowData[0]);
                    $brand = trim($rowData[1]);
                    $code = trim($rowData[2]);
                    $purchasePrice = floatval($rowData[3]);
                    $extraCost = !empty($rowData[4]) ? floatval($rowData[4]) : 0;
                    $supplierPosition = intval($rowData[5]);

                    // Get supplier and product IDs
                    $supplierId = $suppliers[$supplierName] ?? null;
                    $productKey = strtolower($brand . '|' . $code);
                    $product = $products->get($productKey);
                    $productId = $product ? $product->id : null;

                    if (!$supplierId || !$productId) {
                        $errors[] = "Row {$row['row']}: Invalid supplier or product";
                        continue;
                    }

                    // Check if record already exists
                    $existingRecord = OtherSupplierPrice::where([
                        'supplier_id' => $supplierId,
                        'product_id' => $productId
                    ])->first();

                    if ($existingRecord) {
                        // Update existing record
                        $existingRecord->update([
                            'purchase_price' => $purchasePrice,
                            'extra_cost' => $extraCost,
                            'supplier_position' => $supplierPosition,
                            'updated_at' => now()
                        ]);
                    } else {
                        // Create new record
                        OtherSupplierPrice::create([
                            'supplier_id' => $supplierId,
                            'product_id' => $productId,
                            'purchase_price' => $purchasePrice,
                            'extra_cost' => $extraCost,
                            'supplier_position' => $supplierPosition,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }

                    $importedCount++;

                } catch (\Exception $e) {
                    $errors[] = "Row {$row['row']}: " . $e->getMessage();
                }
            }

            if (!empty($errors)) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Import failed with errors',
                    'errors' => $errors
                ], 400);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully imported {$importedCount} other supplier prices",
                'imported_count' => $importedCount
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
