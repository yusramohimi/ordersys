<?php

namespace App\Traits;

use App\Models\AdminLog;

trait LogsAdminActions
{
    public function logAdminAction($action, $entityType, $entityId, $details = [])
    {
        AdminLog::logAction(
            auth('admin')->id(), 
            $action,
            $entityType,
            $entityId,
            request()->ip(),
            $details
        );
    }
}
