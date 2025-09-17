<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends BaseController
{
    protected $searchableColumns = [
        'trans_number', 'customer_name', 'supplier_name', 'invoice_number', 
        'payment_status', 'account_type_name', 'payment_note_name'
    ];

    public function index(Request $request)
    {
        try {
            $sortBy = 'transaction_date';
            $sortDir = 'desc';
            if ($request['sort']) {
                $sortBy = $request['sort'][0]['field'];
                $sortDir = $request['sort'][0]['dir'];
            }
            $perPage = $request->query('size', 10);
            $filters = $request['filter'];

            // Union all account tables to create unified transaction view
            $customerAccounts = DB::table('customeraccounts as ca')
                ->leftJoin('users as u', 'ca.user_id', '=', 'u.id')
                ->leftJoin('customers as c', 'ca.customer_id', '=', 'c.id')
                ->leftJoin('accounttypes as at', 'ca.account_type_id', '=', 'at.id')
                ->leftJoin('paymentnotes as pn', 'ca.payment_note_id', '=', 'pn.id')
                ->select(
                    'ca.id',
                    'ca.transaction_date',
                    'ca.trans_number',
                    DB::raw("'customer' as account_source"),
                    'u.name as user_name',
                    'c.name_surname as customer_name',
                    DB::raw('NULL as supplier_name'),
                    'ca.amount',
                    'ca.invoice_number',
                    'ca.payment_status',
                    'at.name as account_type_name',
                    'pn.note as payment_note_name',
                    'ca.additional_note',
                    'ca.picture_url',
                    'ca.balance as account_balance',
                    'ca.created_at',
                    'ca.updated_at'
                );

            $supplierAccounts = DB::table('supplieraccounts as sa')
                ->leftJoin('users as u', 'sa.user_id', '=', 'u.id')
                ->leftJoin('suppliers as s', 'sa.supplier_id', '=', 's.id')
                ->leftJoin('accounttypes as at', 'sa.account_type_id', '=', 'at.id')
                ->leftJoin('paymentnotes as pn', 'sa.payment_note_id', '=', 'pn.id')
                ->select(
                    'sa.id',
                    'sa.transaction_date',
                    'sa.trans_number',
                    DB::raw("'supplier' as account_source"),
                    'u.name as user_name',
                    DB::raw('NULL as customer_name'),
                    's.company_name as supplier_name',
                    'sa.amount',
                    'sa.invoice_number',
                    'sa.payment_status',
                    'at.name as account_type_name',
                    'pn.note as payment_note_name',
                    'sa.additional_note',
                    'sa.picture_url',
                    'sa.balance as account_balance',
                    'sa.created_at',
                    'sa.updated_at'
                );

            $companyAccounts = DB::table('companyaccounts as coa')
                ->leftJoin('users as u', 'coa.user_id', '=', 'u.id')
                ->leftJoin('accounttypes as at', 'coa.account_type_id', '=', 'at.id')
                ->leftJoin('paymentnotes as pn', 'coa.payment_note_id', '=', 'pn.id')
                ->select(
                    'coa.id',
                    'coa.transaction_date',
                    'coa.trans_number',
                    DB::raw("'company' as account_source"),
                    'u.name as user_name',
                    DB::raw('NULL as customer_name'),
                    DB::raw('NULL as supplier_name'),
                    'coa.amount',
                    'coa.invoice_number',
                    'coa.payment_status',
                    'at.name as account_type_name',
                    'pn.note as payment_note_name',
                    'coa.additional_note',
                    'coa.picture_url',
                    'coa.balance as account_balance',
                    'coa.created_at',
                    'coa.updated_at'
                );

            $warehouseAccounts = DB::table('warehouseaccounts as wa')
                ->leftJoin('users as u', 'wa.user_id', '=', 'u.id')
                ->leftJoin('customers as c', 'wa.customer_id', '=', 'c.id')
                ->leftJoin('suppliers as s', 'wa.supplier_id', '=', 's.id')
                ->leftJoin('accounttypes as at', 'wa.account_type_id', '=', 'at.id')
                ->leftJoin('paymentnotes as pn', 'wa.payment_note_id', '=', 'pn.id')
                ->select(
                    'wa.id',
                    'wa.transaction_date',
                    'wa.trans_number',
                    DB::raw("'warehouse' as account_source"),
                    'u.name as user_name',
                    'c.name_surname as customer_name',
                    's.company_name as supplier_name',
                    'wa.amount',
                    'wa.invoice_number',
                    'wa.payment_status',
                    'at.name as account_type_name',
                    'pn.note as payment_note_name',
                    'wa.additional_note',
                    'wa.picture_url',
                    'wa.balance as account_balance',
                    'wa.created_at',
                    'wa.updated_at'
                );

            // Union all queries
            $query = $customerAccounts
                ->union($supplierAccounts)
                ->union($companyAccounts)
                ->union($warehouseAccounts);

            // Wrap in subquery for ordering and filtering
            $finalQuery = DB::table(DB::raw("({$query->toSql()}) as transactions"))
                ->mergeBindings($query);

            // Calculate running balance
            $runningBalance = 0;
            $transactions = $finalQuery->orderBy($sortBy, $sortDir)->get();
            
            foreach ($transactions as $transaction) {
                if ($transaction->payment_status === 'income') {
                    $runningBalance += $transaction->amount;
                } else {
                    $runningBalance -= $transaction->amount;
                }
                $transaction->company_running_balance = $runningBalance;
            }

            // Apply filters if provided
            if ($filters) {
                $transactions = $transactions->filter(function ($transaction) use ($filters) {
                    foreach ($filters as $filter) {
                        $field = $filter['field'];
                        $operator = $filter['type'];
                        $searchTerm = $filter['value'];
                        
                        $value = $transaction->$field ?? '';
                        
                        if ($operator == 'like') {
                            if (stripos($value, $searchTerm) === false) {
                                return false;
                            }
                        } elseif ($operator == '=') {
                            if ($value != $searchTerm) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }

            // Paginate results
            $total = $transactions->count();
            $currentPage = $request->query('page', 1);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedTransactions = $transactions->slice($offset, $perPage)->values();

            $data = [
                "data" => [
                    "data" => $paginatedTransactions->toArray(),
                    "current_page" => $currentPage,
                    "last_page" => ceil($total / $perPage),
                    "per_page" => $perPage,
                    "total" => $total
                ],
                'current_page' => $currentPage,
                'total_pages' => ceil($total / $perPage),
                'per_page' => $perPage
            ];

            return response()->json($data);

        } catch (\Exception $e) {
            Log::error('Transaction index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch transactions'], 500);
        }
    }

    /**
     * Get transaction statistics for dashboard
     */
    public function getStatistics()
    {
        try {
            $customerIncome = DB::table('customeraccounts')->where('payment_status', 'income')->sum('amount');
            $customerExpense = DB::table('customeraccounts')->where('payment_status', 'expense')->sum('amount');
            
            $supplierIncome = DB::table('supplieraccounts')->where('payment_status', 'income')->sum('amount');
            $supplierExpense = DB::table('supplieraccounts')->where('payment_status', 'expense')->sum('amount');
            
            $companyIncome = DB::table('companyaccounts')->where('payment_status', 'income')->sum('amount');
            $companyExpense = DB::table('companyaccounts')->where('payment_status', 'expense')->sum('amount');
            
            $warehouseIncome = DB::table('warehouseaccounts')->where('payment_status', 'income')->sum('amount');
            $warehouseExpense = DB::table('warehouseaccounts')->where('payment_status', 'expense')->sum('amount');

            $totalIncome = $customerIncome + $supplierIncome + $companyIncome + $warehouseIncome;
            $totalExpense = $customerExpense + $supplierExpense + $companyExpense + $warehouseExpense;
            $netBalance = $totalIncome - $totalExpense;

            $totalTransactions = DB::table('customeraccounts')->count() +
                               DB::table('supplieraccounts')->count() +
                               DB::table('companyaccounts')->count() +
                               DB::table('warehouseaccounts')->count();

            return response()->json([
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'net_balance' => $netBalance,
                'total_transactions' => $totalTransactions
            ]);

        } catch (\Exception $e) {
            Log::error('Transaction statistics error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch statistics'], 500);
        }
    }
}
