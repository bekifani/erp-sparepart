<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public $title;
    public $description;
    public $company_name;
    public $company_phone;
    public $company_email;

    public function __construct($title, $description, $company_name, $company_phone, $company_email)
    {
        $this->title = $title;
        $this->description = $description;
        $this->company_name = $company_name;
        $this->company_phone = $company_phone;
        $this->company_email = $company_email;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->view('emails.message')
                    ->subject('Email From '. $this->company_name);
    }
}
