<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Warehouseaccount;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
class WarehouseaccountController extends BaseController
{
    protected $searchableColumns = ['trans_number', 'user_id', 'warehouse_id', 'supplier_id', 'amount', 'invoice_number', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance'];
    protected $journalService;

    public function __construct(JournalService $journalService)
    {
        $this->journalService = $journalService;
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
        $query = Warehouseaccount::orderBy($sortBy, $sortDir);
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
        $warehouseaccount = $query->paginate($perPage); 
        $data = [
            "data" => $warehouseaccount->toArray(), 
            'current_page' => $warehouseaccount->currentPage(),
            'total_pages' => $warehouseaccount->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_warehouseaccounts(){
        $data = Warehouseaccount::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Warehouseaccount::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for warehouseaccount');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
                "warehouse_id" => "required|exists:warehouses,id",
                "supplier_id" => "nullable|exists:suppliers,id",
                "amount" => "required|numeric|min:0.01",
                "invoice_number" => "nullable|string|max:100",
                "payment_status" => "nullable|string|max:50",
                "account_type_id" => "required|exists:accounttypes,id",
                "payment_note_id" => "nullable|exists:paymentnotes,id",
                "pictures" => "nullable|array",
                "pictures.*" => "nullable|string", // Base64 encoded images
                "additional_note" => "nullable|string",
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            return DB::transaction(function () use ($validated, $request) {
                // Auto-generate transaction number with "wh" prefix
                $transNumber = $this->generateTransactionNumber('wh');
                
                // Handle multiple file uploads
                $pictureUrls = [];
                if (isset($validated['pictures']) && is_array($validated['pictures'])) {
                    foreach ($validated['pictures'] as $index => $base64Image) {
                        if (!empty($base64Image)) {
                            $pictureUrl = $this->saveBase64Image($base64Image, 'warehouseaccount', $transNumber . '_' . $index);
                            if ($pictureUrl) {
                                $pictureUrls[] = $pictureUrl;
                            }
                        }
                    }
                }

                // Create journal entry using JournalService
                $transactionDate = now()->format('Y-m-d');
                $journalData = [
                    'transaction_date' => $transactionDate,
                    'description' => 'Warehouse Account Transaction - ' . $transNumber,
                    'reference_number' => $transNumber,
                    'account_type' => 'warehouse',
                    'account_id' => $validated['warehouse_id'],
                    'amount' => $validated['amount'],
                    'payment_note_id' => $validated['payment_note_id'],
                    'account_type_id' => $validated['account_type_id'],
                    'additional_notes' => $validated['additional_note'] ?? null,
                    'pictures' => !empty($pictureUrls) ? json_encode($pictureUrls) : null,
                    'invoice_number' => $validated['invoice_number'] ?? null,
                    'payment_status' => $validated['payment_status'] ?? 'pending',
                ];

                $journalEntry = $this->journalService->createJournalEntry($journalData);

                // Create warehouseaccount record for backward compatibility
                $warehouseAccountData = [
                    'trans_number' => $transNumber,
                    'warehouse_id' => $validated['warehouse_id'],
                    'supplier_id' => $validated['supplier_id'],
                    'user_id' => auth()->id(),
                    'amount' => $validated['amount'],
                    'invoice_number' => $validated['invoice_number'],
                    'payment_status' => $validated['payment_status'] ?? 'pending',
                    'account_type_id' => $validated['account_type_id'],
                    'payment_note_id' => $validated['payment_note_id'],
                    'picture_url' => !empty($pictureUrls) ? json_encode($pictureUrls) : null,
                    'additional_note' => $validated['additional_note'],
                    'balance' => 0, // Will be updated by journal service
                ];

                $warehouseaccount = Warehouseaccount::create($warehouseAccountData);

                // Update balance from journal entry
                $balance = $this->journalService->getRunningBalance('warehouse', $validated['warehouse_id']);
                $warehouseaccount->update(['balance' => $balance]);

                return $this->sendResponse([
                    'warehouseaccount' => $warehouseaccount,
                    'journal_entry' => $journalEntry,
                    'balance' => $balance
                ], "Warehouse account transaction created successfully");
            });

        } catch (\Exception $e) {
            Log::error('WarehouseaccountController store error: ' . $e->getMessage());
            return $this->sendError("Error creating warehouseaccount", ['error' => $e->getMessage()]);
        }
    }

    /**
     * Generate unique transaction number with prefix
     */
    private function generateTransactionNumber($prefix)
    {
        $lastTransaction = Warehouseaccount::where('trans_number', 'like', $prefix . '%')
            ->orderBy('trans_number', 'desc')
            ->first();

        if ($lastTransaction) {
            $lastNumber = (int) substr($lastTransaction->trans_number, strlen($prefix));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Save base64 image to storage
     */
    private function saveBase64Image($base64String, $folder, $filename)
    {
        try {
            // Remove data:image/jpeg;base64, prefix if present
            if (strpos($base64String, 'data:image') === 0) {
                $base64String = substr($base64String, strpos($base64String, ',') + 1);
            }

            $imageData = base64_decode($base64String);
            if ($imageData === false) {
                return null;
            }

            $extension = 'jpg'; // Default extension
            $filePath = $folder . '/' . $filename . '.' . $extension;
            
            Storage::disk('public')->put($filePath, $imageData);
            
            return 'storage/' . $filePath;
        } catch (\Exception $e) {
            Log::error('Error saving image: ' . $e->getMessage());
            return null;
        }
    }

    public function show($id)
    {
        $warehouseaccount = Warehouseaccount::findOrFail($id);
        return $this->sendResponse($warehouseaccount, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $warehouseaccount = Warehouseaccount::findOrFail($id);
             $validationRules = [
                //for update

              
              "trans_number"=>"required|string|unique:warehouseaccounts,trans_number," . $id . "|max:50",
              "user_id"=>"nullable|exists:users,id",
              "warehouse_id"=>"nullable|exists:warehouses,id",
              "supplier_id"=>"nullable|exists:suppliers,id",
              "amount"=>"required|numeric",
              "invoice_number"=>"nullable|string|max:100",
              "payment_status"=>"nullable|string|max:50",
              "account_type_id"=>"nullable|exists:accounttypes,id",
              "payment_note_id"=>"nullable|exists:paymentnotes,id",
              "picture_url"=>"nullable|string",
              "additional_note"=>"nullable|string",
              "balance"=>"nullable|numeric",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Set default values programmatically
            if (!isset($validated['balance'])) {
                $validated['balance'] = 0;
            }


            //file uploads update

            $warehouseaccount->update($validated);
            return $this->sendResponse($warehouseaccount, "warehouseaccount updated successfully");
        } catch (\Exception $e) {
            Log::error('WarehouseaccountController update error: ' . $e->getMessage());
            return $this->sendError("Error updating warehouseaccount", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $warehouseaccount = Warehouseaccount::findOrFail($id);
            $warehouseaccount->delete();





            //delete files uploaded
            return $this->sendResponse(1, "warehouseaccount deleted succesfully");
        } catch (\Exception $e) {
            Log::error('WarehouseaccountController destroy error: ' . $e->getMessage());
            return $this->sendError("Error deleting warehouseaccount", ['error' => $e->getMessage()]);
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
}
