import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default function EvenementCard({ evenement }) {
    const dateDebut = new Date(evenement.date_debut)

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="h-40 relative">
                {evenement.image_url ? (
                    <img src={evenement.image_url} alt={evenement.titre} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center">
                        <Calendar size={36} className="text-white opacity-50" />
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {evenement.categorie?.libelle}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2">{evenement.titre}</h3>
                <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={11} className="text-red-500 shrink-0" />
                        {evenement.localisation?.libelle}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={11} className="text-red-500 shrink-0" />
                        {dateDebut.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {evenement.capacite_max && (
                        <span className="text-xs text-gray-400">
                            Places : <strong className="text-gray-600">{evenement.capacite_max}</strong>
                        </span>
                    )}
                    <Link
                        to={`/evenements/${evenement.id}`}
                        className="ml-auto bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors no-underline"
                    >
                        S'inscrire
                    </Link>
                </div>
            </div>
        </div>
    )
}