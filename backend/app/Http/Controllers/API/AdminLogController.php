<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use Illuminate\Http\Request;

class AdminLogController extends Controller
{
    public function index()
    {
        return AdminLog::with('admin:id,nom,email')
            ->latest()
            ->take(50)
            ->get();
    }
}
