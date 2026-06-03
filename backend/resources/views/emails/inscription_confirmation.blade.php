<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation d'inscription</title>
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
            margin-bottom: 8px;
        }

        .body p {
            color: #4B5563;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .event-card {
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
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

        .lien-desinscription {
            text-align: center;
            margin-top: 24px;
        }

        .lien-desinscription p {
            color: #9CA3AF;
            font-size: 13px;
        }

        .lien-desinscription a {
            color: #E63946;
            font-size: 13px;
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
            <h1>Inscription confirmée !</h1>
        </div>
        <div class="body">
            <h2>Bonjour {{ $inscription->nom_participant }},</h2>
            <p>Votre inscription à l'événement suivant a bien été enregistrée. Nous vous attendons !</p>
            <div class="event-card">
                <h3>{{ $inscription->evenement->titre }}</h3>
                <div class="event-info">
                    <span> Date : {{ $inscription->evenement->date_debut->format('d/m/Y à H:i') }}</span>
                    <span> Lieu : {{ $inscription->evenement->lieu ?? $inscription->evenement->localisation->libelle }}</span>
                </div>
            </div>
            <div class="lien-desinscription">
                <p>Vous ne pouvez plus participer ? Désinscrivez-vous en cliquant sur le lien ci-dessous :</p>
                <a href="{{ config('app.url') }}/desinscription/{{ $inscription->token_desinscription }}">
                    Me désinscrire de cet événement
                </a>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Éventis — Abidjan, Côte d'Ivoire</p>
        </div>
    </div>
</body>

</html>
