<?php

namespace App\Services;

use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\LedgerAccount;
use App\Models\Balance;
use App\Models\ContraAccountMapping;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class JournalService
{
    /**
     * Create a new journal entry with lines (double-entry bookkeeping)
     */
    public function createJournalEntry(array $entryData, array $lines): JournalEntry
    {
        return DB::transaction(function () use ($entryData, $lines) {
            // Validate that debits equal credits
            $totalDebits = collect($lines)->sum('debit');
            $totalCredits = collect($lines)->sum('credit');
            
            if (abs($totalDebits - $totalCredits) > 0.01) {
                throw new Exception("Journal entry is not balanced. Debits: {$totalDebits}, Credits: {$totalCredits}");
            }

            // Generate transaction number if not provided
            if (!isset($entryData['trans_number'])) {
                $entryData['trans_number'] = $this->generateTransactionNumber();
            }

            // Create journal entry
            $journalEntry = JournalEntry::create($entryData);

            // Create journal lines and update balances
            foreach ($lines as $lineData) {
                $lineData['journal_entry_id'] = $journalEntry->id;
                $journalLine = JournalLine::create($lineData);

                // Update balances if entry is posted
                if ($journalEntry->status === 'posted') {
                    $this->updateBalance($journalLine);
                }
            }

            Log::info("Journal entry created", [
                'journal_entry_id' => $journalEntry->id,
                'trans_number' => $journalEntry->trans_number,
                'total_debits' => $totalDebits,
                'total_credits' => $totalCredits
            ]);

            return $journalEntry->load('journalLines');
        });
    }

    /**
     * Post a journal entry (make it official and update balances)
     */
    public function postJournalEntry(JournalEntry $journalEntry): JournalEntry
    {
        return DB::transaction(function () use ($journalEntry) {
            if ($journalEntry->status === 'posted') {
                throw new Exception("Journal entry is already posted");
            }

            // Update status to posted
            $journalEntry->update(['status' => 'posted']);

            // Update balances for all lines
            foreach ($journalEntry->journalLines as $line) {
                $this->updateBalance($line);
            }

            Log::info("Journal entry posted", [
                'journal_entry_id' => $journalEntry->id,
                'trans_number' => $journalEntry->trans_number
            ]);

            return $journalEntry;
        });
    }

    /**
     * Reverse a journal entry
     */
    public function reverseJournalEntry(JournalEntry $journalEntry, string $reason = null): JournalEntry
    {
        return DB::transaction(function () use ($journalEntry, $reason) {
            if ($journalEntry->status !== 'posted') {
                throw new Exception("Can only reverse posted journal entries");
            }

            // Create reversal entry
            $reversalData = [
                'trans_number' => $this->generateTransactionNumber('REV'),
                'date' => now()->toDateString(),
                'source_table' => $journalEntry->source_table,
                'user_id' => auth()->id(),
                'description' => "Reversal of {$journalEntry->trans_number}" . ($reason ? " - {$reason}" : ""),
                'status' => 'posted'
            ];

            $reversalEntry = JournalEntry::create($reversalData);

            // Create reversal lines (swap debits and credits)
            foreach ($journalEntry->journalLines as $originalLine) {
                $reversalLineData = [
                    'journal_entry_id' => $reversalEntry->id,
                    'account_type_id' => $originalLine->account_type_id,
                    'ledger_account_id' => $originalLine->ledger_account_id,
                    'payment_note_id' => $originalLine->payment_note_id,
                    'debit' => $originalLine->credit, // Swap
                    'credit' => $originalLine->debit, // Swap
                    'currency' => $originalLine->currency,
                    'exchange_rate' => $originalLine->exchange_rate,
                    'invoice_number' => $originalLine->invoice_number,
                    'description' => "Reversal: " . $originalLine->description
                ];

                $reversalLine = JournalLine::create($reversalLineData);
                $this->updateBalance($reversalLine);
            }

            // Mark original entry as reversed
            $journalEntry->update(['reversed_by' => $reversalEntry->id]);

            Log::info("Journal entry reversed", [
                'original_entry_id' => $journalEntry->id,
                'reversal_entry_id' => $reversalEntry->id,
                'reason' => $reason
            ]);

            return $reversalEntry->load('journalLines');
        });
    }

    /**
     * Create automatic offsetting entry based on contra account mappings
     */
    public function createOffsettingEntry(array $entryData, int $accountTypeId, int $paymentNoteId = null, float $amount = 0, string $transactionType = 'payment'): JournalEntry
    {
        // Find contra account mapping
        $mapping = ContraAccountMapping::findMapping($accountTypeId, $paymentNoteId, $transactionType);
        
        if (!$mapping) {
            throw new Exception("No contra account mapping found for account type {$accountTypeId}");
        }

        // Determine if this is a debit or credit to the main account
        $accountType = \App\Models\Accounttype::find($accountTypeId);
        $isIncomeAccount = $accountType && $accountType->category === 'income';

        // Create journal lines
        $lines = [];

        if ($isIncomeAccount) {
            // Income: Credit the income account, Debit the contra account (usually cash/bank)
            $lines[] = [
                'account_type_id' => $accountTypeId,
                'ledger_account_id' => null, // Will be determined by account type
                'payment_note_id' => $paymentNoteId,
                'debit' => 0,
                'credit' => $amount,
                'currency' => 'RMB',
                'description' => $entryData['description'] ?? 'Income transaction'
            ];

            $lines[] = [
                'account_type_id' => null,
                'ledger_account_id' => $mapping->contra_ledger_account_id,
                'payment_note_id' => $paymentNoteId,
                'debit' => $amount,
                'credit' => 0,
                'currency' => 'RMB',
                'description' => 'Contra entry for income'
            ];
        } else {
            // Expense: Debit the expense account, Credit the contra account (usually cash/bank)
            $lines[] = [
                'account_type_id' => $accountTypeId,
                'ledger_account_id' => null,
                'payment_note_id' => $paymentNoteId,
                'debit' => $amount,
                'credit' => 0,
                'currency' => 'RMB',
                'description' => $entryData['description'] ?? 'Expense transaction'
            ];

            $lines[] = [
                'account_type_id' => null,
                'ledger_account_id' => $mapping->contra_ledger_account_id,
                'payment_note_id' => $paymentNoteId,
                'debit' => 0,
                'credit' => $amount,
                'currency' => 'RMB',
                'description' => 'Contra entry for expense'
            ];
        }

        return $this->createJournalEntry($entryData, $lines);
    }

    /**
     * Update balance for a journal line
     */
    private function updateBalance(JournalLine $journalLine): void
    {
        if (!$journalLine->ledger_account_id) {
            return; // Skip if no ledger account assigned
        }

        // Find or create balance record
        $balance = Balance::firstOrCreate([
            'ledger_account_id' => $journalLine->ledger_account_id,
            'account_type_id' => $journalLine->account_type_id,
            'reference_id' => null // For now, we'll use null for general balances
        ], [
            'current_balance' => 0,
            'debit_total' => 0,
            'credit_total' => 0
        ]);

        // Update balance
        $balance->updateBalance($journalLine->debit, $journalLine->credit);
    }

    /**
     * Generate unique transaction number
     */
    private function generateTransactionNumber(string $prefix = 'JE'): string
    {
        $date = now()->format('Ymd');
        $sequence = JournalEntry::whereDate('created_at', now()->toDateString())->count() + 1;
        
        return "{$prefix}{$date}-" . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get running balance for an account
     */
    public function getRunningBalance(int $ledgerAccountId, int $accountTypeId = null, $asOfDate = null): float
    {
        $balance = Balance::getRunningBalance($ledgerAccountId, $accountTypeId, null, $asOfDate);
        
        return $balance ? $balance->current_balance : 0;
    }

    /**
     * Validate journal entry data
     */
    public function validateJournalEntry(array $entryData, array $lines): array
    {
        $errors = [];

        // Validate entry data
        if (empty($entryData['date'])) {
            $errors[] = 'Date is required';
        }

        if (empty($entryData['description'])) {
            $errors[] = 'Description is required';
        }

        // Validate lines
        if (empty($lines)) {
            $errors[] = 'At least one journal line is required';
        }

        $totalDebits = 0;
        $totalCredits = 0;

        foreach ($lines as $index => $line) {
            if (empty($line['debit']) && empty($line['credit'])) {
                $errors[] = "Line {$index}: Either debit or credit amount is required";
            }

            if (!empty($line['debit']) && !empty($line['credit'])) {
                $errors[] = "Line {$index}: Cannot have both debit and credit amounts";
            }

            $totalDebits += $line['debit'] ?? 0;
            $totalCredits += $line['credit'] ?? 0;
        }

        // Check if balanced
        if (abs($totalDebits - $totalCredits) > 0.01) {
            $errors[] = "Journal entry is not balanced. Debits: {$totalDebits}, Credits: {$totalCredits}";
        }

        return $errors;
    }
}
