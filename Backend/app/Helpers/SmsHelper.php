<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class SmsHelper
{
    protected static $apiUrl;
    protected static $authToken;
    protected static $postURL;

    public static function init()
    {
        self::$apiUrl = env('AFROMESSAGE_API_URL');
        self::$authToken =env('AFROMESSAGE_AUTH_TOKEN');
        self::$postURL = env('AFROMESSAGE_BULK_API_URL');
    }

    public static function sendSms($to, $message, $from = null)
    {
        self::init();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . self::$authToken,
        ])->get(self::$apiUrl, [
            'from' => $from ?? '', // Default empty if not provided
            'sender' => '',    // Default sender ID
            'to' => $to,
            'message' => $message,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception($response->body());
    }

    public static function sendBulkSms($to, $message, $from = null)
    {
        self::init();
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . self::$authToken,
        ])->post(self::$postURL, [
            'from' => $from ?? '', // Default empty if not provided
            'sender' => '',    // Default sender ID
            'to' => $to,
            'message' => $message,
        ]);
        dd($response);
        if ($response->successful()) {
            return $response->json();
        }
        throw new \Exception($response->body());
    }
}
