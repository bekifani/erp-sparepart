<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage; 
use App\Broadcasting\SmsChannel;

class UserNotification extends Notification
{
    use Queueable;
    private $message;
    private $phoneNumber;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function via(object $notifiable): array
    {
        // return ['broadcast', 'database', 'sms'];
        return ['broadcast', 'database', 'sms'];
    }

    public function toSms($notifiable)
    {
        return [
            'message' => $this->message,
            'phone_number' => $notifiable->phone,  // Pass the phone number to the channel
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('Notification From Abel Import Export.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    public function broadcastAs()
    {
        return 'user.notification'; // Customize your event name here
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->message,
            'user_id' => $notifiable->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->message,
        ]);
    }
}
