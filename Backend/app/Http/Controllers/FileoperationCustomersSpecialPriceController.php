<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Customer;
use App\Models\Product;
use App\Models\CustomerSpecialPrice;

class FileoperationCustomersSpecialPriceController extends Controller
{
    public function validateCustomersSpecialPrice(Request $request)
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

            // Expected columns: Customer, Brand, Code, Min. Qty, Price
            $expectedColumns = ['customer', 'brand', 'code', 'min_qty', 'price'];
            
            // Get all customers and products for validation
            $customers = Customer::pluck('name', 'id')->toArray();
            $products = Product::select('id', 'brand', 'code')->get()->keyBy(function($item) {
                return strtolower($item->brand . '|' . $item->code);
            });

            $validRows = [];
            $invalidRows = [];
            $duplicates = [];
            $seenRows = [];

            foreach ($data as $index => $row) {
                $rowNumber = $index + 2; // +2 because we removed header and array is 0-indexed
                $rowData = array_pad($row, 5, ''); // Ensure we have 5 columns
                
                // Check for duplicates
                $rowKey = implode('|', array_slice($rowData, 0, 4)); // Customer|Brand|Code|Min.Qty
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
                
                // Validate Customer
                $customerName = trim($rowData[0]);
                if (empty($customerName)) {
                    $errors[] = 'Customer is required';
                } elseif (!in_array($customerName, $customers)) {
                    $errors[] = 'Customer not found in system';
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

                // Validate Min. Qty
                $minQty = trim($rowData[3]);
                if (empty($minQty)) {
                    $errors[] = 'Min. Qty is required';
                } elseif (!is_numeric($minQty) || $minQty < 1) {
                    $errors[] = 'Min. Qty must be a positive integer';
                }

                // Validate Price
                $price = trim($rowData[4]);
                if (empty($price)) {
                    $errors[] = 'Price is required';
                } elseif (!is_numeric($price) || $price < 0) {
                    $errors[] = 'Price must be a valid positive number';
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

    public function importCustomersSpecialPrice(Request $request)
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

            // Get customers and products for mapping
            $customers = Customer::pluck('id', 'name')->toArray();
            $products = Product::select('id', 'brand', 'code')->get()->keyBy(function($item) {
                return strtolower($item->brand . '|' . $item->code);
            });

            $importedCount = 0;
            $errors = [];

            DB::beginTransaction();

            foreach ($validRows as $row) {
                try {
                    $rowData = $row['data'];
                    
                    $customerName = trim($rowData[0]);
                    $brand = trim($rowData[1]);
                    $code = trim($rowData[2]);
                    $minQty = intval($rowData[3]);
                    $price = floatval($rowData[4]);

                    // Get customer and product IDs
                    $customerId = $customers[$customerName] ?? null;
                    $productKey = strtolower($brand . '|' . $code);
                    $product = $products->get($productKey);
                    $productId = $product ? $product->id : null;

                    if (!$customerId || !$productId) {
                        $errors[] = "Row {$row['row']}: Invalid customer or product";
                        continue;
                    }

                    // Check if record already exists
                    $existingRecord = CustomerSpecialPrice::where([
                        'customer_id' => $customerId,
                        'product_id' => $productId,
                        'min_qty' => $minQty
                    ])->first();

                    if ($existingRecord) {
                        // Update existing record
                        $existingRecord->update([
                            'price' => $price,
                            'updated_at' => now()
                        ]);
                    } else {
                        // Create new record
                        CustomerSpecialPrice::create([
                            'customer_id' => $customerId,
                            'product_id' => $productId,
                            'min_qty' => $minQty,
                            'price' => $price,
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
                'message' => "Successfully imported {$importedCount} customer special prices",
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
