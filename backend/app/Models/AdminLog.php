<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminLog extends Model
{
    protected $fillable = ['admin_id', 'action', 'entity_type', 'entity_id', 'description', 'ip_address'];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
