<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommandeAffecteeLivreurNotification extends Notification
{
    use Queueable;

    protected $commandeId;

    public function __construct($commandeId)
    {
        $this->commandeId = $commandeId;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Une commande (#{$this->commandeId}) vous a été attribuée.",
            'commande_id' => $this->commandeId,
        ];
    }
}
