<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #E63946;
            padding: 32px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            font-size: 24px;
            margin: 0;
        }

        .body {
            padding: 32px;
        }

        .body h2 {
            color: #1A1A2E;
            font-size: 18px;
            margin-bottom: 16px;
        }

        .champ {
            margin-bottom: 16px;
        }

        .champ label {
            display: block;
            font-size: 12px;
            font-weight: bold;
            color: #6B7280;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .champ p {
            color: #1A1A2E;
            font-size: 15px;
            margin: 0;
            background: #F9FAFB;
            padding: 12px;
            border-radius: 6px;
        }

        .footer {
            background: #F9FAFB;
            padding: 20px 32px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }

        .footer p {
            color: #9CA3AF;
            font-size: 12px;
            margin: 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Éventis — Nouveau message de contact</h1>
        </div>
        <div class="body">
            <h2>Vous avez reçu un nouveau message</h2>
            <div class="champ">
                <label>Nom</label>
                <p>{{ $data['nom'] }}</p>
            </div>
            <div class="champ">
                <label>Email</label>
                <p>{{ $data['email'] }}</p>
            </div>
            <div class="champ">
                <label>Sujet</label>
                <p>{{ $data['sujet'] }}</p>
            </div>
            <div class="champ">
                <label>Message</label>
                <p>{{ $data['message'] }}</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Éventis — Abidjan, Côte d'Ivoire</p>
        </div>
    </div>
</body>

</html>
