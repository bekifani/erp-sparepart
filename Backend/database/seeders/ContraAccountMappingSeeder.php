<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContraAccountMapping;
use App\Models\Accounttype;
use App\Models\Paymentnote;
use App\Models\LedgerAccount;

class ContraAccountMappingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get ledger accounts for mapping
        $cashAccount = LedgerAccount::where('code', '1110')->first(); // Cash
        $bankAccount = LedgerAccount::where('code', '1120')->first(); // Bank Account
        $accountsReceivable = LedgerAccount::where('code', '1130')->first(); // Accounts Receivable
        $accountsPayable = LedgerAccount::where('code', '2110')->first(); // Accounts Payable

        // Get account types
        $incomeAccountTypes = Accounttype::where('category', 'income')->get();
        $expenseAccountTypes = Accounttype::where('category', 'expense')->get();

        // Get payment notes
        $paymentNotes = Paymentnote::all();

        // Create default mappings for income account types
        foreach ($incomeAccountTypes as $accountType) {
            // Default mapping: Income -> Cash (for cash payments)
            ContraAccountMapping::create([
                'account_type_id' => $accountType->id,
                'payment_note_id' => null, // Default for all payment notes
                'transaction_type' => 'payment',
                'contra_ledger_account_id' => $cashAccount->id,
                'is_active' => true
            ]);

            // Specific mappings for different payment methods
            foreach ($paymentNotes as $paymentNote) {
                $contraAccountId = $cashAccount->id; // Default to cash

                // Map specific payment methods to appropriate accounts
                $noteText = strtolower($paymentNote->note);
                
                if (strpos($noteText, 'bank') !== false || 
                    strpos($noteText, 'transfer') !== false || 
                    strpos($noteText, 'card') !== false) {
                    $contraAccountId = $bankAccount->id;
                } elseif (strpos($noteText, 'credit') !== false || 
                         strpos($noteText, 'receivable') !== false) {
                    $contraAccountId = $accountsReceivable->id;
                }

                ContraAccountMapping::create([
                    'account_type_id' => $accountType->id,
                    'payment_note_id' => $paymentNote->id,
                    'transaction_type' => 'payment',
                    'contra_ledger_account_id' => $contraAccountId,
                    'is_active' => true
                ]);
            }
        }

        // Create default mappings for expense account types
        foreach ($expenseAccountTypes as $accountType) {
            // Default mapping: Expense -> Cash (for cash payments)
            ContraAccountMapping::create([
                'account_type_id' => $accountType->id,
                'payment_note_id' => null, // Default for all payment notes
                'transaction_type' => 'payment',
                'contra_ledger_account_id' => $cashAccount->id,
                'is_active' => true
            ]);

            // Specific mappings for different payment methods
            foreach ($paymentNotes as $paymentNote) {
                $contraAccountId = $cashAccount->id; // Default to cash

                // Map specific payment methods to appropriate accounts
                $noteText = strtolower($paymentNote->note);
                
                if (strpos($noteText, 'bank') !== false || 
                    strpos($noteText, 'transfer') !== false || 
                    strpos($noteText, 'card') !== false) {
                    $contraAccountId = $bankAccount->id;
                } elseif (strpos($noteText, 'credit') !== false || 
                         strpos($noteText, 'payable') !== false) {
                    $contraAccountId = $accountsPayable->id;
                }

                ContraAccountMapping::create([
                    'account_type_id' => $accountType->id,
                    'payment_note_id' => $paymentNote->id,
                    'transaction_type' => 'payment',
                    'contra_ledger_account_id' => $contraAccountId,
                    'is_active' => true
                ]);
            }
        }

        // Create mappings for other transaction types
        
        // Purchase transactions
        foreach ($expenseAccountTypes as $accountType) {
            ContraAccountMapping::create([
                'account_type_id' => $accountType->id,
                'payment_note_id' => null,
                'transaction_type' => 'purchase',
                'contra_ledger_account_id' => $accountsPayable->id,
                'is_active' => true
            ]);
        }

        // Sale transactions
        foreach ($incomeAccountTypes as $accountType) {
            ContraAccountMapping::create([
                'account_type_id' => $accountType->id,
                'payment_note_id' => null,
                'transaction_type' => 'sale',
                'contra_ledger_account_id' => $accountsReceivable->id,
                'is_active' => true
            ]);
        }
    }
}
