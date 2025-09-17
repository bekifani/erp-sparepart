<?php

namespace App\Services;

use App\Models\Exchangerate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CurrencyConversionService
{
    /**
     * Convert amount from RMB to target currency
     *
     * @param float $amount Amount in RMB
     * @param string $targetCurrency Target currency code (USD, EUR, etc.)
     * @return float|null Converted amount or null if rate not found
     */
    public static function convertFromRMB($amount, $targetCurrency)
    {
        if ($targetCurrency === 'RMB') {
            return $amount;
        }

        $rate = self::getLatestRate($targetCurrency);
        if (!$rate) {
            Log::warning("Exchange rate not found for currency: {$targetCurrency}");
            return null;
        }

        return round($amount * $rate->rate, 2);
    }

    /**
     * Convert amount from target currency to RMB
     *
     * @param float $amount Amount in target currency
     * @param string $sourceCurrency Source currency code
     * @return float|null Converted amount or null if rate not found
     */
    public static function convertToRMB($amount, $sourceCurrency)
    {
        if ($sourceCurrency === 'RMB') {
            return $amount;
        }

        $rate = self::getLatestRate($sourceCurrency);
        if (!$rate) {
            Log::warning("Exchange rate not found for currency: {$sourceCurrency}");
            return null;
        }

        return round($amount / $rate->rate, 2);
    }

    /**
     * Get the latest exchange rate for a currency (cached for 1 hour)
     *
     * @param string $currency Currency code
     * @return \App\Models\Exchangerate|null
     */
    public static function getLatestRate($currency)
    {
        $cacheKey = "exchange_rate_{$currency}";
        
        return Cache::remember($cacheKey, 3600, function () use ($currency) {
            return Exchangerate::where('currency', $currency)
                              ->where('base_currency', 'RMB')
                              ->orderBy('date', 'desc')
                              ->first();
        });
    }

    /**
     * Get all available currencies with their latest rates
     *
     * @return array
     */
    public static function getAvailableCurrencies()
    {
        return Cache::remember('available_currencies', 3600, function () {
            return Exchangerate::select('currency', 'rate', 'date')
                              ->where('base_currency', 'RMB')
                              ->whereIn('id', function ($query) {
                                  $query->selectRaw('MAX(id)')
                                        ->from('exchangerates')
                                        ->where('base_currency', 'RMB')
                                        ->groupBy('currency');
                              })
                              ->orderBy('currency')
                              ->get()
                              ->keyBy('currency');
        });
    }

    /**
     * Convert prices in an array from RMB to target currency
     *
     * @param array $items Array of items with price fields
     * @param string $targetCurrency Target currency
     * @param string $priceField Field name containing the price (default: 'price')
     * @return array Items with converted prices
     */
    public static function convertPricesInArray($items, $targetCurrency, $priceField = 'price')
    {
        if ($targetCurrency === 'RMB') {
            return $items;
        }

        $rate = self::getLatestRate($targetCurrency);
        if (!$rate) {
            return $items;
        }

        return array_map(function ($item) use ($rate, $priceField, $targetCurrency) {
            if (isset($item[$priceField])) {
                $item[$priceField] = round($item[$priceField] * $rate->rate, 2);
                $item['converted_currency'] = $targetCurrency;
                $item['conversion_rate'] = $rate->rate;
                $item['conversion_date'] = $rate->date;
            }
            return $item;
        }, $items);
    }

    /**
     * Format price with currency symbol
     *
     * @param float $amount
     * @param string $currency
     * @return string
     */
    public static function formatPrice($amount, $currency)
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'JPY' => '¥',
            'RMB' => '¥',
            'CNY' => '¥',
            'AUD' => 'A$',
            'CAD' => 'C$',
            'CHF' => 'CHF',
            'SEK' => 'kr',
            'NZD' => 'NZ$'
        ];

        $symbol = $symbols[$currency] ?? $currency;
        
        // Format based on currency
        if (in_array($currency, ['JPY', 'KRW'])) {
            // No decimal places for these currencies
            return $symbol . number_format($amount, 0);
        }
        
        return $symbol . number_format($amount, 2);
    }

    /**
     * Clear exchange rate cache
     *
     * @param string|null $currency Specific currency to clear, or null for all
     */
    public static function clearCache($currency = null)
    {
        if ($currency) {
            Cache::forget("exchange_rate_{$currency}");
        } else {
            Cache::forget('available_currencies');
            // Clear all currency-specific caches
            $currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
            foreach ($currencies as $curr) {
                Cache::forget("exchange_rate_{$curr}");
            }
        }
    }
}
