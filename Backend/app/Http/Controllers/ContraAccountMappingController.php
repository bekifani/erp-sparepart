<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ContraAccountMapping;
use App\Models\Accounttype;
use App\Models\Paymentnote;
use App\Models\LedgerAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class ContraAccountMappingController extends Controller
{
    /**
     * Display a listing of contra account mappings
     */
    public function index(Request $request)
    {
        try {
            $query = ContraAccountMapping::with(['accountType', 'paymentNote', 'contraLedgerAccount'])
                ->orderBy('account_type_id')
                ->orderBy('payment_note_id');

            // Apply filters
            if ($request->has('account_type_id') && $request->account_type_id !== '') {
                $query->where('account_type_id', $request->account_type_id);
            }

            if ($request->has('transaction_type') && $request->transaction_type !== '') {
                $query->where('transaction_type', $request->transaction_type);
            }

            if ($request->has('is_active') && $request->is_active !== '') {
                $query->where('is_active', $request->is_active === 'true');
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $mappings = $query->paginate($perPage);

            return $this->sendResponse($mappings, 'Contra account mappings retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving contra account mappings: ' . $e->getMessage());
            return $this->sendError('Error retrieving contra account mappings', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created contra account mapping
     */
    public function store(Request $request)
    {
        try {
            $validationRules = [
                'account_type_id' => 'required|exists:accounttypes,id',
                'payment_note_id' => 'nullable|exists:paymentnotes,id',
                'transaction_type' => 'required|string|max:50',
                'contra_ledger_account_id' => 'required|exists:ledger_accounts,id',
                'is_active' => 'nullable|boolean'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();
            
            // Set defaults
            $validated['is_active'] = $validated['is_active'] ?? true;

            // Check for existing mapping
            $existing = ContraAccountMapping::where('account_type_id', $validated['account_type_id'])
                ->where('payment_note_id', $validated['payment_note_id'])
                ->where('transaction_type', $validated['transaction_type'])
                ->first();

            if ($existing) {
                return $this->sendError('Mapping already exists for this combination');
            }

            $mapping = ContraAccountMapping::create($validated);

            return $this->sendResponse($mapping->load(['accountType', 'paymentNote', 'contraLedgerAccount']), 'Contra account mapping created successfully');
        } catch (Exception $e) {
            Log::error('Error creating contra account mapping: ' . $e->getMessage());
            return $this->sendError('Error creating contra account mapping', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified contra account mapping
     */
    public function show($id)
    {
        try {
            $mapping = ContraAccountMapping::with(['accountType', 'paymentNote', 'contraLedgerAccount'])->find($id);

            if (!$mapping) {
                return $this->sendError('Contra account mapping not found');
            }

            return $this->sendResponse($mapping, 'Contra account mapping retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving contra account mapping: ' . $e->getMessage());
            return $this->sendError('Error retrieving contra account mapping', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified contra account mapping
     */
    public function update(Request $request, $id)
    {
        try {
            $mapping = ContraAccountMapping::find($id);
            if (!$mapping) {
                return $this->sendError('Contra account mapping not found');
            }

            $validationRules = [
                'account_type_id' => 'required|exists:accounttypes,id',
                'payment_note_id' => 'nullable|exists:paymentnotes,id',
                'transaction_type' => 'required|string|max:50',
                'contra_ledger_account_id' => 'required|exists:ledger_accounts,id',
                'is_active' => 'nullable|boolean'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();

            // Check for existing mapping (excluding current record)
            $existing = ContraAccountMapping::where('account_type_id', $validated['account_type_id'])
                ->where('payment_note_id', $validated['payment_note_id'])
                ->where('transaction_type', $validated['transaction_type'])
                ->where('id', '!=', $id)
                ->first();

            if ($existing) {
                return $this->sendError('Mapping already exists for this combination');
            }

            $mapping->update($validated);

            return $this->sendResponse($mapping->load(['accountType', 'paymentNote', 'contraLedgerAccount']), 'Contra account mapping updated successfully');
        } catch (Exception $e) {
            Log::error('Error updating contra account mapping: ' . $e->getMessage());
            return $this->sendError('Error updating contra account mapping', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified contra account mapping
     */
    public function destroy($id)
    {
        try {
            $mapping = ContraAccountMapping::find($id);
            if (!$mapping) {
                return $this->sendError('Contra account mapping not found');
            }

            $mapping->delete();

            return $this->sendResponse([], 'Contra account mapping deleted successfully');
        } catch (Exception $e) {
            Log::error('Error deleting contra account mapping: ' . $e->getMessage());
            return $this->sendError('Error deleting contra account mapping', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Find mapping for given criteria
     */
    public function findMapping(Request $request)
    {
        try {
            $validationRules = [
                'account_type_id' => 'required|exists:accounttypes,id',
                'payment_note_id' => 'nullable|exists:paymentnotes,id',
                'transaction_type' => 'nullable|string|max:50'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();

            $mapping = ContraAccountMapping::findMapping(
                $validated['account_type_id'],
                $validated['payment_note_id'] ?? null,
                $validated['transaction_type'] ?? null
            );

            if (!$mapping) {
                return $this->sendError('No mapping found for the given criteria');
            }

            return $this->sendResponse($mapping->load(['accountType', 'paymentNote', 'contraLedgerAccount']), 'Mapping found successfully');
        } catch (Exception $e) {
            Log::error('Error finding contra account mapping: ' . $e->getMessage());
            return $this->sendError('Error finding contra account mapping', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get available account types for mapping
     */
    public function getAccountTypes()
    {
        try {
            $accountTypes = Accounttype::where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'name_ru', 'name_az', 'name_ch', 'category']);

            return $this->sendResponse($accountTypes, 'Account types retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving account types: ' . $e->getMessage());
            return $this->sendError('Error retrieving account types', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get available payment notes for mapping
     */
    public function getPaymentNotes()
    {
        try {
            $paymentNotes = Paymentnote::orderBy('note')
                ->get(['id', 'note', 'note_ru', 'note_az', 'note_ch']);

            return $this->sendResponse($paymentNotes, 'Payment notes retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving payment notes: ' . $e->getMessage());
            return $this->sendError('Error retrieving payment notes', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get available ledger accounts for contra mapping
     */
    public function getLedgerAccounts()
    {
        try {
            $ledgerAccounts = LedgerAccount::where('is_active', true)
                ->orderBy('code')
                ->get(['id', 'code', 'name', 'name_ru', 'name_az', 'name_ch', 'account_class']);

            return $this->sendResponse($ledgerAccounts, 'Ledger accounts retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving ledger accounts: ' . $e->getMessage());
            return $this->sendError('Error retrieving ledger accounts', ['error' => $e->getMessage()]);
        }
    }
}
