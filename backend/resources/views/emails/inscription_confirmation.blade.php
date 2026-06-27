<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation d'inscription</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 40px 16px;
        }

        .ticket {
            max-width: 540px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 24px #0000001a;
        }

        /* Bande rouge en haut */
        .ticket-top-bar {
            background: #E63946;
            padding: 14px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .ticket-top-bar-logo {
            color: #fff;
            font-size: 16px;
            font-weight: 900;
            letter-spacing: -0.5px;
        }

        .ticket-top-bar-logo span {
            color: #1A1A2E;
        }

        .ticket-top-bar-status {
            color: #ffffffd9;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        /* Hero */
        .ticket-hero {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            padding: 24px 24px 20px;
            border-bottom: 1px solid #F3F4F6;
        }

        .ticket-hero-img {
            width: 90px;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
            flex-shrink: 0;
        }

        .ticket-hero-placeholder {
            width: 90px;
            height: 90px;
            background: #F3F4F6;
            border-radius: 8px;
            flex-shrink: 0;
        }

        .ticket-hero-info {
            flex: 1;
            padding-top: 4px;
        }

        .ticket-hero-greeting {
            font-size: 11px;
            color: #9CA3AF;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .ticket-hero-title {
            font-size: 20px;
            font-weight: 900;
            color: #1A1A2E;
            line-height: 1.2;
            margin-bottom: 8px;
        }

        .ticket-hero-name-label {
            font-size: 11px;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .ticket-hero-name {
            font-size: 14px;
            font-weight: 700;
            color: #1A1A2E;
        }

        /* Grille infos */
        .ticket-infos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 0 24px;
        }

        .ticket-info-item {
            padding: 18px 0;
            border-bottom: 1px solid #F3F4F6;
        }

        .ticket-info-item.full {
            grid-column: 1 / -1;
        }

        .ticket-info-item:nth-child(odd):not(.full) {
            border-right: 1px solid #F3F4F6;
            padding-right: 20px;
        }

        .ticket-info-item:nth-child(even):not(.full) {
            padding-left: 20px;
        }

        .ticket-info-label {
            font-size: 11px;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .ticket-info-value {
            font-size: 15px;
            font-weight: 700;
            color: #1A1A2E;
            line-height: 1.3;
        }

        /* Séparateur tirets */
        .ticket-dashed {
            border: none;
            border-top: 2px dashed #E5E7EB;
            margin: 0 -12px;
        }

        /* Désinscription */
        .ticket-desinscription {
            padding: 20px 24px;
            text-align: center;
        }

        .ticket-desinscription p {
            font-size: 12px;
            color: #9CA3AF;
            margin-bottom: 12px;
            line-height: 1.6;
        }

        .ticket-desinscription a {
            font-size: 12px;
            color: #E63946;
            font-weight: 600;
            text-decoration: underline;
        }

        /* Footer */
        .ticket-footer {
            background: #F9FAFB;
            padding: 14px 24px;
            text-align: center;
            border-top: 1px solid #F3F4F6;
        }

        .ticket-footer p {
            color: #D1D5DB;
            font-size: 11px;
        }
    </style>
</head>

<body>
    <div class="ticket">

        <div class="ticket-top-bar">
            <div class="ticket-top-bar-logo">Évent<span>is</span></div>
            <div class="ticket-top-bar-status">Inscription confirmée</div>
        </div>

        <div class="ticket-hero">
            @if($inscription->evenement->image)
                <img
                    src="{{ config('app.url') }}/storage/{{ $inscription->evenement->image }}"
                    alt="{{ $inscription->evenement->titre }}"
                    class="ticket-hero-img"
                />
            @else
                <div class="ticket-hero-placeholder"></div>
            @endif

            <div class="ticket-hero-info">
                <div class="ticket-hero-greeting">Votre billet</div>
                <div class="ticket-hero-title">{{ $inscription->evenement->titre }}</div>
                <div class="ticket-hero-name-label">Participant</div>
                <div class="ticket-hero-name">{{ $inscription->nom_participant }}</div>
            </div>
        </div>

        <div class="ticket-infos">
            <div class="ticket-info-item">
                <div class="ticket-info-label">Date</div>
                <div class="ticket-info-value">{{ $inscription->evenement->date_debut->format('d/m/Y') }}</div>
            </div>
            <div class="ticket-info-item">
                <div class="ticket-info-label">Heure</div>
                <div class="ticket-info-value">{{ $inscription->evenement->date_debut->format('H:i') }}</div>
            </div>
            <div class="ticket-info-item full">
                <div class="ticket-info-label">Lieu</div>
                <div class="ticket-info-value">{{ $inscription->evenement->lieu ?? $inscription->evenement->localisation->libelle }}</div>
            </div>
            <div class="ticket-info-item full" style="border-bottom:none">
                <div class="ticket-info-label">Email</div>
                <div class="ticket-info-value" style="font-size:13px;font-weight:600;color:#4B5563">{{ $inscription->email_participant }}</div>
            </div>
        </div>

        <hr class="ticket-dashed">

        <div class="ticket-desinscription">
            <p>Vous ne pouvez plus participer ?</p>
            <a href="{{ env('FRONTEND_URL') }}/desinscription/{{ $inscription->token_desinscription }}">
                Me désinscrire de cet événement
            </a>
        </div>

        <div class="ticket-footer">
            <p>© 2026 Éventis — Abidjan, Côte d'Ivoire</p>
        </div>
    </div>
</body>

</html>
