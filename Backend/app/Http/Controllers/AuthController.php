<?php

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Models\Student;
use App\Models\Discount;
// use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;
use Carbon\Carbon; 
use Mail;
use DB;
use Hash;
use Socialite;
use Auth;
use App\Helpers\SmsHelper;
use App\Models\Salesperson;
use App\Models\Shop;
use App\Models\Warehousemanager;
use App\Models\Warehouse;
class AuthController extends BaseController
{
    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['register','login','registerEmail', 'forgot_password', 'reset_password', 'registerPhone', 'verify_email', 'check_verification']]);
    }

    public function register(Request $request)
    {        
        $validator = Validator::make($request->all(), [
            'name' => 'nullable',
            'phone' => 'nullable',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            
        ]);
        if($validator->fails()){
            return $this->sendError(_('messages.invalid_input.'), $validator->errors());
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input['email_verified_at'] = now();
        $user = User::create($input);
    
        // Send Verification email here 
        date_default_timezone_set('Africa/Addis_Ababa');
        $now = date("Y-m-d H:i:s");
        $endTime = strtotime("+10 minutes", strtotime($now));
        $expires = date("Y-m-d H:i:s", $endTime);
        $verificationToken = Crypt::encryptString($input['email'] . '~' . $now . '~' . $expires);
        // try {
        //     Mail::send('emails.activate', ['token' => $verificationToken], function($message) use($request){
        //         $message->to($request->email);
        //         $message->subject('Welcome to Afro-Train! Please activate your Account.');
        //     });
        // } catch (Exeption $e)
        // {}
        // done here
        $user = User::whereId($user->id)->first();
        $success['token'] =  $user->createToken('MyApp')->plainTextToken;
        $success['name'] =  $user->name;
        $success['user'] = $user;

        return $this->sendResponse($success, 'User register successfully.');
    }
    
    public function login(Request $request)
    {
        // dd(User::all());
        $user = User::where('email', $request->email)->orWhere('phone', $request->email)->first();
        if(!$user){
            return $this->sendError(__('messages.invalid_email'), ['error'=>__('messages.invalid_email')]);
        }
        if (! Hash::check($request->password, $user->password)) {
            return $this->sendError(__('messages.invalid_password'), ['error'=>__('messages.invalid_password')]);
        }
        else {
            if($user->employee){
                if($user->employee->is_active == 0){
                    return $this->sendError('Permission Denied');
                }
            }
            $success['token'] =  $user->createToken('token')->plainTextToken;
            $success['name'] =  $user->name;
            $success['email'] =  $user->email;
            $success['user'] =  $user;
            $success['profile'] =  $user->employee;
            $success['permissions'] = $user->getAllPermissions()->pluck('name')->toArray();
            return $this->sendResponse($success, __('messages.logged_in_successfully'));
        }
    }

    public function socialLogin($social)
    {
        return Socialite::driver($social)->redirect();
    }

    public function handleProviderCallback($social)
    {
        $userSocial = Socialite::driver($social)->user();
        $user = User::where(['email' => $userSocial->getEmail()])->first();
        if($user){
            Auth::login($user);
            $token =  $user->createToken('token')->plainTextToken;
            return redirect('/login?token='.$token);
        }else{
            return redirect('/register?name='.$userSocial->getName().'&email='. $userSocial->getEmail());
        }
    }

    public function verify_email($token)
    {
        try {
            $decrypted = Crypt::decryptString($token);
            $token = explode('~', $decrypted);
            $datetime   = date("Y-m-d H:i:s");
            $now        = strtotime($datetime);

            $user = User::where('email', $token[0])->first();

            if (strtotime($token[2]) > $now && $user->email_verified_at == "") {
                $user->email_verified_at = date('Y-m-d H:i:s');
                $user->save();
                // Auth::login($user);
                // $success['token'] =  $user->createToken('token')->plainTextToken;
                // $success['name'] =  $user->name;
                // $success['email'] =  $user->email;
                // $success['user'] =  $user;
                // $success['profile'] =  $user->profile;

                return $this->sendResponse(1, 'User Verified Succesfully.');
                
            } else {
                $response['error'] = 'Request Error';
                $response['message'] = 'Your request is invalid. please request a verification email again.';
                $statusCode = 400;
                return response()->json($response, $statusCode);
            }
        } catch (DecryptException $e) {
            $response['error'] = 'Internal Server Error';
            $response['message'] = 'Please try again.';
            $statusCode = 500;
            return response()->json($response, $statusCode);
        }
    }

    public function resend_verification_email(Request $request)
    {
        $email = Auth::user()->email;
        date_default_timezone_set('Africa/Addis_Ababa');
        $now = date("Y-m-d H:i:s");
        $endTime = strtotime("+10 minutes", strtotime($now));
        $expires = date("Y-m-d H:i:s", $endTime);
        $verificationToken = Crypt::encryptString($email . '~' . $now . '~' . $expires);
        try {
            Mail::send('emails.activate', ['token' => $verificationToken], function($message) use($email){
                $message->to($email);
                $message->subject('Welcome to Afro-Train! Please activate your Account.');
            });
        } 
        catch (Exeption $e)
        {
            return $this->sendError("Couldn't Send Verification Email", 
                ['error'=>'Cound not send verification Eamil']
            );
        }
        return response()->json(["message"=>"Succussfull sent"]);
    }

    public function reset_password(Request $request)
    {
        $input = $request->all();
        $email = $input['email'] ?? null;
        $phone = $input['phone'] ?? null;
        
        // Validate that at least one of email or phone is provided
        if (empty($email) && empty($phone)) {
            return $this->sendError(__('messages.invalid_input'), ['error' => 'Either email or phone must be provided']);
        }
        
        $validation = Validator::make($request->all(), [
            'pin'                     => 'required|min:5',
            'password'                  => 'required|string|min:6|confirmed',
            'password_confirmation'     => 'required',
            'email'                    => 'nullable|email',
            'phone'                    => 'nullable|string',
        ]);
        
        if ($validation->fails()) {
            return $this->sendError(__('messages.invalid_input'), $validation->errors());
        }
        
        // Determine the identifier used for the reset token (email or phone)
        $identifier = $email ?? $phone;
        
        // Check if the reset token exists and is valid
        $updatePassword = DB::table('password_reset_tokens')
            ->where(['email' => $identifier, 'token' => $request->pin])
            ->first();
            
        if (!$updatePassword) {
            return $this->sendError(__('messages.invalid_request'), ['error' => 'Invalid or expired reset token']);
        }
        
        // Find the user by email or phone
        $user = $this->findUserByEmailOrPhone($email, $phone);
        
        if (!$user) {
            return $this->sendError(__('messages.invalid_email'), ['error' => 'User not found']);
        }
        
        // Update the user's password
        $user->update(['password' => Hash::make($request->password)]);
        
        // Clean up the used reset token
        DB::table('password_reset_tokens')->where(['email' => $identifier])->delete();

        return $this->sendResponse([], __('messages.password_changed_successfully'));
    }

    public function forgot_password(Request $request)
    {
        $input = $request->all();
        $user_email = $input['email'] ?? null;
        $user_phone = $input['phone'] ?? null;
        
        // Validate that at least one of email or phone is provided
        if (empty($user_email) && empty($user_phone)) {
            return $this->sendError(__('messages.invalid_input'), ['error' => 'Either email or phone must be provided']);
        }
        
        // Check if user exists with the provided email or phone
        $user = $this->findUserByEmailOrPhone($user_email, $user_phone);
        
        if ($user) {
            $token = rand(10000, 99999);
            $identifier = $user_email ?? $user_phone;
            
            // Clean up any existing reset tokens for this identifier
            DB::table('password_reset_tokens')->where(['email' => $identifier])->delete();
            
            // Insert new reset token
            DB::table('password_reset_tokens')->insert([
                'email' => $identifier, 
                'token' => $token, 
                'created_at' => Carbon::now()
            ]);
            
            // Send reset token via email or SMS
            if ($user_email) {
                try {
                    Mail::send('emails.password', ['token' => $token], function($message) use($user_email){
                        $message->to($user_email);
                        $message->subject( __('messages.Password_Reset_Email'));
                    });
                } catch (Exception $e) {
                    // Log the error but don't expose it to the user
                    \Log::error('Failed to send password reset email: ' . $e->getMessage());
                }
            } else {
                SmsHelper::sendSms($user_phone, __('messages.your_password_rest_pin_is').$token);
            }  
            
            return $this->sendResponse(1, __('messages.password_reset_otp_sent_successfully'));
        } else {
            return $this->sendError(__('messages.invalid_email'), ['error' => __('messages.invalid_email')]);
        }
    }

    public function resend_reset_email(Request $request)
    {

    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $this->sendResponse(1,"Logged out succesfully");
    }

    public function get_user()
    {   
        $user = Auth::user();
        $user_profile = User::whereId($user->id)->with('profile')->get();
        // dd($user_profile);
        $user->currentAccessToken()->delete();
        $success['token'] =  $user->createToken('token')->plainTextToken;
        $success['name'] =  $user->name;
        $success['email'] =  $user->email;
        $success['user'] = $user_profile;
        return $this->sendResponse($success, 'User login successfully.');
    }

    public function update_account(Request $request){
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'phone' => 'nullable',
            'referal_code' => 'nullable'
        ]);
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }
        $updated_user = $user->update($validator->validated());
        return $this->sendResponse($updated_user, "Account data updated succesfully");
    }

    public function check_verification(Request $request){
        $verification_time = Auth::user()->email_verified_at;
        if($verification_time == null){
            return $this->sendError("Email is not verified", "");
        }
        return $this->sendResponse(false, "Email Verified Succesfully");
    }

    /**
     * Check if a user exists with the given email or phone
     * 
     * @param string|null $email
     * @param string|null $phone
     * @return User|null
     */
    private function findUserByEmailOrPhone($email = null, $phone = null)
    {
        if (empty($email) && empty($phone)) {
            return null;
        }

        return User::where(function($query) use ($email, $phone) {
            if ($email) {
                $query->where('email', $email);
            }
            if ($phone) {
                $query->orWhere('phone', $phone);
            }
        })->first();
    }

    /**
     * Check if email or phone already exists in the system
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEmailOrPhoneExists(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError(__('messages.invalid_input'), $validator->errors());
        }

        $email = $request->input('email');
        $phone = $request->input('phone');

        if (empty($email) && empty($phone)) {
            return $this->sendError(__('messages.invalid_input'), ['error' => 'Either email or phone must be provided']);
        }

        $user = $this->findUserByEmailOrPhone($email, $phone);

        if ($user) {
            return $this->sendResponse([
                'exists' => true,
                'user_id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'name' => $user->name
            ], 'User found with provided email or phone');
        } else {
            return $this->sendResponse([
                'exists' => false
            ], 'No user found with provided email or phone');
        }
    }
}
