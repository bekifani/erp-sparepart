<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Sparepart ERP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .token-box {
            background-color: #f8f9fa;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .token {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
        }
        .login-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .login-button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Sparepart ERP</div>
            <h1>Password Reset Request</h1>
        </div>

        <h2>Hello,</h2>
        
        <p>You have been registered to <strong>Sparepart ERP</strong> and we have received a request to reset your password.</p>
        
        <p>Please use the following verification code to reset your password:</p>
        
        <div class="token-box">
            <div class="token">{{ $token }}</div>
        </div>
        
        <div class="warning">
            <strong>Important:</strong> This verification code will expire in 10 minutes for security reasons. Please use it promptly.
        </div>
        
        <p>To complete the password reset process:</p>
        <ol>
            <li>Click the login button below or visit the login page</li>
            <li>Enter your email address</li>
            <li>Enter the verification code above</li>
            <li>Create your new password</li>
        </ol>
        
        <div style="text-align: center;">
            <a href="{{ config('services.frontend.url') }}/login" class="login-button">Go to Login Page</a>
        </div>
        
        <p><strong>Login URL:</strong> <a href="{{ config('services.frontend.url') }}/login">{{ config('services.frontend.url') }}/login</a></p>
        
        <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
        
        <p>For security reasons, please do not share this verification code with anyone.</p>
        
        <div class="footer">
            <p>This email was sent from Sparepart ERP System</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; {{ date('Y') }} Sparepart ERP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
