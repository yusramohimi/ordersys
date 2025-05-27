<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;

class NouvelleCommandeNotification extends Notification
{
    use Queueable;

    public $commandeId;

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
            'message' => "Une nouvelle commande #{$this->commandeId} a été passée.",
            'commande_id' => $this->commandeId
        ];
    }
}
