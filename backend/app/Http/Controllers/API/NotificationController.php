<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    // 🔹 Affiche les notifications de l'utilisateur connecté
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'notifications' => $user->notifications()->latest()->take(10)->get()
        ]);
    }

    // 🔹 Notifications non lues
    public function unread(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'unread' => $user->unreadNotifications()->latest()->get()
        ]);
    }

    // 🔹 Marquer une notification comme lue
    public function markAsRead($id)
    {
        $notification = DatabaseNotification::findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    // 🔹 Marquer toutes les notifications comme lues
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }

    // 🔹 Supprimer une notification
    public function destroy($id)
    {
        $notification = DatabaseNotification::findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification supprimée']);
    }
}
