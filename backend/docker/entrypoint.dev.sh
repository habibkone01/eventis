#!/bin/sh
set -e

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

echo ">>> Démarrage de PHP-FPM..."
exec "$@"
