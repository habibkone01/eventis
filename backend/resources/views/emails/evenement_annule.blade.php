<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Événement annulé</title>
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
            background-color: #1A1A2E;
            padding: 32px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            font-size: 24px;
            margin: 0;
        }

        .header p {
            color: #E63946;
            font-size: 14px;
            margin: 8px 0 0 0;
        }

        .body {
            padding: 32px;
        }

        .body h2 {
            color: #1A1A2E;
            font-size: 18px;
            margin-bottom: 8px;
        }

        .body p {
            color: #4B5563;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .event-card {
            background: #FFF0F0;
            border: 1px solid #FFD6D6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }

        .event-card h3 {
            color: #1A1A2E;
            font-size: 16px;
            margin: 0 0 12px 0;
        }

        .event-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .event-info span {
            color: #4B5563;
            font-size: 14px;
        }

        .badge {
            display: inline-block;
            background: #E63946;
            color: #fff;
            padding: 4px 12px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 12px;
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
            <h1>Éventis</h1>
            <p>Annulation d'événement</p>
        </div>
        <div class="body">
            <h2>Bonjour {{ $inscription->nom_participant }},</h2>
            <p>Nous vous informons que l'événement auquel vous étiez inscrit a été annulé. Nous nous excusons pour la
                gêne occasionnée.</p>
            <div class="event-card">
                <span class="badge">Annulé</span>
                <h3>{{ $evenement->titre }}</h3>
                <div class="event-info">
                    <span> Date : {{ $evenement->date_debut->format('d/m/Y à H:i') }}</span>
                    <span> Lieu : {{ $evenement->lieu ?? $evenement->localisation->libelle }}</span>
                </div>
            </div>
            <p>Votre inscription a été conservée dans notre système. Si vous avez des questions, n'hésitez pas à nous
                contacter.</p>
        </div>
        <div class="footer">
            <p>© 2026 Éventis — Abidjan, Côte d'Ivoire</p>
        </div>
    </div>
</body>

</html>
