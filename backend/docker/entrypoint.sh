#!/bin/sh
set -e

if [ "$APP_ENV" = "production" ]; then

    echo ">>> [PROD] Lancement en mode production..."

    # Injection du mot de passe depuis le fichier secret Docker
    if [ -f /run/secrets/db_password ]; then
        export DB_PASSWORD=$(cat /run/secrets/db_password)
    fi

    echo ">>> [PROD] Migration de la base de données..."
    php artisan migrate --force

    # Seeder uniquement si la table users est vide
    USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1)
    if [ "$USER_COUNT" = "0" ]; then
        echo ">>> [PROD] Seeding de la base de données..."
        php artisan db:seed --class=UserSeeder --force
    fi

    echo ">>> [PROD] Mise en cache des configurations..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    echo ">>> [PROD] Création du lien storage..."
    php artisan storage:link

else

    echo ">>> [DEV] Lancement en mode développement..."

    echo ">>> [DEV] Attente de la base de données..."
    sleep 3

    # Installation des dépendances si vendor/ est vide (premier lancement)
    if [ ! -d "/var/www/vendor" ] || [ -z "$(ls -A /var/www/vendor)" ]; then
        echo ">>> [DEV] Installation des dépendances Composer..."
        composer install --no-interaction --prefer-dist
    fi

    if [ -z "$APP_KEY" ]; then
        echo ">>> [DEV] Génération de la clé d'application..."
        php artisan key:generate
    fi

    echo ">>> [DEV] Migration de la base de données..."
    php artisan migrate --force

    # Seeder uniquement si la table users est vide
    USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1)
    if [ "$USER_COUNT" = "0" ]; then
        echo ">>> [DEV] Seeding de la base de données..."
        php artisan db:seed
    fi

    echo ">>> [DEV] Nettoyage des caches..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear

fi

echo ">>> Démarrage de PHP-FPM en arrière-plan..."
php-fpm -D

echo ">>> Injection du port dans la config Nginx..."
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo ">>> Démarrage de Nginx..."
exec nginx -g "daemon off;"
