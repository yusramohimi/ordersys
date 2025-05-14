<?php
header('Content-Type: application/json');

// Connexion à la base de données (modifie selon ton setup)
$pdo = new PDO('mysql:host=localhost;dbname=ordersys;charset=utf8', 'root', '');

// Lire le code promo envoyé
$code = $_POST['code'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM code_promos WHERE code = :code AND expire_le >= NOW() AND utilisations_actuelles < utilisations_max");
$stmt->execute(['code' => $code]);
$promo = $stmt->fetch(PDO::FETCH_ASSOC);

if ($promo) {
    echo json_encode([
        'valide' => true,
        'reduction' => $promo['reduction'],
        'type' => $promo['type']
    ]);
} else {
    echo json_encode(['valide' => false]);
}
