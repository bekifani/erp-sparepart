<?php
namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // Method to retrieve notifications for the authenticated user
    public function index(Request $request)
    {
        $user = Auth::user();  // Get the currently authenticated user
        
        // Retrieve unread notifications (optional) or all notifications
        $notifications = $user->notifications()->get();  // Fetch all notifications
        
        // Return the notifications as a JSON response
        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    // Method to mark notifications as read
    public function markAsRead(Request $request)
    {
        $user = Auth::user();  // Get the currently authenticated user

        // Check if the request has 'notification_ids' (array of notification IDs)
        $notificationIds = $request->input('notification_ids', []);

        // If there are notification IDs, mark them as read
        if (count($notificationIds) > 0) {
            $user->notifications()
                ->whereIn('id', $notificationIds)
                ->update(['read_at' => now()]);  // Mark notifications as read
        } else {
            // If no notification IDs are provided, mark all notifications as read
            $user->unreadNotifications->markAsRead();
        }

        // Return a response to confirm the notifications have been marked as read
        return response()->json([
            'message' => 'Notifications marked as read successfully',
        ]);
    }
}

