<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommandeMiseAJourNotification extends Notification
{
    use Queueable;

    protected $commandeId;
    protected $acteur; // 'client' ou 'livreur'
    protected $action; // 'mise à jour' ou 'annulée'

    public function __construct($commandeId, $acteur, $action)
    {
        $this->commandeId = $commandeId;
        $this->acteur = $acteur;
        $this->action = $action;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Commande #{$this->commandeId} {$this->action} par le {$this->acteur}.",
            'commande_id' => $this->commandeId,
            'action' => $this->action,
            'acteur' => $this->acteur,
        ];
    }
}
