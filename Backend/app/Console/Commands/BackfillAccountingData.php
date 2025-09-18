<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customeraccount;
use App\Models\Supplieraccount;
use App\Models\Companyaccount;
use App\Models\Warehouseaccount;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\LedgerAccount;
use App\Models\Balance;
use App\Services\JournalService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BackfillAccountingData extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'accounting:backfill {--dry-run : Run without making changes} {--batch-size=100 : Number of records to process per batch}';

    /**
     * The console command description.
     */
    protected $description = 'Backfill existing account data into the new journal system';

    protected $journalService;

    public function __construct(JournalService $journalService)
    {
        parent::__construct();
        $this->journalService = $journalService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $batchSize = $this->option('batch-size');

        $this->info('Starting accounting data backfill...');
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be made');
        }

        // Get default ledger accounts
        $cashAccount = LedgerAccount::where('code', '1110')->first();
        $salesRevenueAccount = LedgerAccount::where('code', '4100')->first();
        $operatingExpenseAccount = LedgerAccount::where('code', '5200')->first();

        if (!$cashAccount || !$salesRevenueAccount || !$operatingExpenseAccount) {
            $this->error('Required ledger accounts not found. Please run LedgerAccountSeeder first.');
            return 1;
        }

        $totalProcessed = 0;
        $totalErrors = 0;

        // Process Customer Accounts
        $this->info('Processing Customer Accounts...');
        $customerCount = Customeraccount::count();
        $this->output->progressStart($customerCount);

        Customeraccount::with(['accountType', 'paymentNote', 'user'])
            ->chunk($batchSize, function ($customerAccounts) use ($dryRun, &$totalProcessed, &$totalErrors, $cashAccount, $salesRevenueAccount) {
                foreach ($customerAccounts as $account) {
                    try {
                        if (!$dryRun) {
                            $this->createJournalEntryFromCustomerAccount($account, $cashAccount, $salesRevenueAccount);
                        }
                        $totalProcessed++;
                        $this->output->progressAdvance();
                    } catch (\Exception $e) {
                        $totalErrors++;
                        Log::error("Error processing customer account {$account->id}: " . $e->getMessage());
                        $this->output->progressAdvance();
                    }
                }
            });

        $this->output->progressFinish();
        $this->info("Customer Accounts: {$totalProcessed} processed, {$totalErrors} errors");

        // Process Supplier Accounts
        $this->info('Processing Supplier Accounts...');
        $supplierCount = Supplieraccount::count();
        $this->output->progressStart($supplierCount);

        Supplieraccount::with(['accountType', 'paymentNote', 'user'])
            ->chunk($batchSize, function ($supplierAccounts) use ($dryRun, &$totalProcessed, &$totalErrors, $cashAccount, $operatingExpenseAccount) {
                foreach ($supplierAccounts as $account) {
                    try {
                        if (!$dryRun) {
                            $this->createJournalEntryFromSupplierAccount($account, $cashAccount, $operatingExpenseAccount);
                        }
                        $totalProcessed++;
                        $this->output->progressAdvance();
                    } catch (\Exception $e) {
                        $totalErrors++;
                        Log::error("Error processing supplier account {$account->id}: " . $e->getMessage());
                        $this->output->progressAdvance();
                    }
                }
            });

        $this->output->progressFinish();
        $this->info("Supplier Accounts: {$totalProcessed} processed, {$totalErrors} errors");

        // Process Company Accounts
        $this->info('Processing Company Accounts...');
        $companyCount = Companyaccount::count();
        $this->output->progressStart($companyCount);

        Companyaccount::with(['accountType', 'paymentNote', 'user'])
            ->chunk($batchSize, function ($companyAccounts) use ($dryRun, &$totalProcessed, &$totalErrors, $cashAccount, $operatingExpenseAccount) {
                foreach ($companyAccounts as $account) {
                    try {
                        if (!$dryRun) {
                            $this->createJournalEntryFromCompanyAccount($account, $cashAccount, $operatingExpenseAccount);
                        }
                        $totalProcessed++;
                        $this->output->progressAdvance();
                    } catch (\Exception $e) {
                        $totalErrors++;
                        Log::error("Error processing company account {$account->id}: " . $e->getMessage());
                        $this->output->progressAdvance();
                    }
                }
            });

        $this->output->progressFinish();
        $this->info("Company Accounts: {$totalProcessed} processed, {$totalErrors} errors");

        // Process Warehouse Accounts
        $this->info('Processing Warehouse Accounts...');
        $warehouseCount = Warehouseaccount::count();
        $this->output->progressStart($warehouseCount);

        Warehouseaccount::with(['accountType', 'paymentNote', 'user'])
            ->chunk($batchSize, function ($warehouseAccounts) use ($dryRun, &$totalProcessed, &$totalErrors, $cashAccount, $operatingExpenseAccount) {
                foreach ($warehouseAccounts as $account) {
                    try {
                        if (!$dryRun) {
                            $this->createJournalEntryFromWarehouseAccount($account, $cashAccount, $operatingExpenseAccount);
                        }
                        $totalProcessed++;
                        $this->output->progressAdvance();
                    } catch (\Exception $e) {
                        $totalErrors++;
                        Log::error("Error processing warehouse account {$account->id}: " . $e->getMessage());
                        $this->output->progressAdvance();
                    }
                }
            });

        $this->output->progressFinish();
        $this->info("Warehouse Accounts: {$totalProcessed} processed, {$totalErrors} errors");

        $this->info("Backfill completed! Total processed: {$totalProcessed}, Total errors: {$totalErrors}");

        return 0;
    }

    private function createJournalEntryFromCustomerAccount($account, $cashAccount, $salesRevenueAccount)
    {
        $entryData = [
            'date' => $account->transaction_date ?? $account->created_at->toDateString(),
            'source_table' => 'customeraccounts',
            'user_id' => $account->user_id,
            'description' => "Customer payment: {$account->trans_number}" . ($account->additional_note ? " - {$account->additional_note}" : ""),
            'status' => 'posted'
        ];

        $lines = [];

        // Determine if this is income or expense based on account type
        $isIncome = $account->accountType && $account->accountType->category === 'income';

        if ($isIncome) {
            // Income: Debit Cash, Credit Revenue
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Customer payment received'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $salesRevenueAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Sales revenue'
            ];
        } else {
            // Expense: Debit Expense, Credit Cash
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $salesRevenueAccount->id, // Use as expense account
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Customer-related expense'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Cash payment'
            ];
        }

        return $this->journalService->createJournalEntry($entryData, $lines);
    }

    private function createJournalEntryFromSupplierAccount($account, $cashAccount, $expenseAccount)
    {
        $entryData = [
            'date' => $account->transaction_date ?? $account->created_at->toDateString(),
            'source_table' => 'supplieraccounts',
            'user_id' => $account->user_id,
            'description' => "Supplier payment: {$account->trans_number}" . ($account->additional_note ? " - {$account->additional_note}" : ""),
            'status' => 'posted'
        ];

        $lines = [];

        // Determine if this is income or expense based on account type
        $isIncome = $account->accountType && $account->accountType->category === 'income';

        if ($isIncome) {
            // Income: Debit Cash, Credit Revenue
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Supplier payment received'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $expenseAccount->id, // Use as revenue account
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Supplier-related revenue'
            ];
        } else {
            // Expense: Debit Expense, Credit Cash
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $expenseAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Supplier expense'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Cash payment to supplier'
            ];
        }

        return $this->journalService->createJournalEntry($entryData, $lines);
    }

    private function createJournalEntryFromCompanyAccount($account, $cashAccount, $expenseAccount)
    {
        $entryData = [
            'date' => $account->transaction_date ?? $account->created_at->toDateString(),
            'source_table' => 'companyaccounts',
            'user_id' => $account->user_id,
            'description' => "Company transaction: {$account->trans_number}" . ($account->additional_note ? " - {$account->additional_note}" : ""),
            'status' => 'posted'
        ];

        $lines = [];

        // Determine if this is income or expense based on account type
        $isIncome = $account->accountType && $account->accountType->category === 'income';

        if ($isIncome) {
            // Income: Debit Cash, Credit Revenue
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Company income'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $expenseAccount->id, // Use as revenue account
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Company revenue'
            ];
        } else {
            // Expense: Debit Expense, Credit Cash
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $expenseAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Company expense'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Company cash payment'
            ];
        }

        return $this->journalService->createJournalEntry($entryData, $lines);
    }

    private function createJournalEntryFromWarehouseAccount($account, $cashAccount, $expenseAccount)
    {
        $entryData = [
            'date' => $account->transaction_date ?? $account->created_at->toDateString(),
            'source_table' => 'warehouseaccounts',
            'user_id' => $account->user_id,
            'description' => "Warehouse transaction: {$account->trans_number}" . ($account->additional_note ? " - {$account->additional_note}" : ""),
            'status' => 'posted'
        ];

        $lines = [];

        // Determine if this is income or expense based on account type
        $isIncome = $account->accountType && $account->accountType->category === 'income';

        if ($isIncome) {
            // Income: Debit Cash, Credit Revenue
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Warehouse income'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $expenseAccount->id, // Use as revenue account
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Warehouse revenue'
            ];
        } else {
            // Expense: Debit Expense, Credit Cash
            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $expenseAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => $account->amount,
                'credit' => 0,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'picture_url' => $account->picture_url,
                'description' => 'Warehouse expense'
            ];

            $lines[] = [
                'account_type_id' => $account->account_type_id,
                'ledger_account_id' => $cashAccount->id,
                'payment_note_id' => $account->payment_note_id,
                'debit' => 0,
                'credit' => $account->amount,
                'currency' => 'RMB',
                'invoice_number' => $account->invoice_number,
                'description' => 'Warehouse cash payment'
            ];
        }

        return $this->journalService->createJournalEntry($entryData, $lines);
    }
}
