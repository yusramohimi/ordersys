<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommandeClientNotification extends Notification
{
    use Queueable;

    protected $commandeId;
    protected $statut;

    public function __construct($commandeId, $statut)
    {
        $this->commandeId = $commandeId;
        $this->statut = $statut;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        $message = match ($this->statut) {
            'confirmée' => "Votre commande #{$this->commandeId} a été confirmée.",
            'livrée' => "Votre commande #{$this->commandeId} a été livrée.",
            default => "Mise à jour de votre commande #{$this->commandeId}.",
        };

        return [
            'message' => $message,
            'commande_id' => $this->commandeId,
            'statut' => $this->statut,
        ];
    }
}
