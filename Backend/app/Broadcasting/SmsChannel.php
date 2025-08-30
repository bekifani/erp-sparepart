<?php

namespace App\Broadcasting;

use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use App\Helpers\SmsHelper;

class SmsChannel
{
    public function send($user, $notification)
    {
        $phoneNumber = $user->phone;
        $message = $notification->toSms($user)['message'];
        SmsHelper::sendSms($user->phone, $message);
    }
}

