import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default function EvenementCard({ evenement }) {
    const dateDebut = new Date(evenement.date_debut)

    return (
        <div className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
            {/* Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden rounded-2xl m-3">
                <img src={evenement.image} alt={evenement.titre} className="w-full h-full object-cover" loading="lazy"/>
                {/* Badge catégorie */}
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {evenement.categorie?.libelle}
                </div>
            </div>

            <div className="px-4 pb-4 flex flex-col flex-1">
                {/* Titre */}
                <h3 className="font-extrabold text-base text-[#1a1a2e] leading-tight mb-3 line-clamp-2">
                    {evenement.titre}
                </h3>

                {/* Infos */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1">
                        <MapPin size={10} className="text-red-500 shrink-0" />
                        {evenement.localisation?.libelle}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1">
                        <Clock size={10} className="text-red-500 shrink-0" />
                        {dateDebut.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    {evenement.capacite_max && (
                        <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1">
                            <Calendar size={10} className="text-red-500 shrink-0" />
                            {evenement.capacite_max} places
                        </span>
                    )}
                </div>

                {/* Bouton */}
                <Link to={`/evenements/${evenement.id}`} className="mt-auto w-full py-3 rounded-2xl font-bold text-sm text-white text-center no-underline flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors">
                    S'inscrire
                </Link>
            </div>
        </div>
    )
}