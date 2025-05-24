<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #000;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .logo {
            width: 150px;
        }
        .invoice-info {
            text-align: right;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        th {
            background: #f4f4f4;
        }
        .totals {
            margin-top: 20px;
            float: right;
            width: 300px;
        }
        .totals td {
            border: none;
            padding: 4px 8px;
        }
        .footer {
            margin-top: 50px;
            font-size: 10px;
            color: #555;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="header">
        <div>
            <img src="{{ public_path('images/logo-fr.png') }}" class="logo" alt="Logo">
        </div>
        <div class="invoice-info">
            <h2>Facture #{{ $commande->id }}</h2>
            <p>Date : {{ $commande->created_at->format('d/m/Y') }}</p>
            <p>Échéance : {{ now()->addDays(30)->format('d/m/Y') }}</p>
        </div>
    </div>

    <h4>Client</h4>
    <p>
        {{ $commande->client->nom }}<br/>
        {{ $commande->client->adresse }}<br/>
        {{ $commande->client->ville }}<br/>
        Email : {{ $commande->client->email }}<br/>
        Téléphone : {{ $commande->client->telephone }}
    </p>

    <h4>Détails de la commande</h4>
    <table>
        <thead>
            <tr>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($commande->produits as $produit)
            <tr>
                <td>{{ $produit->nom }}</td>
                <td>{{ $produit->pivot->quantite }}</td>
                <td>{{ number_format($produit->prix_unitaire, 2, ',', ' ') }} €</td>
                <td>{{ number_format($produit->prix_unitaire * $produit->pivot->quantite, 2, ',', ' ') }} €</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td><strong>Total HT :</strong></td>
            <td>{{ number_format($commande->prix_total / 1.2, 2, ',', ' ') }} €</td>
        </tr>
        <tr>
            <td><strong>TVA (20%) :</strong></td>
            <td>{{ number_format($commande->prix_total * 0.2 / 1.2, 2, ',', ' ') }} €</td>
        </tr>
        <tr>
            <td><strong>Total TTC :</strong></td>
            <td>{{ number_format($commande->prix_total, 2, ',', ' ') }} €</td>
        </tr>
    </table>

    <div class="footer">
        <p>Société ABC - Adresse - RC, ICE, IF, Patente, CNSS, TVA</p>
    </div>

</body>
</html>
