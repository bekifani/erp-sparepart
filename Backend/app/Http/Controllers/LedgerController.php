<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LedgerAccount;
use App\Models\Balance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class LedgerController extends Controller
{
    /**
     * Display a listing of ledger accounts
     */
    public function index(Request $request)
    {
        try {
            $query = LedgerAccount::with(['parent', 'children'])
                ->orderBy('code')
                ->orderBy('name');

            // Apply filters
            if ($request->has('ledger_type') && $request->ledger_type !== '') {
                $query->where('ledger_type', $request->ledger_type);
            }

            if ($request->has('account_class') && $request->account_class !== '') {
                $query->where('account_class', $request->account_class);
            }

            if ($request->has('is_active') && $request->is_active !== '') {
                $query->where('is_active', $request->is_active === 'true');
            }

            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%")
                      ->orWhere('name_ru', 'like', "%{$search}%")
                      ->orWhere('name_az', 'like', "%{$search}%")
                      ->orWhere('name_ch', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $ledgerAccounts = $query->paginate($perPage);

            return $this->sendResponse($ledgerAccounts, 'Ledger accounts retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving ledger accounts: ' . $e->getMessage());
            return $this->sendError('Error retrieving ledger accounts', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created ledger account
     */
    public function store(Request $request)
    {
        try {
            $validationRules = [
                'code' => 'required|string|max:20|unique:ledger_accounts,code',
                'name' => 'required|string|max:255',
                'name_ru' => 'nullable|string|max:255',
                'name_az' => 'nullable|string|max:255',
                'name_ch' => 'nullable|string|max:255',
                'ledger_type' => 'required|in:general,subsidiary',
                'account_class' => 'required|in:asset,liability,equity,revenue,expense',
                'is_contra' => 'nullable|boolean',
                'parent_id' => 'nullable|exists:ledger_accounts,id',
                'is_active' => 'nullable|boolean',
                'description' => 'nullable|string|max:1000'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();
            
            // Set defaults
            $validated['is_contra'] = $validated['is_contra'] ?? false;
            $validated['is_active'] = $validated['is_active'] ?? true;

            $ledgerAccount = LedgerAccount::create($validated);

            return $this->sendResponse($ledgerAccount, 'Ledger account created successfully');
        } catch (Exception $e) {
            Log::error('Error creating ledger account: ' . $e->getMessage());
            return $this->sendError('Error creating ledger account', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified ledger account
     */
    public function show($id)
    {
        try {
            $ledgerAccount = LedgerAccount::with(['parent', 'children', 'balances'])->find($id);

            if (!$ledgerAccount) {
                return $this->sendError('Ledger account not found');
            }

            return $this->sendResponse($ledgerAccount, 'Ledger account retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving ledger account: ' . $e->getMessage());
            return $this->sendError('Error retrieving ledger account', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified ledger account
     */
    public function update(Request $request, $id)
    {
        try {
            $ledgerAccount = LedgerAccount::find($id);
            if (!$ledgerAccount) {
                return $this->sendError('Ledger account not found');
            }

            $validationRules = [
                'code' => 'required|string|max:20|unique:ledger_accounts,code,' . $id,
                'name' => 'required|string|max:255',
                'name_ru' => 'nullable|string|max:255',
                'name_az' => 'nullable|string|max:255',
                'name_ch' => 'nullable|string|max:255',
                'ledger_type' => 'required|in:general,subsidiary',
                'account_class' => 'required|in:asset,liability,equity,revenue,expense',
                'is_contra' => 'nullable|boolean',
                'parent_id' => 'nullable|exists:ledger_accounts,id',
                'is_active' => 'nullable|boolean',
                'description' => 'nullable|string|max:1000'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();
            $ledgerAccount->update($validated);

            return $this->sendResponse($ledgerAccount, 'Ledger account updated successfully');
        } catch (Exception $e) {
            Log::error('Error updating ledger account: ' . $e->getMessage());
            return $this->sendError('Error updating ledger account', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified ledger account
     */
    public function destroy($id)
    {
        try {
            $ledgerAccount = LedgerAccount::find($id);
            if (!$ledgerAccount) {
                return $this->sendError('Ledger account not found');
            }

            // Check if account has children
            if ($ledgerAccount->children()->count() > 0) {
                return $this->sendError('Cannot delete ledger account with child accounts');
            }

            // Check if account has journal lines
            if ($ledgerAccount->journalLines()->count() > 0) {
                return $this->sendError('Cannot delete ledger account with existing transactions');
            }

            $ledgerAccount->delete();

            return $this->sendResponse([], 'Ledger account deleted successfully');
        } catch (Exception $e) {
            Log::error('Error deleting ledger account: ' . $e->getMessage());
            return $this->sendError('Error deleting ledger account', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get chart of accounts (hierarchical structure)
     */
    public function chartOfAccounts()
    {
        try {
            $accounts = LedgerAccount::with(['children' => function ($query) {
                $query->orderBy('code');
            }])
            ->whereNull('parent_id')
            ->orderBy('code')
            ->get();

            return $this->sendResponse($accounts, 'Chart of accounts retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving chart of accounts: ' . $e->getMessage());
            return $this->sendError('Error retrieving chart of accounts', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get account balances
     */
    public function balances(Request $request)
    {
        try {
            $query = Balance::with(['ledgerAccount', 'accountType'])
                ->orderBy('ledger_account_id');

            // Apply filters
            if ($request->has('ledger_account_id') && $request->ledger_account_id !== '') {
                $query->where('ledger_account_id', $request->ledger_account_id);
            }

            if ($request->has('account_type_id') && $request->account_type_id !== '') {
                $query->where('account_type_id', $request->account_type_id);
            }

            $balances = $query->get();

            return $this->sendResponse($balances, 'Account balances retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving account balances: ' . $e->getMessage());
            return $this->sendError('Error retrieving account balances', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Search ledger accounts
     */
    public function search(Request $request)
    {
        try {
            $search = $request->get('search', '');
            $limit = $request->get('limit', 10);

            $query = LedgerAccount::where('is_active', true);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%")
                      ->orWhere('name_ru', 'like', "%{$search}%")
                      ->orWhere('name_az', 'like', "%{$search}%")
                      ->orWhere('name_ch', 'like', "%{$search}%");
                });
            }

            $accounts = $query->orderBy('code')
                ->limit($limit)
                ->get(['id', 'code', 'name', 'name_ru', 'name_az', 'name_ch', 'account_class']);

            return $this->sendResponse($accounts, 'Ledger accounts found');
        } catch (Exception $e) {
            Log::error('Error searching ledger accounts: ' . $e->getMessage());
            return $this->sendError('Error searching ledger accounts', ['error' => $e->getMessage()]);
        }
    }
}
