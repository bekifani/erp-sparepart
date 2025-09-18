<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\LedgerAccount;
use App\Services\JournalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class JournalController extends Controller
{
    protected $journalService;

    public function __construct(JournalService $journalService)
    {
        $this->journalService = $journalService;
    }

    /**
     * Display a listing of journal entries
     */
    public function index(Request $request)
    {
        try {
            $query = JournalEntry::with(['journalLines.accountType', 'journalLines.ledgerAccount', 'journalLines.paymentNote', 'user'])
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from') && $request->date_from !== '') {
                $query->where('date', '>=', $request->date_from);
            }

            if ($request->has('date_to') && $request->date_to !== '') {
                $query->where('date', '<=', $request->date_to);
            }

            if ($request->has('source_table') && $request->source_table !== '') {
                $query->where('source_table', $request->source_table);
            }

            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('trans_number', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $journalEntries = $query->paginate($perPage);

            return $this->sendResponse($journalEntries, 'Journal entries retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving journal entries: ' . $e->getMessage());
            return $this->sendError('Error retrieving journal entries', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created journal entry
     */
    public function store(Request $request)
    {
        try {
            $validationRules = [
                'date' => 'required|date',
                'source_table' => 'nullable|string|max:255',
                'description' => 'required|string|max:1000',
                'status' => 'nullable|in:draft,posted',
                'lines' => 'required|array|min:2',
                'lines.*.account_type_id' => 'nullable|exists:accounttypes,id',
                'lines.*.ledger_account_id' => 'nullable|exists:ledger_accounts,id',
                'lines.*.payment_note_id' => 'nullable|exists:paymentnotes,id',
                'lines.*.debit' => 'nullable|numeric|min:0',
                'lines.*.credit' => 'nullable|numeric|min:0',
                'lines.*.currency' => 'nullable|string|max:3',
                'lines.*.exchange_rate' => 'nullable|numeric|min:0',
                'lines.*.invoice_number' => 'nullable|string|max:255',
                'lines.*.description' => 'nullable|string|max:500'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();

            // Prepare entry data
            $entryData = [
                'date' => $validated['date'],
                'source_table' => $validated['source_table'] ?? null,
                'user_id' => auth()->id(),
                'description' => $validated['description'],
                'status' => $validated['status'] ?? 'draft'
            ];

            // Validate journal entry
            $validationErrors = $this->journalService->validateJournalEntry($entryData, $validated['lines']);
            if (!empty($validationErrors)) {
                return $this->sendError('Journal entry validation failed', ['errors' => $validationErrors]);
            }

            // Create journal entry
            $journalEntry = $this->journalService->createJournalEntry($entryData, $validated['lines']);

            return $this->sendResponse($journalEntry, 'Journal entry created successfully');
        } catch (Exception $e) {
            Log::error('Error creating journal entry: ' . $e->getMessage());
            return $this->sendError('Error creating journal entry', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified journal entry
     */
    public function show($id)
    {
        try {
            $journalEntry = JournalEntry::with([
                'journalLines.accountType',
                'journalLines.ledgerAccount',
                'journalLines.paymentNote',
                'user',
                'reversedBy',
                'reversals'
            ])->find($id);

            if (!$journalEntry) {
                return $this->sendError('Journal entry not found');
            }

            return $this->sendResponse($journalEntry, 'Journal entry retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error retrieving journal entry: ' . $e->getMessage());
            return $this->sendError('Error retrieving journal entry', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified journal entry
     */
    public function update(Request $request, $id)
    {
        try {
            $journalEntry = JournalEntry::find($id);
            if (!$journalEntry) {
                return $this->sendError('Journal entry not found');
            }

            if ($journalEntry->status === 'posted') {
                return $this->sendError('Cannot update posted journal entry');
            }

            $validationRules = [
                'date' => 'required|date',
                'description' => 'required|string|max:1000',
                'lines' => 'required|array|min:2',
                'lines.*.account_type_id' => 'nullable|exists:accounttypes,id',
                'lines.*.ledger_account_id' => 'nullable|exists:ledger_accounts,id',
                'lines.*.payment_note_id' => 'nullable|exists:paymentnotes,id',
                'lines.*.debit' => 'nullable|numeric|min:0',
                'lines.*.credit' => 'nullable|numeric|min:0',
                'lines.*.currency' => 'nullable|string|max:3',
                'lines.*.exchange_rate' => 'nullable|numeric|min:0',
                'lines.*.invoice_number' => 'nullable|string|max:255',
                'lines.*.description' => 'nullable|string|max:500'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();

            // Validate journal entry
            $entryData = [
                'date' => $validated['date'],
                'description' => $validated['description']
            ];
            $validationErrors = $this->journalService->validateJournalEntry($entryData, $validated['lines']);
            if (!empty($validationErrors)) {
                return $this->sendError('Journal entry validation failed', ['errors' => $validationErrors]);
            }

            // Update entry
            $journalEntry->update($entryData);

            // Delete existing lines and create new ones
            $journalEntry->journalLines()->delete();
            foreach ($validated['lines'] as $lineData) {
                $lineData['journal_entry_id'] = $journalEntry->id;
                JournalLine::create($lineData);
            }

            $journalEntry->load('journalLines');

            return $this->sendResponse($journalEntry, 'Journal entry updated successfully');
        } catch (Exception $e) {
            Log::error('Error updating journal entry: ' . $e->getMessage());
            return $this->sendError('Error updating journal entry', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Post a journal entry
     */
    public function post($id)
    {
        try {
            $journalEntry = JournalEntry::find($id);
            if (!$journalEntry) {
                return $this->sendError('Journal entry not found');
            }

            $postedEntry = $this->journalService->postJournalEntry($journalEntry);

            return $this->sendResponse($postedEntry, 'Journal entry posted successfully');
        } catch (Exception $e) {
            Log::error('Error posting journal entry: ' . $e->getMessage());
            return $this->sendError('Error posting journal entry', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Reverse a journal entry
     */
    public function reverse(Request $request, $id)
    {
        try {
            $journalEntry = JournalEntry::find($id);
            if (!$journalEntry) {
                return $this->sendError('Journal entry not found');
            }

            $reason = $request->input('reason');
            $reversalEntry = $this->journalService->reverseJournalEntry($journalEntry, $reason);

            return $this->sendResponse($reversalEntry, 'Journal entry reversed successfully');
        } catch (Exception $e) {
            Log::error('Error reversing journal entry: ' . $e->getMessage());
            return $this->sendError('Error reversing journal entry', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Create offsetting entry
     */
    public function createOffsettingEntry(Request $request)
    {
        try {
            $validationRules = [
                'date' => 'required|date',
                'description' => 'required|string|max:1000',
                'account_type_id' => 'required|exists:accounttypes,id',
                'payment_note_id' => 'nullable|exists:paymentnotes,id',
                'amount' => 'required|numeric|min:0.01',
                'transaction_type' => 'nullable|string|max:50'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();

            $entryData = [
                'date' => $validated['date'],
                'source_table' => 'offsetting_entry',
                'user_id' => auth()->id(),
                'description' => $validated['description'],
                'status' => 'posted'
            ];

            $journalEntry = $this->journalService->createOffsettingEntry(
                $entryData,
                $validated['account_type_id'],
                $validated['payment_note_id'] ?? null,
                $validated['amount'],
                $validated['transaction_type'] ?? 'payment'
            );

            return $this->sendResponse($journalEntry, 'Offsetting entry created successfully');
        } catch (Exception $e) {
            Log::error('Error creating offsetting entry: ' . $e->getMessage());
            return $this->sendError('Error creating offsetting entry', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get running balance for an account
     */
    public function getRunningBalance(Request $request)
    {
        try {
            $validationRules = [
                'ledger_account_id' => 'required|exists:ledger_accounts,id',
                'account_type_id' => 'nullable|exists:accounttypes,id',
                'as_of_date' => 'nullable|date'
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError('Invalid Values', ['errors' => $validation->errors()]);
            }

            $validated = $validation->validated();

            $balance = $this->journalService->getRunningBalance(
                $validated['ledger_account_id'],
                $validated['account_type_id'] ?? null,
                $validated['as_of_date'] ?? null
            );

            return $this->sendResponse(['balance' => $balance], 'Running balance retrieved successfully');
        } catch (Exception $e) {
            Log::error('Error getting running balance: ' . $e->getMessage());
            return $this->sendError('Error getting running balance', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified journal entry
     */
    public function destroy($id)
    {
        try {
            $journalEntry = JournalEntry::find($id);
            if (!$journalEntry) {
                return $this->sendError('Journal entry not found');
            }

            if ($journalEntry->status === 'posted') {
                return $this->sendError('Cannot delete posted journal entry. Use reverse instead.');
            }

            // Delete journal lines first
            $journalEntry->journalLines()->delete();
            
            // Delete journal entry
            $journalEntry->delete();

            return $this->sendResponse([], 'Journal entry deleted successfully');
        } catch (Exception $e) {
            Log::error('Error deleting journal entry: ' . $e->getMessage());
            return $this->sendError('Error deleting journal entry', ['error' => $e->getMessage()]);
        }
    }
}
