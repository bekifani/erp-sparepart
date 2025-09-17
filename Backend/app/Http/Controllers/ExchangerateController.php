<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Exchangerate;
use App\Models\Currency;
use App\Services\CurrencyConversionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class ExchangerateController extends BaseController
{
    protected $searchableColumns = ['date', 'currency', 'rate', 'base_currency'];
    
    // Get supported currency codes dynamically from database
    protected function getSupportedCurrencies()
    {
        return Currency::getActiveCurrencyCodes();
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
        $query = Exchangerate::orderBy($sortBy, $sortDir);
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
        $exchangerate = $query->paginate($perPage); 
        $data = [
            "data" => $exchangerate->toArray(), 
            'current_page' => $exchangerate->currentPage(),
            'total_pages' => $exchangerate->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_exchangerates(){
        $data = Exchangerate::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Exchangerate::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for exchangerate');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
                "date" => "required|date",
                "currency" => "required|string|size:3|in:" . implode(',', $this->getSupportedCurrencies()),
                "rate" => "required|numeric|min:0|regex:/^\d+(\.\d{1,6})?$/",
                "base_currency" => "required|string|size:3|in:RMB",
            ];

            // Add unique validation for date + currency combination
            $validationRules['date'] .= '|unique:exchangerates,date,NULL,id,currency,' . $request->currency;

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            // Set default base currency to RMB
            $validated['base_currency'] = 'RMB';

            $exchangerate = Exchangerate::create($validated);
            
            // Clear cache for this currency
            CurrencyConversionService::clearCache($validated['currency']);
            
            return $this->sendResponse($exchangerate, "Exchange rate created successfully");
        } catch (\Exception $e) {
            Log::error('Exchange rate creation failed: ' . $e->getMessage());
            return $this->sendError("Failed to create exchange rate", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $exchangerate = Exchangerate::findOrFail($id);
        return $this->sendResponse($exchangerate, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $exchangerate = Exchangerate::findOrFail($id);
            $validationRules = [
                "date" => "required|date",
                "currency" => "required|string|size:3|in:" . implode(',', $this->getSupportedCurrencies()),
                "rate" => "required|numeric|min:0|regex:/^\d+(\.\d{1,6})?$/",
                "base_currency" => "required|string|size:3|in:RMB",
            ];

            // Add unique validation for date + currency combination (excluding current record)
            $validationRules['date'] .= '|unique:exchangerates,date,' . $id . ',id,currency,' . $request->currency;

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            // Ensure base currency is RMB
            $validated['base_currency'] = 'RMB';

            $exchangerate->update($validated);
            
            // Clear cache for this currency
            CurrencyConversionService::clearCache($validated['currency']);
            
            return $this->sendResponse($exchangerate, "Exchange rate updated successfully");
        } catch (\Exception $e) {
            Log::error('Exchange rate update failed: ' . $e->getMessage());
            return $this->sendError("Failed to update exchange rate", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $exchangerate = Exchangerate::findOrFail($id);
            $currency = $exchangerate->currency;
            $exchangerate->delete();
            
            // Clear cache for this currency
            CurrencyConversionService::clearCache($currency);
            
            return $this->sendResponse(1, "Exchange rate deleted successfully");
        } catch (\Exception $e) {
            Log::error('Exchange rate deletion failed: ' . $e->getMessage());
            return $this->sendError("Failed to delete exchange rate", ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get available currencies with their latest rates
     */
    public function getAvailableCurrencies()
    {
        try {
            $currencies = CurrencyConversionService::getAvailableCurrencies();
            return $this->sendResponse($currencies, "Available currencies retrieved successfully");
        } catch (\Exception $e) {
            Log::error('Failed to get available currencies: ' . $e->getMessage());
            return $this->sendError("Failed to get available currencies", ['error' => $e->getMessage()]);
        }
    }

    /**
     * Convert amount from RMB to target currency
     */
    public function convertCurrency(Request $request)
    {
        try {
            $validationRules = [
                'amount' => 'required|numeric|min:0',
                'target_currency' => 'required|string|size:3|in:' . implode(',', $this->getSupportedCurrencies()),
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }

            $amount = $request->amount;
            $targetCurrency = $request->target_currency;

            $convertedAmount = CurrencyConversionService::convertFromRMB($amount, $targetCurrency);
            
            if ($convertedAmount === null) {
                return $this->sendError("Exchange rate not found for currency: {$targetCurrency}");
            }

            $rate = CurrencyConversionService::getLatestRate($targetCurrency);

            return $this->sendResponse([
                'original_amount' => $amount,
                'original_currency' => 'RMB',
                'converted_amount' => $convertedAmount,
                'target_currency' => $targetCurrency,
                'exchange_rate' => $rate->rate,
                'rate_date' => $rate->date,
                'formatted_amount' => CurrencyConversionService::formatPrice($convertedAmount, $targetCurrency)
            ], "Currency conversion completed successfully");
        } catch (\Exception $e) {
            Log::error('Currency conversion failed: ' . $e->getMessage());
            return $this->sendError("Currency conversion failed", ['error' => $e->getMessage()]);
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
