<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Bienvenue chez Santé Parodonte</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
            background-color: #e6ffec;
            text-align: center;
            padding: 20px;
        }
        .header img {
            max-height: 50px;
        }
        .content {
            padding: 30px;
        }
        .content h1 {
            color: #2f855a;
            font-size: 22px;
        }
        .credentials {
            background-color: #f0fff4;
            border-left: 4px solid #38a169;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="{{ asset('storage/logo-fr.png') }}" alt="Logo" style="max-height: 50px;">
        </div>
        <div class="content">
            <h1>Bienvenue chez Santé Parodonte !</h1>
            <p>Bonjour,</p>
            <p>Merci pour votre commande. Voici vos identifiants pour accéder à votre espace client :</p>

            <div class="credentials">
                <p><strong>Email :</strong> {{ $email }}</p>
                <p><strong>Mot de passe :</strong> {{ $password }}</p>
            </div>

            <p>Vous pouvez vous connecter dès maintenant pour suivre vos commandes et accéder à vos factures.</p>
            <p>Cordialement,<br>L'équipe Santé Parodonte</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Santé Parodonte. Tous droits réservés.
        </div>
    </div>
</body>
</html>
