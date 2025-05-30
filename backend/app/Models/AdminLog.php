<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;

class AdminLog extends Model
{
    protected $fillable = [
        'admin_id',
        'action',
        'entity_type',
        'entity_id',
        'description',
        'ip_address',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    public static function logAction($adminId, $action, $entityType, $entityId, $ip, $details = [])
    {
        if (!$adminId) {
            Log::warning('Tentative de création de log admin sans admin_id.', [
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'ip' => $ip,
                'details' => $details,
            ]);
            return;
        }

        $description = match ($action) {
            'create' => "Création de $entityType (ID $entityId)",
            'update' => "Mise à jour de $entityType (ID $entityId)",
            'delete' => "Suppression de $entityType (ID $entityId)",
            'login'  => "Connexion à l'espace admin (ID $adminId)",
            default  => ucfirst($action) . " de $entityType (ID $entityId)",
        };

        if (!empty($details)) {
            $description .= ' — ' . json_encode($details, JSON_UNESCAPED_UNICODE);
        }

        self::create([
            'admin_id'    => $adminId,
            'action'      => $action,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'description' => $description,
            'ip_address'  => $ip,
        ]);
    }
}
