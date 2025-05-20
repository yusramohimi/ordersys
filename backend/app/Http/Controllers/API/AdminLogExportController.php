<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use Illuminate\Support\Facades\Response;

class AdminLogExportController extends Controller
{
    public function exportCsv()
    {
        $logs = AdminLog::with('admin')->latest()->get();

        $csv = [];
        $csv[] = ['Date', 'Admin', 'Action', 'Description'];

        foreach ($logs as $log) {
            $csv[] = [
                $log->created_at->format('Y-m-d H:i:s'),
                $log->admin->nom ?? 'N/A',
                $log->action,
                $log->description,
            ];
        }

        $filename = 'admin_logs_' . now()->format('Ymd_His') . '.csv';

        $handle = fopen('php://temp', 'r+');
        foreach ($csv as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        return Response::stream(function () use ($handle) {
            fpassthru($handle);
        }, 200, $headers);
    }
}

