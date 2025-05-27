<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class FactureGenereeNotification extends Notification
{
    use Queueable;

    protected $factureId;
    protected $commandeId;

    public function __construct($factureId, $commandeId)
    {
        $this->factureId = $factureId;
        $this->commandeId = $commandeId;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Votre facture pour la commande #{$this->commandeId} est disponible.",
            'facture_id' => $this->factureId,
            'commande_id' => $this->commandeId,
        ];
    }
}
