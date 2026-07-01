import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,         // 10 utilisateurs simultanés
    duration: '30s', // pendant 30 secondes
};

const BASE_URL = 'https://eventis-production.up.railway.app/api';

export default function () {
    // Test 1 — Liste des événements
    const evenements = http.get(`${BASE_URL}/evenements`);
    check(evenements, {
        'evenements: status 200': (r) => r.status === 200,
        'evenements: temps < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);

    // Test 2 — Liste des catégories
    const categories = http.get(`${BASE_URL}/categories`);
    check(categories, {
        'categories: status 200': (r) => r.status === 200,
        'categories: temps < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);

    // Test 3 — Détail d'un événement
    const evenement = http.get(`${BASE_URL}/evenements/1`);
    check(evenement, {
        'evenement detail: status 200': (r) => r.status === 200,
        'evenement detail: temps < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);

    // Test 4 — Liste des localisations
    const localisations = http.get(`${BASE_URL}/localisations`);
    check(localisations, {
        'localisations: status 200': (r) => r.status === 200,
        'localisations: temps < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}